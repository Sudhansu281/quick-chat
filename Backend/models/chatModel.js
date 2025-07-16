const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    unreadMessageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
const chat = mongoose.model("Chat", chatModel);
module.exports = chat;
