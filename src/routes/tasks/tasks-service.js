class TasksService {
  constructor() { }

  async getTasks() {
    return [{
      id: 1,
      attempts: 1,
      status: "running",
      type: "light",
      resourceIntensive: "cpu",
      failPercentage: 10
    },
    {
      id: 3,
      attempts: 1,
      status: "done",
      type: "light",
      resourceIntensive: "cpu",
      failPercentage: 10
    },
    {
      id: 2,
      attempts: 3,
      status: "failed",
      type: "light",
      resourceIntensive: "cpu",
      failPercentage: 10
    }
    ];
  }

  async createTasks(tasks) {
    // put on dynamodb batch
  }

  async deleteTasks() {
    // batch delete on dynamodb
  }
}
module.exports = TasksService;
