import React from 'react'
import { useAuthContext } from '../../context/AuthContext'
import userConversation from '../../zustand/useConversation';
import { extractTime } from '../../utils/extractTime';

const Message = ({message}) => {
    const {authUser} = useAuthContext();
    const {selectedConversation} = userConversation();
    const fromMe = (message.senderId === authUser._id);
    const formattedTime = extractTime(message.createdAt);
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
    const buubleBgcolor = fromMe ? "bg-blue-500" : ""; 

    return (
        <div className={`chat ${chatClassName}`}>
            <div className='chat-image avatar'>
                <div className='w-10 rounded-full'>
                    <img src={profilePic} alt="" />
                </div>
            </div>
            <div className={`chat-bubble text-white ${buubleBgcolor}`}>
                {message.message}
            </div>
            <div className='chat-footer opacity-50 text-xs flex gap-1 items-center text-white'>
                {formattedTime}
            </div>
        </div>
    )
}

export default Message