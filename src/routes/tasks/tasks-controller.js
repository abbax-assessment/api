const BaseController = require("../../utils/fortify/base-controller");

class TasksController extends BaseController {
  tasksService;

  constructor(tasksService) {
    super();
    this.tasksService = tasksService;
  }

  async getTasks(req, res) {
    const result = await this.tasksService.getTasks(req.body);
    res.send(result);
  }  

  async createTasks(req, res) {
    await this.tasksService.createTasks(req.body);
    res.status(200)
  } 

  async deleteTasks(req, res) {
    const result = await this.tasksService.deleteTasks();
    res.send(result);
  } 
  
}
module.exports = TasksController;
