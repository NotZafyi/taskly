"use client"
import Login from "./components/login";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


function page() {
  const { data: session } = useSession();
  useEffect(() => {


    if(session){
      const router=useRouter()
      router.push("/dashboard")
    }
  }, [])
  
  return (

    <div className="w-screen h-screen flex justify-center items-center background">
      <main className="w-2/4 h-3/4 flex flex-col items-center gap-1">
        <Image className="relative w-[150px] h-[150px] overflow-hidden shadow-lg animate-blob mb-8" src={"/5.gif"} width={100} height={100} alt="Main-Img" priority />
        <h1 className="font-mono italic font-extralight text-gray-200 text-4xl">TASKLY</h1>
        <h2 className="font-mono italic font-extralight text-gray-200 text-sm">Your Productivity, Simplified.</h2>
        <Login />
      </main>
    </div>

  )
}



export default page
