import mongoose from 'mongoose';
const { Schema } = mongoose;





const subtask = new Schema({
  title: { type: String, required: false },
  desc: { type: String, required: false },
  email: { type: String, required: false },
  date: { type: Date, default: Date.now },
  isCompleted: { type: Boolean, default: false },
});


export default subtask;