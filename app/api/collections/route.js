import { Collection, Task } from "@/lib/modal/model";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    let collections = await Collection.find({ email });
    return NextResponse.json(collections);
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
export async function DELETE(request) {
  try {
    await connectDB();
    let _id = await request.json();
    await Collection.findByIdAndDelete(_id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
export async function PATCH(request) {
  try {
    await connectDB();
    let req = await request.json();
    if (req.collectionid && req.parentid) {
      let collection=await Collection.findByIdAndUpdate(req.collectionid)
      if(!collection.tasks.includes(req.parentid)){
        collection.tasks.push(req.parentid)
        await collection.save()
      }
      else{
        return NextResponse.json({message:"task already in the collection"})
      }
        }
    else {
      if (req.field == "show") {
        await Collection.findByIdAndUpdate(
          req.id,
          { show: req.value },
          { new: true }
        );
      } else {
        await Collection.findByIdAndUpdate(
          req.id,
          { collectionName: req.value },
          { new: true }
        );
      }
    }

    return NextResponse.json({ message: "hello" });
    // }
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB(); //
    const { title, email } = await request.json();
    await Collection.create({ collectionName: title, email: email });
    return NextResponse.json({ message: "Collection added!" });
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
