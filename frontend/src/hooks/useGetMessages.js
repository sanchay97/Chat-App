import { useEffect, useState } from "react"
import userConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const {messages, setMessages, selectedConversation} = userConversation();

    useEffect(() => {
        const getMessages = async() => {
            setLoading(true);
            try {
                const res = await fetch(`/api/messages/${selectedConversation._id}`);
                const data = await res.json();

                if(!data.success) {
                    throw new Error(data.error);
                }

                setMessages([...data.messages])
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        }

        if(selectedConversation?._id) getMessages();
    },[selectedConversation?._id, setMessages]);

    return {messages, loading};
}

export default useGetMessages