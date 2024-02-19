import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const handleUploadImage =async()=>{
    try {
      if(!file) throw new Error("No file selected");
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl font-semibold my-7'>Create A Post</h1>
        <form className='flex flex-col gap-4'>
            <div className='flex flex-col sm:flex-row justify-between gap-4'>
            <TextInput type='text' placeholder='Title' required id='title' className='flex-1 m' />
            <Select>
                <option value='uncategorized'>Select a Category</option>
                <option value='personal'>Personal</option>
                <option value='money-earing'>Money Earning</option>
            </Select>
            </div>
            <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
              <FileInput type='file' accept='image/*' onChange={(e)=>setFile(e.target.files[0])}></FileInput>
              <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline onClick={handleUploadImage}>Upload Image</Button>
            </div>
            <ReactQuill type='editor' theme='snow' placeholder='Write your blog here...' className='h-72 mb-12'/>
            <Button type='submit' gradientDuoTone='purpleToPink' required>Publish</Button>
        </form>
    </div>
  )
}
