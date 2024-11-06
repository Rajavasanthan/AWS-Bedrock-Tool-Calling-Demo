const express = require("express");
const {
  BedrockRuntimeClient,
  ConverseCommand,
} = require("@aws-sdk/client-bedrock-runtime");
const app = express();
const dotenv = require("dotenv").config();
// Require the config.js file
const connectDB = require("./config");
const Conversation = require("./Models/conversations");
const cors = require("cors");
const { default: axios } = require("axios");
const { getWeather } = require("./util");
const { executeAi } = require("./executeAi");
// Call the connectDB function
connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.post("/ai", async (req, res) => {
  try {
    // Check if the conversation id is present in the request
    // If not create a new conversation
    let conv;
    if (!req.body.conversationId) {
      let conversation = new Conversation({
        messages: [
          {
            role: "user",
            content: [
              {
                text: req.body.question,
              },
            ],
          },
        ],
      });
      conv = await conversation.save();
    } else {
      const findConv = await Conversation.findOne({
        _id: req.body.conversationId,
      });

      if (!findConv) {
        res.status(400).json({
          message: "Conversation ID is not valid",
        });
      }

      findConv.messages.push({
        role: "user",
        content: [
          {
            text: req.body.question,
          },
        ],
      });

      conv = await findConv.save();
    }

    const aiResp = await executeAi(conv);

    console.log(aiResp);

    conv.messages.push({
      role: "assistant",
      content: [
        {
          text: aiResp,
        },
      ],
    });

    await conv.save();

    res.json({
      message: aiResp,
      conversationId: conv._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

app.listen("3000", () => {
  console.log("Server started");
});
