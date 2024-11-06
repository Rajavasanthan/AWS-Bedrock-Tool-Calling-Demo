// Write a mongoose schema for the conversation model

const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  messages: [
    {
      role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
      },
      content: [
        {
          text: {
            type: String,
          },
        },
        {
          toolUse: {
            input: {
              location: {
                type: String,
              },
            },
            name: {
              type: String,
            },
            toolUseId: {
              type: String,
            },
          },
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{
  strict : false
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
