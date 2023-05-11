import React from 'react'
import {MdDelete} from 'react-icons/md';
import {FaRegEdit} from 'react-icons/fa';
const Row = ({details, deleteItem, handleDeleteList, setEditObj}) => {
  return (
    <tr key={details.id} class={`${document.getElementById(details.id)?.checked? "bg-gray-100 opacity-80" : "bg-white"} border-b  hover:bg-gray-50`}>
                <td class="w-4 p-4">
                    <div class="flex items-center">
                        <input onClick={()=>handleDeleteList(details.id)} id={details.id} type="checkbox" class="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded" />
                    </div>
                </td>
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {details.name}
                </th>
                <td class="px-6 py-4">
                    {details.email}
                </td>
                <td class="px-6 py-4 capitalize">
                    {details.role}
                </td>
                <td class="px-6 py-4 flex">
                    <button onClick={()=>deleteItem(details.id)} disabled={document.getElementById(details.id)?.checked} className='disabled:cursor-not-allowed'><MdDelete   className=' text-red-700 hover:text-red-500 text-lg  mr-5'/></button>
                    <button onClick={()=>setEditObj(details)} disabled={document.getElementById(details.id)?.checked} className='disabled:cursor-not-allowed' ><FaRegEdit  className="text-blue-700 hover:text-blue-500 text-lg "/></button>
                </td>
    </tr>
  )
}

export default Row