import mongoose from 'mongoose';
import subtask from './subtasks';
const { Schema } = mongoose;





const task = new Schema({
  title: { type: String, required: false },
  desc: { type: String, required: false },
  email: { type: String, required: false },
  date: { type: Date, default: Date.now },
  taskCollection:{ type: String,required:false},
  isCompleted: { type: Boolean, default: false },
  subtasks:[]

});


export default task;