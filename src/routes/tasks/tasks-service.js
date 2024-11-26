const { Producer } = require("sqs-producer")
// create simple producer
const producer = Producer.create({
  queueUrl: 'https://sqs.eu-west-1.amazonaws.com/569985934894/tsk-dev-tasks',
});

const { v4: uuid } = require("uuid")

class TasksService {
  constructor() { }

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
