const { Producer } = require("sqs-producer")

// const producer = Producer.create({
//   queueUrl: process.env.TASKS_QUEUE_URL
// });

const { v4: uuid } = require("uuid");
const getXray = require("../../utils/xray");
const AWSXRay = getXray();

class TasksService {
  constructor() { }

  async getTasks() {
    //
  }

  async createTasks(tasks) {
    tasks = Array.isArray(tasks) ? tasks : [tasks];
    const newTasks = [];
    if (AWSXRay) {
      const segment = AWSXRay.getSegment();
      segment.addAnnotation("Environment", process.env.ENVIRONMENT);
      segment.addMetadata("TaskPayload", tasks);
    }
    // await producer.send(tasks.map((task) => {
    //   const taskId = uuid();
    //   const payload = {
    //     id: taskId,
    //     body: JSON.stringify({
    //       taskBody: { id: taskId, ...task }
    //     })
    //   }      

    //   newTasks.push(payload);
    //   return payload;
    // }))

    return newTasks;
  }


  async deleteTasks() {
    // batch delete on dynamodb
  }
}
module.exports = TasksService;
