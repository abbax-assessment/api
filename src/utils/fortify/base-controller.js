const fortify = require("./index");

class BaseController {
  constructor() {
    fortify.fortify(this);
  }
}

module.exports = BaseController;
