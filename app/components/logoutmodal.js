import { signOut } from "next-auth/react";

signOut

export default function LogoutModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
            <div className="border border-gray-800 p-6 rounded-3xl shadow-lg w-2/6 text-gray-400 flex gap-4 justify-center">  
                    <button className="bg-red-600 border border-gray-800 w-32 p-2 hover:bg-gray-950" onClick={()=>signOut()}>Logout</button>
                    <button className="border border-gray-800 w-32 p-2 hover:bg-gray-950" onClick={onClose}>Close</button>

            </div>
        </div>
    );
}