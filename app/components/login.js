"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

const login = () => {
  const { data: session } = useSession()
  const router=useRouter()
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);


  return (
    <button className="flex items-center justify-center gap-2 w-full max-w-xs px-4 py-2 my-10 text-white bg-black shadow-none border border-gray-800 hover:bg-white hover:text-black transition duration-500">
      <FcGoogle className="text-3xl" />
      <span className="font-medium" onClick={(()=>{signIn("google")})}>Sign in with Google</span>
    </button>
  )
}

export default login
