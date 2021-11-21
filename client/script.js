const msgForm = document.querySelector("#msg-form");
const msgContainer = document.querySelector(".msg-container");

/* ____________________________ */
const HOST_ADDRESS = location.host.replace(/:\w+/, "").replace("www.", "");
console.log(HOST_ADDRESS);
const socket = new WebSocket(`ws://${HOST_ADDRESS}:5001`);

//onopen function get executed when web socket connection is established
socket.onopen = () => {
   const name = prompt("Enter your name");
   socket.send(
      JSON.stringify({
         name,
      })
   );
};

/* document.addEventListener("DOMContentLoaded", () => {
   const name = prompt("Enter your name");
   socket.send(
      JSON.stringify({
         name,
      })
   );
}); */

socket.onmessage = ({ data }) => {
   data = JSON.parse(data);
   console.log(data);
   console.log(`message is: ${data.msg}`);
   displayMsg(data.msg, "r", data.senderName).scrollIntoView();
};

msgForm.addEventListener("submit", e => {
   e.preventDefault();
   const sendText = document.querySelector("#msg-txt");
   if (sendText.value === "") return;
   if (socket.readyState == 1) {
      socket.send(sendText.value);
      displayMsg(sendText.value, "s", "You").scrollIntoView();
      sendText.value = "";
   } else {
      console.log("server not connected");
      //displayMsg("server not connected", "r");
      //socket = new WebSocket("ws://localhost:5000");
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
