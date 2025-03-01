import { Collection, SubTask, Task } from "@/lib/modal/model";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    let tasks = await Task.find({ email });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
export async function DELETE(req) {
  let request = await req.json();
  try {
    await connectDB();
    if (request.collectionid) {
      const { id, collectionid } = request;
      const collection = await Collection.findById(collectionid);
      collection.tasks = collection.tasks.filter((task) => task.toString() !== id);
      await collection.save();
      return NextResponse.json({ message: "yooo" });
    } else {
      await Task.findByIdAndDelete(request);
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
export async function PATCH(request) {
  try {
    await connectDB();
    let { id, field, value } = await request.json();
    await Task.findByIdAndUpdate(id, { [field]: value });
    return NextResponse.json({ message: "updating" });
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB(); //
    const req = await request.json();
    const { title, desc, email } = req;

    if (!req.taskid=="") {
      let subtask=await SubTask.create({ title, desc, email: email});
      let task=await Task.findById(req.taskid)
      task.subtasks.push(subtask._id)
      await task.save()

    } else {
      let task = await Task.create({ title, desc, email: email });
      if (req.collection) {
        let collection = await Collection.findById(req.collection);
        collection.tasks.push(task._id);
        await collection.save();
      }
    }

    return NextResponse.json({ message: "Task added!" });
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
