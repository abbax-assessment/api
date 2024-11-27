const { Producer } = require("sqs-producer")
// create simple producer
const producer = Producer.create({
  queueUrl: process.env.TASKS_QUEUE_URL
});

const { v4: uuid } = require("uuid")

class TasksService {
  constructor() { }

  async getTasks() {
    //
  }

  async createTasks(tasks) {
    tasks = Array.isArray(tasks) ? tasks : [tasks];
    await producer.send(tasks.map((task) => {
      const taskId = uuid();
      const traceHeader = AWSXRay.getSegment().trace_id;
      return {
        id: taskId,
        body: {
          traceHeader,
          taskBody: JSON.stringify({ id: taskId, ...task })
        }
      }
    }))
  }

  async deleteTasks() {
    // batch delete on dynamodb
  }
}
module.exports = TasksService;
