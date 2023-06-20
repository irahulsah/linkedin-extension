const mongoose = require("mongoose");
const yup = require("yup");

const mondayTaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    description: {
      type: [String],
      required: false,
    },
    item_id: {
      type: Number,
      required: true,
    },
    board_id: {
      type: Number,
      required: true,
    },
    group_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MondayTask = mongoose.model("MondayTask", mondayTaskSchema);


module.exports = {
  MondayTask,
};
