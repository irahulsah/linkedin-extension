const httpStatus = require("http-status-codes");
const {
  MondayTask,
} = require("../models/MondayTask");
const { constant } = require("../constant");

const createMondayTask = async (req, res) => {
  const { event } = req.body;
  if(event) {
  const monday_item = new MondayTask({
    name: event.pulseName,
    company: event.columnValues.company.value,
    url: event.columnValues.url.value,
    email: event.columnValues.email.value,
    item_id: event.pulseId,
    board_id: event.boardId,
    group_id: event.groupId,
    user_id: event.userId,
  });
  await monday_item.save();
}
  res.status(200).send(req.body);
};

const updateMondayTask = async (req, res) => {
  const { event } = req.body;
  if(event) {
  await MondayTask.findOneAndUpdate(
    {
      user_id: event.userId,
      board_id: event.boardId,
      group_id: event.groupId,
      item_id: event.pulseId,
    },
    {
      [event.columnId]: event.value.value,
    }
  );
  }
  res.status(200).send(req.body);
};

const updateMondayDescriptionChat = async (req, res) => {
  const { event } = req.body;
  if(event) {
  await MondayTask.findOneAndUpdate(
    {
      user_id: event.userId,
      board_id: event.boardId,
      item_id: event.pulseId,
    },
    {
      $push: {
        description: event.textBody,
      },
    }
  );
  }
  res.status(200).send(req.body);
};

const getAllMondayTask = async (req, res) => {
  // if limit and skip is not passed, by default
  req.query.limit = req.query.limit ?? 20;
  req.query.skip = req.query.skip ?? 0;

  try {
    const mondayTasks = await MondayTask.aggregate([
      { $limit: +req.query.limit },
      { $skip: +req.query.skip },
      { $sort: { createdAt: req.query.order === constant.ASC ? 1 : -1 } },
    ]);
    return res.status(httpStatus.StatusCodes.OK).send({
      data: mondayTasks,
    });
  } catch (e) {
    return res
      .status(httpStatus.StatusCodes.BAD_REQUEST)
      .send({ data: e.message });
  }
};

const getMondayTaskById = async (req, res) => {
  try {
    const id = req.params.id;
    const mondayTask = await MondayTask.findOne({ _id: id });
    return res.status(httpStatus.StatusCodes.OK).send({
      data: mondayTask,
    });
  } catch (e) {
    return res
      .status(httpStatus.StatusCodes.BAD_REQUEST)
      .send({ data: e.message });
  }
};

const deleteMondayTask = async (req, res) => {
  try {
    const id = req.params.id;
    const i = await MondayTask.findOneAndDelete({ _id: id });
    return res
      .status(httpStatus.StatusCodes.OK)
      .send({ data: "deleted successfully" });
  } catch (e) {
    return res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ data: e });
  }
};

module.exports = {
  createMondayTask,
  getAllMondayTask,
  deleteMondayTask,
  updateMondayTask,
  updateMondayDescriptionChat,
  getMondayTaskById,
};
