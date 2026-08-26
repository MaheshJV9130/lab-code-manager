import mongoose, { Schema } from "mongoose";

const experimentSchema = new Schema({
  subject: { type: String, required: true, trim: true },
  experimentNumber: { type: Number, required: true },
  title: { type: String, required: true, trim: true },
  code: { type: String, required: true },
  output:{type : String , require : true},
  language: { type: String, required: true },
});

experimentSchema.index({ subject: 1, experimentNumber: 1 }, { unique: true });

const Experiment = mongoose.models.experiment || mongoose.model("experiment", experimentSchema);

export default Experiment;
