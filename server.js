const express = require("express");
const cors = require("cors");
// const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
let messages = [welcomeMessage];

// level3 [5] read only text whose text contains a given substring
// teniolao-cyf-chat-server.glitch.me/messages/search?text=express
// app.get("/messages/search", (req, res) => {
//   const searchTerm = req.query.term;
//   console.log(term);

//   const filterMessages = messages.filter((message) =>
//     message.text.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   console.log(filterMessages);
//   res.send(filterMessages);
// });

app.get("/messages/search", function (request, response) {
  const searchQuery = request.query.term;

  function searchedWord(arr) {
    return arr.filter((item) =>
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  response.send(searchedWord(messages));
});

//[2] read all messages
app.get("/messages", function (request, response) {
  response.send(messages);
});

//read only the most recent 10 messages
// app.get("/messages/latest", (req, res) => {
//   //for(let i=)
//   const filterMessages = messages.filter(
//     (message, index) => messages.length - 10 <= index
//   );
//   res.send(filterMessages);
// });

app.get("/messages/latest", function (request, response) {
  function lastTenMessages(arr) {
    return arr.filter((eachMessage, index) => messages.length - 10 <= index);
  }
  response.send(lastTenMessages(messages));
});

//[3] read one message specified by id
// app.get("/messages/:id", function (req, res) {
//   const id = req.params.id;
//   messages = messages.filter((message) => message.id === Number(id));
//   res.status(200).send(messages);
// });

app.get("/messages/:id", function (request, response) {
  const foundMessage = messages.find(
    (eachMessage) => eachMessage.id === parseInt(request.params.id)
  );

  foundMessage
    ? response.json(foundMessage)
    : response.status(400).json({ message: "Message not found" });
});

// [1] create a new message

// app.post("/messages", (req, res) => {
//   const { from, text } = req.body;
//   // console.log(req.body)
//   const ourMessageObject = {
//     id: messages.length,
//     from,
//     text,
//     timeSent: new Date().toLocaleDateString(),
//   };
//   if (from.length === 0 || text.length === 0) {
//     return res.status(400).send("please complete body");
//   } else {
//     messages.push(ourMessageObject);
//   }
// });

app.post("/messages", function (request, response) {
  const newWelcomeMessage = {
    id: Math.floor(Math.random() * messages.length) + messages.length,
    from: request.body.from,
    text: request.body.text,
    timeSent: new Date().toLocaleString(),
  };

  if (!newWelcomeMessage.from || !newWelcomeMessage.text) {
    return response
      .status(400)
      .json({ message: "Please include name and message" });
  }

  messages.push(newWelcomeMessage);
  response.send(messages);
});

//[4] delete a message by id
// app.delete("/messages/:id", (req, res) => {
//   const id = req.params.id;
//   messages = messages.filter((message) => message.id !== Number(id));
//   res.json(messages);
// });

app.delete("/messages/:id", function (request, response) {
  const foundMessage = messages.find(
    (eachMessage) => eachMessage.id === parseInt(request.params.id)
  );

  if (foundMessage) {
    response.json({
      message: `Message ${request.params.id} deleted`,
      messages: messages.filter(
        (eachMessage) => eachMessage.id !== parseInt(request.params.id)
      ),
    });
  } else {
    response
      .status(400)
      .json({ message: `Message ${request.params.id} not found` });
  }
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.listen(process.env.PORT || 3000, () => {
  console.log("server running!");
});
