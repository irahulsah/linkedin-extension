const mongoose = require("mongoose");

const connectDb = () => {
  return mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true,useFindAndModify: false });
};

module.exports = { connectDb };
