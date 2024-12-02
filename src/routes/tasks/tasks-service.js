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
  constructor() { }

  async getTasks() {
    const tableName = process.env.TASKS_DYNAMODB_TABLE;
    try {
      const results = await scanTable(tableName);
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
      segment.addAnnotation("Environment", process.env.ENVIRONMENT);
      segment.addMetadata("TaskPayload", tasks);
    }
    await producer.send(tasks.map((task) => {
      const taskId = uuid();
      const payload = {
        id: taskId,
        body: JSON.stringify({
          taskBody: { id: taskId, ...task }
        })
      }

      newTasks.push(payload);
      return payload;
    }))

    return newTasks;
  }


  async deleteTasks() {
    // batch delete on dynamodb
  }
}
module.exports = TasksService;
