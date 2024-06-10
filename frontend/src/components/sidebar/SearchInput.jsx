import React, { useState } from 'react'
import { FaSearch } from "react-icons/fa";
import userConversation from '../../zustand/useConversation';
import useGetCoversations from '../../hooks/useGetCoversations'
import toast from 'react-hot-toast';

const SearchInput = () => {

  const [search, setSearch] = useState("");
  const {setSelectedConversation} = userConversation();
  const {conversations} = useGetCoversations()

  const handleSubmit = (e) => {
    e.preventDefault();
    if(search.length === 0) return;

    if(search.length < 3) {
      return toast.error('Search term must be at least 3 characters long');
    }

    const conversation = conversations.find((c) => c.fullName.toLowerCase().includes(search.toLowerCase()));

    if(conversation) {
      setSelectedConversation(conversation);
      setSearch("");
    }
    else {
      toast.error("No such User Found");
    }
  }

  return (
    <div>
        <form onSubmit={handleSubmit} className='flex items-center gap-2'>
            <input type="text" placeholder='Search...' className='input input-bordered rounded-full' 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type='submit' className='btn btn-circle bg-sky-400 text-white'>
                <FaSearch className='w-6 h-6 outline-none'/>
            </button>
        </form>
    </div>
  )
}

export default SearchInput

// STARTER CODE
// const SearchInput = () => {
//   return (
//     <div>
//         <form className='flex items-center gap-2'>
//             <input type="text" placeholder='Search...' className='input input-bordered rounded-full' />
//             <button type='submit' className='btn btn-circle bg-sky-400 text-white'>
//                 <FaSearch className='w-6 h-6 outline-none'/>
//             </button>
//         </form>
//     </div>
//   )
// }