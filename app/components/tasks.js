"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { CgGoogleTasks } from "react-icons/cg";
import { RiDeleteBin7Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import AddModal from "./taskadd";
import CollectionsAdd from "./collectionsAdd";
import Collections from "./collections";
import { RiSortDesc } from "react-icons/ri";
import LogoutModal from "./logoutmodal";
import { ToastContainer, toast } from "react-toastify";
import { FaBitcoin } from "react-icons/fa6";
import { CiSquarePlus } from "react-icons/ci";
import "./tasks.css";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { MdMenu } from "react-icons/md";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const tasks = () => {
  const { data: session } = useSession();
  if (!session) return <div>Loading...</div>;

  const [tasks, setTasks] = useState([]);
  const [taskid, setTaskid] = useState();
  const [collections, setCollections] = useState([]);
  const [collectionid, setCollectionsid] = useState();
  const [subtasks, setsubtasks] = useState([]);
  const [isTaskAddModalOpen, setisTaskAddModalOpen] = useState(false);
  const [isCollectionAddModalOpen, setisCollectionAddModalOpen] =
    useState(false);
  const [isCollectionModalOpen, setisCollectionModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isdeleted, setisdeleted] = useState(false);

  const getsubtasks = async () => {
    let a = await fetch(
      `/api/subtasks?email=${encodeURIComponent(session?.user?.email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let response = await a.json();
    setsubtasks(response);
  };
  const gettasks = async () => {
    let a = await fetch(
      `/api/tasks?email=${encodeURIComponent(session?.user?.email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let response = await a.json();
    setTasks(response);
  };
  const getcollections = async () => {
    let a = await fetch(
      `/api/collections?email=${encodeURIComponent(session?.user?.email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let response = await a.json();
    setCollections(response);
  };
  const deletetask = async (e, id, collectionid) => {
    if (collectionid) {
      setCollections((prevTasks) =>
        prevTasks.map((e) =>
          e._id === collectionid
            ? { ...e, tasks: e.tasks.filter((task) => task !== id) }
            : e
        )
      );
      toast("Task Deleted!");

      let a = await fetch("/api/tasks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, collectionid }),
      });
    } else {
      let a = await fetch("/api/tasks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      });

      let data = await a.json();

      if (data.success) {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
        toast("Task Deleted!");
      } else {
        toast.error("Failed to delete task!");
      }
    }
  };
  const deleteCollection = async (e, id) => {
    let a = await fetch("/api/collections", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(id),
    });

    let data = await a.json();

    if (data.success) {
      setCollections((prevTasks) =>
        prevTasks.filter((collection) => collection._id !== id)
      );
      toast("Collection Deleted!");
    } else {
      toast.error("Failed to delete Collection!");
    }
  };
  const deletesubtask = async (e, id, parentid) => {
    let a = await fetch("/api/subtasks", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, parentid }),
    });

    let data = await a.json();

    if (data.success) {
      setsubtasks((prevTasks) =>
        prevTasks.filter((subtask) => subtask._id !== id)
      );
      toast("subtask deleted!");
      setisdeleted(!isdeleted);
    } else {
      toast.error("Failed to delete Collection!");
    }
  };
  const onChangehandler = async (e, id, field, parentid) => {
    let value;
    if (field == "isCompleted") {
      value = e.target.checked;
    } else {
      value = e.target.value;
    }
    if (parentid) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === parentid
            ? {
                ...task,
                subtasks: task.subtasks.map((e) =>
                  e._id === id ? { ...e, [field]: value } : e
                ),
              }
            : task
        )
      );
      let a = await fetch("/api/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, field, value, parentid }),
      });
      let data = await a.json();
    } else {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, [field]: value } : task
        )
      );
      let a = await fetch("/api/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, field, value }),
      });
      let data = await a.json();
    }
  };
  const CollectionHandleChange = async (e, id, field) => {
    if (field == "show") {
      let value = e.target.checked;
      setCollections((prevColl) =>
        prevColl.map((collection) =>
          collection._id === id ? { ...collection, show: value } : collection
        )
      );
      let a = await fetch("/api/collections", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, field, value }),
      });
      let data = await a.json();
    } else {
      let value = e.target.value;

      setCollections((prevColl) =>
        prevColl.map((collection) =>
          collection._id === id
            ? { ...collection, collectionName: value }
            : collection
        )
      );
      let a = await fetch("/api/collections", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, value }),
      });
      let data = await a.json();
    }
  };

  const subtaskonchange = async (e, id, field) => {
    if (field == "isCompleted") {
      let value = e.target.checked;
      setsubtasks((prevTasks) =>
        prevTasks.map((subtask) =>
          subtask._id === id
            ? {
                ...subtask,
                isCompleted: value,
              }
            : subtask
        )
      );
      let a = await fetch("/api/subtasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, value }),
      });
      let data = await a.json();
    } else {
      let value = e.target.value;
      setsubtasks((prevTasks) =>
        prevTasks.map((subtask) =>
          subtask._id === id
            ? {
                ...subtask,
                [field]: value,
              }
            : subtask
        )
      );
      let a = await fetch("/api/subtasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, value, field }),
      });
      let data = await a.json();
    }
  };

  useEffect(() => {
    gettasks();
    getcollections();
    getsubtasks();
  }, [
    isTaskAddModalOpen,
    isCollectionAddModalOpen,
    isCollectionModalOpen,
    isdeleted,
  ]);

  return (
    <div className="bg-rd flex w-screen h-screen p-4 gap-2 text-gray-400">
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className=" w-40 rounded-lg p-1 flex-col gap-1 justify-between items-center fixed max-h-screen h-[90vh]  ">
        <div>
          <Image
            src={"/5.gif"}
            width={70}
            height={70}
            alt="logo"
            className="rounded-xl overflow-hidden shadow-lg animate-blob mx-auto"
          ></Image>

          <div className="w-full max-w-sm mx-auto flex items-center border-b border-gray-500 my-4 p-2 hover:border-white">
            <CiSearch />
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 text-gray-400 focus:outline-none bg-black"
            />
          </div>
          <div className="text-lg flex  justify-between gap-2 items-center p-3">
            <div className="flex items-center">
              <CgGoogleTasks />
              <div>Tasks</div>
            </div>
            <button
              onClick={() => setisCollectionAddModalOpen(true)}
              className="flex items-center p-2 font-mono hover:text-green-600 text-md"
            >
              <FaPlus />
            </button>
          </div>

          {collections.map((collection) => {
            return (
              <div className="flex my-2" key={collection._id}>
                <input
                  type="checkbox"
                  className=" w-5 h-5 appearance-none border-2 border-white rounded-full bg-black checked:bg-white checked:border-black transition-all"
                  checked={collection.show}
                  onChange={(e) =>
                    CollectionHandleChange(e, collection._id, "show")
                  }
                />
                <input
                  className=" text-sm bg-black w-36 text-gray-600 ml-2"
                  value={collection.collectionName}
                  onChange={(e) => CollectionHandleChange(e, collection._id)}
                />
                <button
                  className="cursor-pointer text-sm  hover:text-red-600"
                  onClick={(e) => deleteCollection(e, collection._id)}
                >
                  <RiDeleteBin7Line />
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="text-white border w-36 border-gray-400 hover:bg-red-600 p-2 text-xl"
        >
          Logout
        </button>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-end fixed top-2 right-2 ">
          <div className="flex px-4 py-1 gap-4 h-fit ">
            <div className="flex flex-col gap-1 justify-center items-end ">
              <h1 className="min-w-24 text-sm text-right text-white">
                {session.user.name}
              </h1>
              <h1 className="flex items-center gap-1 text-xl">
                1000
                <FaBitcoin />
              </h1>
            </div>
            <Image
              className="w-14 h-14 rounded-full"
              src={session.user.image}
              width={50}
              height={50}
              alt="profile-picture"
            />
          </div>
        </div>
      
        <div className=" mt-16 ml-52 min-h-[80vh] grid grid-cols-3 gap-3">
          <div className="box hide-scrollbar min-h-full  overflow-y-scroll flex flex-col gap-4 p-4 bg-[#070707ba] border border-gray-900 rounded-xl">
            <div className="flex justify-between items-center max-h-full">
              <h1 className="text-2xl p-2">Tasks</h1>
              <button
                onClick={() => setisTaskAddModalOpen(true)}
                className="flex items-center p-2 font-mono hover:text-green-600 text-2xl"
              >
                <FaPlus />
              </button>
            </div>

            <AddModal
              isOpen={isTaskAddModalOpen}
              onClose={() => (
                setisTaskAddModalOpen(false),
                setTaskid(""),
                setCollectionsid("")
              )}
              collectionid={collectionid}
              taskid={taskid}
            />
            <CollectionsAdd
              isOpen={isCollectionAddModalOpen}
              onClose={() => setisCollectionAddModalOpen(false)}
            />
            <LogoutModal
              isOpen={isLogoutModalOpen}
              onClose={() => setIsLogoutModalOpen(false)}
            />
            {tasks.map((task) => {
              return (
                <div
                  className="w-full h-auto flex justify-between mb-2"
                  key={task._id}
                >
                  <Collections
                    collection={collections}
                    isOpen={isCollectionModalOpen}
                    onClose={() => setisCollectionModalOpen(false)}
                    parentid={taskid}
                  />
                  <div className="flex gap-6">
                    <input
                      className="w-5 h-5 appearance-none border-2 border-white rounded-full bg-black checked:bg-white checked:border-black transition-all"
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={(e) =>
                        onChangehandler(e, task._id, "isCompleted")
                      }
                    />
                    <div className="flex flex-col ">
                      <input
                        className="text-lg bg-[#070707ba] hover:outline-none active:outline-none focus:outline-none min-w-[500]"
                        placeholder="title"
                        value={task?.title || ""}
                        onChange={(e) => onChangehandler(e, task._id, "title")}
                      />
                      <div className="flex items-center mx-2">
                        <RiSortDesc />
                        <input
                          className=" text-sm bg-[#070707ba] hover:outline-none active:outline-none focus:outline-none min-w-[500]"
                          placeholder="desc"
                          value={task?.desc || ""}
                          onChange={(e) => onChangehandler(e, task._id, "desc")}
                        />
                        <div className="flex">
                          <button
                            className="cursor-pointer text-lg  hover:text-green-600"
                            onClick={() => {
                              setisTaskAddModalOpen(true);
                              setTaskid(task._id);
                            }}
                          >
                            <CiSquarePlus />
                          </button>
                          <button
                            className="cursor-pointer text-lg  hover:text-red-600"
                            onClick={(e) => deletetask(e, task._id)}
                          >
                            <RiDeleteBin7Line />
                          </button>
                          <button
                            className="cursor-pointer text-lg  hover:text-blue-600"
                            onClick={() => {
                              setisCollectionModalOpen(true);
                              setTaskid(task._id);
                            }}
                          >
                            <MdMenu />
                          </button>
                        </div>
                      </div>
                      {task.subtasks && task.subtasks.length > 0 && (
                        <div className="flex items-center mx-6">
                          <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                          >
                            <AccordionItem value="item-1">
                              <AccordionTrigger>subtasks</AccordionTrigger>

                              {task.subtasks.map((item) => {
                                const subtask = subtasks.find(
                                  (e) => e._id === item
                                );

                                return (
                                  <AccordionContent key={item}>
                                    {subtask && (
                                      <div className="w-full h-auto flex justify-between mb-2">
                                        <div className="flex gap-6">
                                          <input
                                            className="w-5 h-5 appearance-none border-2 border-white rounded-full bg-black checked:bg-white checked:border-black transition-all"
                                            type="checkbox"
                                            checked={subtask.isCompleted}
                                            onChange={(e) =>
                                              subtaskonchange(
                                                e,
                                                subtask._id,
                                                "isCompleted"
                                              )
                                            }
                                          />
                                          <div className="flex flex-col ">
                                            <input
                                              className="text-lg bg-[#070707ba] hover:outline-none active:outline-none focus:outline-none min-w-[500]"
                                              placeholder="title"
                                              value={subtask?.title}
                                              onChange={(e) =>
                                                subtaskonchange(
                                                  e,
                                                  subtask._id,
                                                  "title"
                                                )
                                              }
                                            />
                                            <div className="flex items-center mx-2">
                                              <RiSortDesc />
                                              <input
                                                className=" text-sm bg-[#070707ba] hover:outline-none active:outline-none focus:outline-none min-w-[500]"
                                                placeholder="desc"
                                                value={subtask?.desc}
                                                onChange={(e) =>
                                                  subtaskonchange(
                                                    e,
                                                    subtask._id,
                                                    "desc"
                                                  )
                                                }
                                              />
                                              <button
                                                className="cursor-pointer text-lg  hover:text-red-600"
                                                onClick={(e) =>
                                                  deletesubtask(
                                                    e,
                                                    subtask._id,
                                                    task._id
                                                  )
                                                }
                                              >
                                                <RiDeleteBin7Line />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}{" "}
                                  </AccordionContent>
                                );
                              })}
                            </AccordionItem>
                          </Accordion>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {collections.map((collectiontasks) => {
            if (collectiontasks.show == true) {
              return (
                <div
                  key={collectiontasks._id}
                  className="hide-scrollbar min-h-[80vh] max-h-full overflow-y-scroll flex flex-col gap-4  p-4 bg-[#070707ba] border border-gray-900 rounded-xl"
                >
                  <div className="box flex justify-between  items-center max-h-full">
                    <h1 className="text-2xl p-2">
                      {collectiontasks.collectionName}
                    </h1>
                    <button
                      onClick={() => {
                        setisTaskAddModalOpen(true),
                          setCollectionsid(collectiontasks._id);
                      }}
                      className="flex items-center p-2 font-mono hover:text-green-600 text-2xl"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <div>
                    {collectiontasks?.tasks.map((taskId) => {
                      const task = tasks.find((task) => task._id === taskId);

                      return (
                        <div key={taskId}>
                          {task && (
                            <div
                              className="w-full h-auto flex justify-between mb-2"
                              key={task._id}
                            >
                              <Collections
                                collection={collections}
                                isOpen={isCollectionModalOpen}
                                onClose={() => setisCollectionModalOpen(false)}
                                parentid={taskid}
                              />
                              <div className="flex gap-6">
                                <input
                                  className="w-5 h-5 appearance-none border-2 border-white rounded-full bg-black checked:bg-white checked:border-black transition-all"
                                  type="checkbox"
                                  checked={task.isCompleted}
                                  onChange={(e) =>
                                    onChangehandler(e, task._id, "isCompleted")
                                  }
                                />
                                <div className="flex flex-col ">
                                  <input
                                    className="text-lg bg-[#070707ba] hover:outline-none active:outline-none focus:outline-none min-w-[500]"
                                    placeholder="title"
                                    value={task?.title || ""}
                                    onChange={(e) =>
                                      onChangehandler(e, task._id, "title")
                                    }
                                  />
                                  <div className="flex items-center mx-2">
                                    <RiSortDesc />
                                    <input
                                      className=" text-sm bg-[#070707ba] hover:outline-none active:outline-none focus:outline-none min-w-[500]"
                                      placeholder="desc"
                                      value={task?.desc || ""}
                                      onChange={(e) =>
                                        onChangehandler(e, task._id, "desc")
                                      }
                                    />
                                    <div className="flex">
                                      <button
                                        className="cursor-pointer text-lg  hover:text-green-600"
                                        onClick={() => {
                                          setisTaskAddModalOpen(true);
                                        }}
                                      >
                                        <CiSquarePlus />
                                      </button>
                                      <button
                                        className="cursor-pointer text-lg  hover:text-red-600"
                                        onClick={(e) =>
                                          deletetask(
                                            e,
                                            task._id,
                                            collectiontasks._id
                                          )
                                        }
                                      >
                                        <RiDeleteBin7Line />
                                      </button>
                                      <button
                                        className="cursor-pointer text-lg  hover:text-blue-600"
                                        onClick={() => {
                                          setisCollectionModalOpen(true);
                                          setTaskid(task._id);
                                        }}
                                      >
                                        <MdMenu />
                                      </button>
                                    </div>
                                  </div>
                                  {task.subtasks &&
                                    task.subtasks.length > 0 && (
                                      <div className="flex items-center mx-6">
                                        <Accordion
                                          type="single"
                                          collapsible
                                          className="w-full"
                                        >
                                          <AccordionItem value="item-1">
                                            <AccordionTrigger>
                                              subtasks
                                            </AccordionTrigger>

                                            {task.subtasks.map((item) => {
                                              const subtask = subtasks.find(
                                                (e) => e._id === item
                                              );

                                              return (
                                                <AccordionContent key={item}>
                                                  {subtask && (
                                                    <div className="w-full h-auto flex justify-between mb-2">
                                                      <div className="flex gap-6">
                                                        <input
                                                          className="w-5 h-5 appearance-none border-2 border-white rounded-full bg-black checked:bg-white checked:border-black transition-all"
                                                          type="checkbox"
                                                          checked={
                                                            subtask.isCompleted
                                                          }
                                                          onChange={(e) =>
                                                            subtaskonchange(
                                                              e,
                                                              subtask._id,
                                                              "isCompleted"
                                                            )
                                                          }
                                                        />
                                                        <div className="flex flex-col ">
                                                          <input
                                                            className="text-lg bg-[#070707ba] hover:outline-none active:outline-none focus:outline-none min-w-[500]"
                                                            placeholder="title"
                                                            value={
                                                              subtask?.title
                                                            }
                                                            onChange={(e) =>
                                                              subtaskonchange(
                                                                e,
                                                                subtask._id,
                                                                "title"
                                                              )
                                                            }
                                                          />
                                                          <div className="flex items-center mx-2">
                                                            <RiSortDesc />
                                                            <input
                                                              className=" text-sm bg-[#070707ba] hover:outline-none active:outline-none focus:outline-none min-w-[500]"
                                                              placeholder="desc"
                                                              value={
                                                                subtask?.desc
                                                              }
                                                              onChange={(e) =>
                                                                subtaskonchange(
                                                                  e,
                                                                  subtask._id,
                                                                  "desc"
                                                                )
                                                              }
                                                            />
                                                            <button
                                                              className="cursor-pointer text-lg  hover:text-red-600"
                                                              onClick={(e) =>
                                                                deletesubtask(
                                                                  e,
                                                                  subtask._id,
                                                                  task._id
                                                                )
                                                              }
                                                            >
                                                              <RiDeleteBin7Line />
                                                            </button>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )}{" "}
                                                </AccordionContent>
                                              );
                                            })}
                                          </AccordionItem>
                                        </Accordion>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default tasks;
