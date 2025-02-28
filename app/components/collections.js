"use client";
import { MdTitle } from "react-icons/md";

import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import task from "@/lib/modal/task";
import { CiSquarePlus } from "react-icons/ci";

export default function Modal({ isOpen, onClose, collection, parentid }) {
  const { data: session } = useSession();

  const addtocollection = async (e, collectionid) => {
    let a = await fetch("/api/collections", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ collectionid, parentid }),
    });
    let response = await a.json();
    if (response.message=="task already in the collection"){
      toast.dark("task already in  the collection!!");  
    }
    else{
      toast.success("task Added to collection!!");
    }
    onClose()

  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 ">
      <div className="border bg-[#1c1d1e] border-gray-800 p-6 rounded-3xl shadow-lg w-1/6 text-gray-400 flex flex-col gap-4">
        <div className="flex justify-end">
          <button onClick={onClose}>
            <IoClose className="text-2xl" />
          </button>
        </div>

        {collection.map((collection) => {
          return (
            <div className="flex justify-between " key={collection._id}>
              <div>{collection.collectionName}</div>

              <button
                onClick={(e) => addtocollection(e, collection._id)}
                className="cursor-pointer text-lg  hover:text-green-600"
              >
                <CiSquarePlus />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
