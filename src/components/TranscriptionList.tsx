import React, { useState } from 'react';

interface TranscriptionItem {
  name: string;
  date: string;
}

interface TranscriptionListProps {
  transcriptions: TranscriptionItem[];
}

const TranscriptionsList = ({
  transcriptions,
}: TranscriptionListProps) => {
  const [selectedFormat, setSelectedFormat] = useState('txt');


  const [checkedTranscriptions, setCheckedTranscriptions] = useState<
    string[]
  >([]); // Using array of names as an identifier
  

  const handleCheckboxChange = (
    itemName: string,
    isChecked: boolean
  ) => {
    if (isChecked) {
      setCheckedTranscriptions((prev) => [...prev, itemName]);
    } else {
      setCheckedTranscriptions((prev) =>
        prev.filter((name) => name !== itemName)
      );
    }
  };

  return (
    <div
      className='w-full max-w-7xl mx-auto mt-8 bg-white shadow-md rounded-lg overflow-y-auto'
      style={{ maxHeight: '70vh' }}
    >
      <div className='bg-gray-200 p-4 rounded-t-lg'>
        <h2 className='text-2xl font-bold'>Transcriptions</h2>
      </div>

      <div className='p-4'>
        <ul className='divide-y divide-gray-200'>
          <li className='p-3 grid grid-cols-5 gap-4 bg-gray-200 text-gray-700 font-semibold'>
            <span className='text-lg md:text-xl mx-auto'>
              Checked
            </span>
            <span className='text-lg md:text-xl'>File Name</span>
            <span className='text-lg md:text-xl'>Date Uploaded</span>
            <span className='text-lg md:text-xl'>Format</span>
            <span className='text-lg md:text-xl mx-auto'>Action</span>
          </li>

          {transcriptions.map((item, index) => {
            return (
              <li
                key={index}
                className='p-3 grid grid-cols-5 gap-4 items-center'
              >
                <input
                  type='checkbox'
                  className='form-checkbox mx-auto h-5 w-5 text-blue-600'
                  onChange={(e) =>
                    handleCheckboxChange(item.name, e.target.checked)
                  }
                />
                <span className='text-gray-700 text-lg md:text-xl'>
                  {item.name}
                </span>
                <span className='text-gray-500 text-lg md:text-xl'>
                  {item.date}
                </span>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className='border rounded-md p-2 text-gray-700'
                >
                  <option value='txt'>TXT</option>
                  <option value='pdf'>PDF</option>
                  <option value='docx'>DOCX</option>
                </select>
                <button className='px-4 py-2 mx-5 solidGreenButton text-white rounded-lg text-md md:text-lg'>
                  Download
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TranscriptionsList;
