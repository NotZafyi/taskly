"use client"
import { MdTitle } from "react-icons/md";

import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import task from "@/lib/modal/task";





export default function Modal({ isOpen, onClose}) {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    title: '',
  });
  const postCollection = async (title) => {

    let collection = {
      title: title,
      email: session.user.email
    }
    let a = await fetch("/api/collections", {
      method: "POST", headers: {
        "Content-Type": "application/json",
      }, body: JSON.stringify(collection)
    }
      ,)
    let data = await a.json()
    toast.success("Collection Added");
   
  }

  const onchangeHandler = (e, prop) => {
    setFormData(prev => ({
      ...prev,
      [prop]: e.target.value, // dynamically update the property
      
    }));
   
  }
  const addtask =async (e) => {
    e.preventDefault()
    const { title } = formData
    await postCollection(title)
    onClose()
    setFormData({ title: "" });
    
  }
  
  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 ">
     
      <div className="border bg-[#1c1d1e] border-gray-800 p-6 rounded-3xl shadow-lg w-2/6 text-gray-400 flex flex-col gap-4">
        <div className="flex justify-end">
          <button onClick={onClose}><IoClose className="text-2xl" /></button>
        </div>
        <form onSubmit={addtask}>
          <div className="flex gap-2 my-4">
            <MdTitle />
            <input className="h-4 w-11/12 bg-black p-5 text-lg border border-gray-800" type="text" required  value={formData.title} onChange={(e) => onchangeHandler(e, "title")} />
          </div>
          
          <div className="flex justify-center  ">
            <button type="submit" className="bg-black w-32 p-2 hover:border rounded-xl" >Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}