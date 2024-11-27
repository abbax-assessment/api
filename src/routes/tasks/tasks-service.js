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
      return {
        id: taskId,
        body: JSON.stringify(task)
      }
    }))
  }

  async deleteTasks() {
    // batch delete on dynamodb
  }
}
module.exports = TasksService;
