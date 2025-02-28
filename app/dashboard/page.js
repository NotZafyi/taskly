"use client"
import Tasks from '../components/tasks'
import { useSession, signOut } from "next-auth/react"




const page = () => {
  

    const { data: session } = useSession()

    return (
    <>
            {session&&<>
            <Tasks/>
            </>
            }
        </>
    )
}
export default page
