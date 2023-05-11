import React, { useEffect, useState } from 'react'
import {IoCloseOutline} from 'react-icons/io5';
const EditForm = ({setEditObj, updateItem, editObj}) => {
    const [details, setDetails] = useState(editObj);
    useEffect(()=>{
        console.log(details);
    },[details])
  return (
    <div className='w-full h-screen flex justify-center items-center bg-black bg-opacity-40'>
    <div className='relative py-10 px-10 bg-white rounded-md w-full sm:w-auto'>
        <button onClick={()=>setEditObj("")} className='p-2 rounded-full bg-white absolute left-1/2 -top-10 -translate-x-1/2 group'><IoCloseOutline className="text-red-700 transition-all duration-200 group-hover:rotate-180"/></button>
        <input value={details?.name} onChange={(e)=>setDetails({...details,[e.target.name] : e.target.value})} type="text" name='name' placeholder='Name' className='w-full sm:w-96 block p-3 border border-gray-400 rounded-md text-sm text-gray-700 mb-4' />
        <input value={details?.email} onChange={(e)=>setDetails({...details,[e.target.name] : e.target.value})}  type="text" name='email' placeholder='Email' className='w-full sm:w-96 block p-3 border border-gray-400 rounded-md text-sm text-gray-700 mb-4' />
        <input value={details?.role} onChange={(e)=>setDetails({...details,[e.target.name] : e.target.value})}  type="text" name='role' placeholder='Role' className=' w-full sm:w-96 block p-3 border border-gray-400 rounded-md text-sm text-gray-700 mb-4' />
        <button onClick={()=>{updateItem(details);setEditObj("")}} className='px-10 py-2 font-medium text-white bg-gradient-to-br from-red-500 to-red-700 rounded-sm shadow-md hover:bg-red-800 hover:shadow-lg'>Submit</button>
    </div>
    </div>
  )
}

export default EditForm