var mongoose = require("mongoose");


var TaskSchema = new mongoose.Schema(
    {
      description: { type: String, required: [true, "Description for the task is missing"]},
      status: { type: String, required: true, enum: ["ongoing", "completed"], default: "ongoing"}
    }
);

TaskSchema.virtual('id').get(function(){return this._id;});

module.exports = mongoose.model("Task", TaskSchema);