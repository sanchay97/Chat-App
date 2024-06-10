import { useState } from "react"
import userConversation from "../zustand/useConversation";
import toast from 'react-hot-toast';

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);

    const {messages, setMessages, selectedConversation} = userConversation();

    const sendMessage = async(message) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({message})
            });

            const data = await res.json();

            if(!data.success) {
                throw new Error(data.error);
            }

            setMessages([...messages, data.newMessage])

        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false);
        }
    }

    return {loading, sendMessage};
}

export default useSendMessage