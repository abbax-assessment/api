const { Router } = require("express");

class TasksRouter {
  routes;

  constructor(tasksController) {
    this.routes = Router();
    this.routes.get(
      "/",
      tasksController.getTasks
    );

    this.routes.post(
      "/create",
      tasksController.createTasks
    );
    this.routes.delete(
      "/all",
      tasksController.deleteTasks
    )
    
  }
}
module.exports = TasksRouter;
