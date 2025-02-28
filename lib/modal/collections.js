import mongoose from 'mongoose';

const { Schema } = mongoose;





const collection = new Schema({
  collectionName: { type: String, required: false },
  email:{type:String,required:true},
  show:{type:Boolean,required:false,default:false},
  tasks: []
});


export default collection;