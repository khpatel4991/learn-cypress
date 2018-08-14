const io = require("socket.io")({
  serveClient: false
});

io.attach(5000, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

