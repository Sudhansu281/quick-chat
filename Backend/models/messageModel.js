const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
      required: false,
    },
    // receiver: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },
    image: {
      type: String,
      required: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
    // chat: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Chat",
    // },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageModel);
module.exports = Message;
