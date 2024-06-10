import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import userConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
    const {socket} = useSocketContext();
    const {messages, setMessages} = userConversation();

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            newMessage.shouldShake = true;

            //Play the notification sound
            const sound = new Audio(notificationSound);
            sound.play();
            setMessages([...messages, newMessage]);
        });

        return () => socket?.off("newMessage");
    }, [socket, messages, setMessages]);
}

export default useListenMessages