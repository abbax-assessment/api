const TasksService = require("./tasks-service");
const TasksController = require("./tasks-controller");
const TasksRouter = require("./tasks-router");

const tasksService = new TasksService();
const tasksController = new TasksController(tasksService);
const tasksRouter = new TasksRouter(
    tasksController
);

const { routes } = tasksRouter;

module.exports = routes;