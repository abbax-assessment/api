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
    const createdTasks = await this.tasksService.createTasks(req.body);
    res.send(createdTasks)
  } 

  async deleteTasks(req, res) {
    const result = await this.tasksService.deleteTasks();
    res.send(result);
  } 
  
}
module.exports = TasksController;
