const msgForm = document.querySelector("#msg-form");
const msgContainer = document.querySelector(".msg-container");
msgForm.querySelector("input[type='text']").focus();

/* ____________________________ */
const HOST_ADDRESS = location.host.replace(/:\w+/, "");

let userName = "unknown";
let socket = new WebSocket(`ws://${HOST_ADDRESS}:5001`);
setUpSocket(socket);
socket.onopen = () => {
   userName = prompt("Enter your name");
   socket.send(
      JSON.stringify({
         name: userName,
      })
   );
};

const unsentMsgs = [];

msgForm.addEventListener("submit", e => {
   e.preventDefault();
   const sendText = document.querySelector("#msg-txt");
   if (sendText.value === "") return;
   if (socket.readyState == 1) {
      socket.send(sendText.value);
      displayMsg(sendText.value, "s", "You").scrollIntoView();
      sendText.value = "";
   } else {
      unsentMsgs.push(sendText.value);
      const newMsg = displayMsg(sendText.value, "s", "You");
      newMsg.scrollIntoView();
      newMsg.classList.add("not-sent");
      sendText.value = "";
      console.log("server not connected");
      socket = new WebSocket(`ws://${HOST_ADDRESS}:5001`);
      setUpSocket(socket);
   }
});

function displayMsg(msg, cls, senderName) {
   const li = document.createElement("li");
   li.classList.add(cls);
   const txtNode = document.createTextNode(msg);
   li.appendChild(txtNode);
   li.setAttribute("data-attr", senderName);
   msgContainer.appendChild(li);
   return li;
}

function setUpSocket(webSocket) {
   //onopen function get executed when web socket connection is established
   webSocket.onopen = () => {
      socket.send(
         JSON.stringify({
            name: userName,
         })
      );
      let unsentMsg = unsentMsgs.shift();
      while (unsentMsg) {
         socket.send(unsentMsg);
         document.querySelector(".not-sent").classList.remove("not-sent");
         unsentMsg = unsentMsgs.shift();
      }
   };

   webSocket.onmessage = ({ data }) => {
      data = JSON.parse(data);
      displayMsg(data.msg, "r", data.senderName).scrollIntoView();
   };
}
