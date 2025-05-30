// this is where the code for the notes feature will be

"use client";

import Image from "next/image";

import NotesCard from "../../components/NotesCard.jsx";


export default function NotesPage() {
  return (
<div className="main-div flex flex-col">



  <div className="heading-div flex justify-between item-start p-6">
  <div>
<h1 className="text-3xl font-semibold">Notes</h1>
<p className="text-gray-400 ">Create, organize, and review your notes.</p>
  </div>
    
    <button className="cursor-pointer hover:bg-[#5222D0] px-4 py-2 bg-[#9B87F5] text-white rounded-2xl mr-[4%]">
      <svg className="inline" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg> New Note</button>
  </div>

<div className="flex gap-6 h-screen p-6">
  {/* Folders and Tags column */}
  <div className="flex flex-col w-[20%]">
    <div className="folders-div flex flex-col bg-[#09090B] border border-gray-500 rounded-2xl h-[50%] p-6">
      <div className="folder-div-header flex">
        <Image
          src="/Assets/folder.svg"
          alt="Folder Icon"
          width={24}
          height={24}
          className="inline-block mr-2"
        />
        <h2 className="text-xl font-semibold text-white">
          Folders
        </h2>
      </div>
      <div className="folders-list flex flex-col">
        {/* display the folders here, one after another */}
      </div>
    </div>

    <div className="tags-div border border-gray-500 rounded-2xl h-[20%] p-6 mt-6 bg-[#09090B]">
      <div className="folder-div-header flex">
        <Image
          src="/Assets/tags.svg"
          alt="Folder Icon"
          width={24}
          height={24}
          className="inline-block mr-2"
        />
        <h2 className="text-xl font-semibold text-white">
          Tags
        </h2>
      </div>
      <div className="tags-list flex">
        {/* display the tags here, one after another */}
      </div>
    </div>
  </div>

  {/* Recent Notes column */}
  <div className="tags-div border border-gray-500 rounded-2xl w-[75%] h-[72.5%] p-6 bg-[#09090B]">
    <div className="folder-div-header flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-white">
        Recent Notes
      </h2>
      <p className="text-gray-400 mb-4">Continue where you left off.</p>
    </div>
    <div className="notes-list flex flex-col">
    {/* display the notes here, one after another */}
    <NotesCard/>
    <NotesCard/>
    <NotesCard/>
    <NotesCard/>
    </div>



    <div className="tags-list flex">
      {/* display the tags here, one after another */}
    </div>
  </div>
</div>
</div>
  );
}