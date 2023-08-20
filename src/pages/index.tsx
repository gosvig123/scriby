import { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import HomeContent from '@/components/HomeContent';
import Logos from '@/components/Logos';
export default function Home() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData);
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className='w-min-screen h-min-screen'>
      <Header />
      <HomeContent />
      <Logos
        logos={[
          '/main-logo.png',
          '/original.png',
          '/smart.png',
          '/html24.png',
        ]}
      />
      {/* <input type='file' onChange={handleFileChange} />
      <button onClick={handleSubmit}>Upload and Transcribe</button> */}
    </div>
  );
}
