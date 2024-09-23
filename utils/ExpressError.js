class ExpressError extends Error {
  constructor(statusCode, message) {
    super();
    this.statuscode = statuscode;
    this.message = message;
  }
}
module.exports = ExpressError;
