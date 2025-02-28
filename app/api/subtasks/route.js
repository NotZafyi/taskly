import { Collection, SubTask, Task } from "@/lib/modal/model";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
mongoose
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    let Subtasks = await SubTask.find({ email });
    return NextResponse.json(Subtasks);
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
export async function DELETE(req) {
  let {id,parentid} = await req.json();
  try {

    await connectDB();
    let task=await Task.findById(parentid)
    const subtaskId = mongoose.Types.ObjectId.createFromHexString(id)
    task.subtasks.pull(subtaskId)
    await task.save()
     await SubTask.findByIdAndDelete(id);
      return NextResponse.json({ success: true });
    } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
export async function PATCH(request) {
  try {
    await connectDB();
    let req=await request.json()
    if(req.field=="title" || req.fieled== "desc"){
      let { id, value,field } = req
      await SubTask.findByIdAndUpdate(id, { [field]: value });
    }
    else{
      let { id, value } = req
      await SubTask.findByIdAndUpdate(id, { isCompleted: value });
    }
    return NextResponse.json({ message: "updating" });
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

