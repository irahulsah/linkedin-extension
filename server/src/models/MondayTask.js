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

// create validation schemaa
const mondayTaskValidationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  company: yup.string().required("Company is required"),
  url: yup.string().required("Url is required"),
  email: yup.string().required("Email is required"),
});


module.exports = {
  MondayTask,
  mondayTaskValidationSchema,
};
