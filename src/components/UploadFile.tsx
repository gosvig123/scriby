'use client';
import axios from 'axios';
import React, {
  ChangeEvent,
  DragEvent,
  useCallback,
  useState,
} from 'react';
import uploadFile from '../../../scriby/app/serverActions/superbase/uploadFile';
// import { uploadChunksToSupabase } from '../serverActions/superbase/uploadFile';
// gray cloud upload SVG icon
const cloudUploadIcon =
  'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs/solid/cloud-upload-alt.svg';

const FileUploadComponent = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const onDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length) {
      setSelectedFile(files[0]);
    }
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('/api/upload', formData);
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // You can call this function when the "Transcribe" button is clicked

  // You can call this function when the "Transcribe" button is clicked

  return (
    <div className='bg-white w-5/6 flex p-5 flex-col m-auto gap-3 rounded-lg items-center mt-5 justify-center'>
      <h1 className='text-2xl self-start font-mono'>Upload File</h1>
      <div
        className='bg-gray-100 flex flex-col gap-3 w-full items-center p-6 rounded-md relative'
        onDrop={onDrop}
        onDragOver={(event: DragEvent<HTMLDivElement>) =>
          event.preventDefault()
        }
      >
        <img
          src={cloudUploadIcon}
          alt='Upload icon'
          className='w-32 h-32 mx-auto grayscale '
        />
        <p className='text-2xl'>Drop a file here</p>
        <p>Supporting mp3, mp4, and webm, max 10mb</p>
        <p className='text-2xl'>Or</p>
        <label className='custom-file-upload'>
          <input
            type='file'
            onChange={handleFileChange}
            className='hidden'
            accept='video/*,audio/*,image/svg+xml'
          />
          Choose File
        </label>
        {selectedFile && <p>File selected: {selectedFile.name}</p>}
      </div>
      <div className='mt-3 flex justify-center gap-5 w-3/4 items-center'>
        <p className='text-2xl font-mono '>Start transcribing</p>
        {selectedFile && (
          <button
            onClick={handleSubmit}
            className='solidPurpleButton'
          >
            Transcribe
          </button>
        )}
        <button className='solidPurpleButton'>download</button>
      </div>
    </div>
  );
};
export default FileUploadComponent;
