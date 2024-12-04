const Logger = require("../../utils/logger");
const { Producer } = require("sqs-producer");
const AWS = require("aws-sdk");

const logger = Logger.create();

const producer = Producer.create({
  queueUrl: process.env.TASKS_QUEUE_URL
});

const docClient = new AWS.DynamoDB.DocumentClient();
const scanTable = async (tableName) => {
  const params = {
    TableName: tableName,
  };

  try {
    const data = await docClient.scan(params).promise();
    logger.info('Scan succeeded', { items: data.Items.length });
    return data.Items;
  } catch (err) {
    logger.error('Unable to scan table:', { error: err });
    throw err;
  }
};

const { v4: uuid } = require("uuid");
const getXray = require("../../utils/xray");
const AWSXRay = getXray();

class TasksService {

  constructor() {
    this.tableName = process.env.TASKS_DYNAMODB_TABLE;
    this.log = Logger.create({ tableName: this.tableName })
  }

  async getTasks() {
    try {
      const results = await scanTable(this.tableName);
      return results;
    } catch (error) {
      logger.error('Error scanning the table', { error });
    }
  }

  async createTasks(tasks) {
    tasks = Array.isArray(tasks) ? tasks : [tasks];
    const newTasks = [];

    if (AWSXRay) {
      const segment = AWSXRay.getSegment();
      
      // Create subsegment for the overall task creation
      const taskCreationSubsegment = segment.addNewSubsegment('TaskCreation');
      taskCreationSubsegment.addAnnotation("TasksCount", tasks.length);
      taskCreationSubsegment.addAnnotation("Environment", process.env.ENVIRONMENT);
      taskCreationSubsegment.addMetadata("TasksPayload", tasks);
    }

    // Process each task
    await Promise.all(tasks.map(async (task) => {
      const taskId = uuid();
      const payload = {
        id: taskId,
        body: JSON.stringify({
          taskBody: { id: taskId, ...task }
        })
      };

      newTasks.push(payload);

      if (AWSXRay) {
        const segment = AWSXRay.getSegment();

        // Create a subsegment for each task's SQS operation
        const taskSubsegment = segment.addNewSubsegment(`Task-SQS-${taskId}`);
        taskSubsegment.addAnnotation("TaskId", taskId);
        taskSubsegment.addAnnotation("Environment", process.env.ENVIRONMENT);
        taskSubsegment.addMetadata("TaskPayload", task);

        // Add trace header to message for downstream propagation
        payload.messageAttributes = {
          AWSTraceHeader: {
            DataType: 'String',
            StringValue: AWSXRay.utils.getTraceHeader(segment)  // Propagate trace context
          }
        };

        // Send the SQS message and close the subsegment when done
        await producer.send([payload]);
        taskSubsegment.close(); // Close task subsegment once SQS operation is done
      }

      return payload;
    }));

    // Close the task creation subsegment once all tasks are processed
    if (AWSXRay) {
      const segment = AWSXRay.getSegment();
      const taskCreationSubsegment = segment.subsegments.find(subsegment => subsegment.name === 'TaskCreation');
      if (taskCreationSubsegment) {
        taskCreationSubsegment.close(); // Close the overall task creation subsegment
      }
    }

    return newTasks;
  }

  async deleteTasks() {
    try {
      // Step 1: Scan the table to get all items
      const tasks = await scanTable(this.tableName);

      if (!tasks || tasks.length === 0) {
        logger.info('No tasks found to delete.');
        return;
      }

      // Step 2: Delete each item from the table
      const deletePromises = tasks.map((task) => {
        const params = {
          TableName: this.tableName,
          Key: {
            taskId: task.taskId,
            timestamp: task.timestamp
          }
        };

        return docClient.delete(params).promise();
      });

      await Promise.all(deletePromises);

      logger.info('All tasks deleted successfully', { deletedCount: tasks.length });
    } catch (error) {
      logger.error('Error deleting tasks', { error });
      throw error;
    }
  }
}

module.exports = TasksService;
