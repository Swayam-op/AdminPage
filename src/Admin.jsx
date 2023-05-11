import React, { useEffect, useState } from 'react'
import Row from './Row'
import { HiChevronDoubleLeft } from 'react-icons/hi';
import { HiChevronDoubleRight } from 'react-icons/hi';
import { HiChevronLeft } from 'react-icons/hi';
import { HiChevronRight } from 'react-icons/hi';
import EditForm from './EditForm';


const Admin = () => {

    const [data, setData] = useState(JSON.parse(localStorage.getItem("AdminData")));
    const [pages, setPages] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [curPageNo, setCurPageNo] = useState(1);
    const [dataInCurrentPage, setDataInCurrentPage] = useState([]);
    const [deleteItems, setDeleteItems] = useState([]);
    const [editObj, setEditObj] = useState(null);

    useEffect(() => {
        if (!JSON.parse(localStorage.getItem("AdminData"))) {
            fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
                .then(response => response.json())
                .then((data) => {
                    setData(data);
                    localStorage.setItem("AdminData", JSON.stringify(data));
                    console.log(data);
                })
                .catch(error => console.error(error));
        }
        if (data) {
            if(data.length === 0){
                setPages(1);
            }
            else{
                setPages(parseInt(data.length%10 !==0 ? data.length / 10 + 1 : data.length/10));
            }
        }
        viewPage();
    }, [data]);

    const deleteItem = (id) => {
        let answer = prompt("Type 'Delete' to delete this item");

        if (answer?.toLowerCase() === "delete") {
            const newData = JSON.parse(localStorage.getItem("AdminData")).filter((item) => item.id !== id);
            localStorage.setItem("AdminData", JSON.stringify(newData));
            filterData(searchValue);
        }

    }

    const updateItem = (details) => {
        let list = JSON.parse(localStorage.getItem("AdminData"));
        const index = list?.findIndex((obj) => obj.id === details.id);
        list[index] = details;
        localStorage.setItem("AdminData", JSON.stringify(list));
        filterData(searchValue);
    }

    const filterData = (filterValue) => {
        const list = JSON.parse(localStorage.getItem("AdminData"));
        const filteredData = list?.filter((item) => item.name.includes(filterValue) || item.email.includes(filterValue) || item.role.includes(filterValue)) || [];
        setData(filteredData);
        let len = filteredData.length !== 0 ?( filteredData.length%10 !== 0 ? filteredData.length/10 : filteredData.length/10 - 1):0;
        setPages(parseInt(len + 1));
        viewPage();
    }

    const viewPage = () => {
        if(curPageNo > pages){
            setCurPageNo(pages);
        }
        setDataInCurrentPage(data?.slice((curPageNo - 1) * 10,(curPageNo - 1) * 10 + 10));
        return;
    }
    
    function handleMovePage(action){
        switch(action){
            case 'next':
                setCurPageNo(curPageNo+1);
                break;
            case 'prev':
                setCurPageNo(curPageNo-1);
                break;
            case 'last':
                setCurPageNo(pages);
                break;
            case 'first':
                setCurPageNo(1);
                break;
            default:
                break;
        }
    }
    
    function handleDeleteList(id){
        if(document.getElementById(id).checked && deleteItems.indexOf(id)<0){
            setDeleteItems([...deleteItems,id]);
        }
        else{
            const newList = deleteItems.filter((curId)=>curId !== id);
            setDeleteItems(newList);
        }
    }
    
    function handleAllDeleteList(){
        if(document.getElementById("all").checked){
            let ids = dataInCurrentPage.map((curElem)=> curElem.id);
            ids = ids.filter((id)=> deleteItems.indexOf(id) === -1);
            setDeleteItems([...deleteItems,...ids]);
        }
        else{
            let ids = dataInCurrentPage.map((curElem)=> curElem.id);
            const newList = deleteItems.filter((id)=>ids.indexOf(id) === -1);
            setDeleteItems(newList);
        }
    }

    function removeDeleteList(){
        let answer = prompt("Type 'Delete' to delete this items");

        if (answer?.toLowerCase() === "delete") {
            const newData = JSON.parse(localStorage.getItem("AdminData"))?.filter((item) => !deleteItems.find((id)=>id === item.id));
            localStorage.setItem("AdminData", JSON.stringify(newData));
            filterData(searchValue);
        }
        setDeleteItems([]);
    }

    useEffect(()=>{
        const timeoutId = setTimeout(() => {
            // console.log("curpageno in debounce : ",curPageNo);
            filterData(searchValue, curPageNo);
          }, 1000);
      
          return () => {
            clearTimeout(timeoutId);
          };
    },[searchValue, curPageNo])

    useEffect(()=>{
        const ids = deleteItems?.map((id)=>id);
        dataInCurrentPage?.map((item)=>{
            if(ids.find((id)=>id === item.id)){
                document.getElementById(item.id).checked = true;
            }
            else{
                document.getElementById(item.id).checked = false;
            }
        })

        //if all the item of the page is present in deleteItems then setsupercheckbox true
        if(dataInCurrentPage?.filter((item)=>deleteItems.find((id)=>id === item.id)).length === dataInCurrentPage?.length){
            document.getElementById('all').checked = true;
        }
        else{
            document.getElementById('all').checked = false;
        }
    },[deleteItems, dataInCurrentPage])

    return (
        <div className='relative w-auto px-4 sm:px-48 sm:py-16'>
        {
            editObj && 
            <>
            <div className={`z-20 fixed  inset-0`}>
                <EditForm setEditObj={setEditObj} updateItem={updateItem} editObj={editObj}/>
            </div>
            </>
        }
            
            <h1 className='py-5 text-center text-2xl font-bold text-zinc-900'>Adm<span className='text-red-700'>in</span></h1>

            {/* /*Search Box*/}
            <div className="relative mb-4">
                <input onChange={(e)=>{setSearchValue(e.target.value)}}  type="search" id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border outline-none focus:border-blue-600 rounded-lg bg-gray-50   " placeholder="Search by name, email or role" />
            </div>


            {/* Table */}

            <div className="relative w-full overflow-x-scroll sm:overflow-x-auto  sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                        <tr>
                            <th scope="col" className="p-4">
                                <div className="flex items-center">
                                    <input onClick={()=>handleAllDeleteList()}  id="all" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Roll
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataInCurrentPage?.map((details, index) => {
                                return (
                                    <>
                                        <Row details={details} deleteItem={deleteItem} handleDeleteList={handleDeleteList} setEditObj={setEditObj} />
                                    </>
                                )
                            })
                        }

                    </tbody>
                </table>




            </div>
            <div className='sm:flex w-full border py-5 justify-between px-2'>
                    <button onClick={removeDeleteList} className='px-5 mb-3 sm:px-10 py-2 w-full sm:w-auto bg-red-500 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-red-700'>Delete Selected</button>
                    <div className='text-center'>
                        <button onClick={()=>handleMovePage('first')}  className=' px-2 py-1 rounded-sm border-blue-600 hover:bg-blue-500 hover:text-white'><HiChevronDoubleLeft /></button>
                        <button onClick={()=>handleMovePage('prev')} disabled={1 >= curPageNo} className='disabled:cursor-not-allowed disabled:text-gray-400 px-2 py-1 rounded-sm border-blue-600 hover:bg-blue-500 hover:text-white'><HiChevronLeft /></button>
                        {
                            Array(pages ? pages : 0).fill().map((_, index) => {
                                return (
                                    <button key={index} onClick={()=>setCurPageNo(index+1)} className={` ${curPageNo === index+1 ? "bg-blue-600 text-white" : ""} px-3 py-1 mx-1 border rounded-sm border-blue-600 transition-all duration-200 hover:text-white  hover:bg-blue-600`}>{index + 1}</button>
                                )
                            })
                        }
                        <button onClick={()=>handleMovePage('next')} disabled={pages <= curPageNo} className='disabled:cursor-not-allowed disabled:text-gray-400 px-2 py-1 rounded-sm border-blue-600 hover:bg-blue-500 hover:text-white'><HiChevronRight /></button>
                        <button onClick={()=>handleMovePage('last')}  className=' disabled:text-gray-400 px-2 py-1 rounded-sm border-blue-600 hover:bg-blue-500 hover:text-white'><HiChevronDoubleRight /></button>

                    </div>
                </div>
        </div>
    )
}

export default Admin
//