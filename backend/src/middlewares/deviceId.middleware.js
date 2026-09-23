/**
 * No login system in this project — the frontend generates a random id
 * on first visit (see frontend/src/utils/deviceId.js) and sends it on
 * every request. We just read it here; a missing header simply means
 * "don't save history for this request", not an error.
 */
module.exports = function deviceId(req, res, next) {
  const id = req.header("x-device-id");
  req.deviceId = typeof id === "string" && id.trim() ? id.trim() : null;
  next();
};
