const WebSocket = require("ws");
const http = require("http");
const { readFileSync } = require("fs");
const { join } = require("path");

const socketServer = new WebSocket.Server({ port: "5001" });

const users = [];

socketServer.on("connection", socket => {
   socket.on("close", () => {
      const indexOfClose = users.indexOf(socket);
      users.splice(indexOfClose, 1);
   });

   users.push(socket);

   socket.on("message", msg => {
      try {
         msg = JSON.parse(msg.toString());
         socket.name = msg.name;
         console.log(msg.name);
      } catch {
         users.forEach(user => {
            if (user != socket) {
               user.send(
                  JSON.stringify({
                     senderName: socket.name,
                     msg: msg.toString(),
                  })
               );
            }
         });
         console.log(msg.toString());
      }
   });
});

const server = http.createServer((req, res) => {
   let contentType;
   let fileName = req.url;
   fileName = fileName == "/" ? "index.html" : fileName.replace(/^\//, "");

   if (req.url == "/") contentType = "text/html";
   else if (req.url == "/style.css") contentType = "text/css";
   else if (req.url == "/script.js") contentType = "text/js";

   if (contentType) {
      res.writeHead(200, {
         "Content-Type": contentType,
      });
      const fileContent = readFileSync(
         join(__dirname, "..", "client", fileName)
      );
      res.end(fileContent);
   }
});

server.listen(5000, () => {
   console.log("!!Server running on port 5000!!");
});
