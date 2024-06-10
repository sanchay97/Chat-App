import React from 'react'
import Conversation from './Conversation'
import useGetCoversations from '../../hooks/useGetCoversations';
import { getRandomEmoji } from '../../utils/emojis';

const Conversations = () => {

  const {loading, conversations} = useGetCoversations();
  return (
    <div className='py-2 flex flex-col overflow-auto'>
      {
        conversations.map((conversation,idx) => {
          return <Conversation
            key={conversation._id}
            conversation={conversation}
            emoji={getRandomEmoji()}
            lasIdx={idx === conversations.length - 1}
          />
        })
      }
      {loading ? <span className='loading loading-spinner mx-auto'></span> : null}
    </div>
  )
}

export default Conversations


// STARTER CODE
// const Conversations = () => {
//   return (
//     <div className='py-2 flex flex-col overflow-auto'>
//         <Conversation />
//         <Conversation />
//         <Conversation />
//         <Conversation />
//         <Conversation />
//         <Conversation />
//     </div>
//   )
// }