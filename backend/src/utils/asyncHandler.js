/**
 * Wraps an async route handler so a thrown/rejected error is forwarded
 * to Express's error middleware automatically, instead of needing a
 * try/catch + next(err) in every controller function.
 *
 * The calculator controller currently uses explicit try/catch (so each
 * error can get a 400 status), but this is here — matching the
 * reference project's utils/ folder — for any handler that's fine with
 * the default error status.
 *
 * Usage: router.get("/thing", asyncHandler(async (req, res) => { ... }));
 */
function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
