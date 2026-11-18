class ExpressError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

const AsyncError = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};

export { AsyncError, ExpressError };
