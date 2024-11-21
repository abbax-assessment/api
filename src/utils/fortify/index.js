
// Gets all non-builtin properties up the prototype chain
const getAllProperties = (object) => {
  const properties = new Set();

  do {
    Reflect.ownKeys(object).forEach((key) => properties.add([object, key]));
  } while ((object = Reflect.getPrototypeOf(object)) && object !== Object.prototype);

  return Array.from(properties);
};

class OverArmour {
  constructor(failFunc = this.failFunDefault) {
    this.fail = failFunc;
  }

  isAsync(fn) {
    const AsyncFunction = (async () => { }).constructor;
    return fn instanceof AsyncFunction;
  }

  // Default catch
  failFunDefault(className, functionName, error, func, req, next) {
    next(error);
  }

  /** Make any function failsafe */
  ironclad(func, fail, className, functionName) {
    if (this.isAsync(func)) {
      return async (req, res, next, ...rest) => {
        try {
          await func(req, res, next, ...rest);
        } catch (e) {
          if (fail) fail(className, functionName, e, func, req, next);
        }
      };
    }
    return (req, res, next, ...rest) => {
      try {
        func(req, res, next, ...rest);
      } catch (e) {
        if (fail) fail(className, functionName, e, func, req, next);
      }
    };
  }

  /** Make all methods on any Object fortified */
  fortify(bareObj) {
    const className = Object.getPrototypeOf(Object.getPrototypeOf(bareObj)).constructor.name;
    const methods = getAllProperties(bareObj)
      .filter(([, key]) => key !== "constructor")
      .filter(([object, key]) => {
        const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
        return descriptor && typeof descriptor.value === "function";
      });
    methods.forEach(([, functionName]) => {
      const BoundUnsafeFunction = bareObj[functionName].bind(bareObj);
      bareObj[functionName] = this.ironclad(
        BoundUnsafeFunction,
        this.fail,
        className,
        functionName
      );
    });
  }
}


module.exports = new OverArmour();