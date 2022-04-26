//Wraps async functions within a promise so that if an error occurs, they can be caught.

function asyncErrorBoundary(delegate, defaultStatus) {
  return (request, response, next) => {
    Promise.resolve()
      .then(() => delegate(request, response, next))
      .catch((error = {}) => {
        const { status = defaultStatus, message = error } = error;
        next({
          status,
          message,
        });
      });
  };
}

module.exports = asyncErrorBoundary;
