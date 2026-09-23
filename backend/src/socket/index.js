/**
 * Reserved for real-time features (e.g. broadcasting a shared graph
 * session, live-updating a team's calculation log). Not used yet —
 * the calculator works entirely over plain HTTP.
 *
 * To wire this up later:
 *   1. npm install socket.io
 *   2. const { Server } = require("socket.io");
 *      function initSocket(httpServer) {
 *        const io = new Server(httpServer, { cors: { origin: process.env.CLIENT_URL } });
 *        io.on("connection", (socket) => { ... });
 *        return io;
 *      }
 *   3. In server.js, create an http.Server from `app`, pass it to
 *      initSocket, and call httpServer.listen(...) instead of app.listen(...).
 */
function initSocket(/* httpServer */) {
  console.log("Socket layer not yet configured — see src/socket/index.js");
}

module.exports = { initSocket };
