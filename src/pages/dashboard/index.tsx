import Notification from '@/components/Alert';
import Header from '@/components/Header';
import UploadFile from '@/components/UploadFile';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DashboardSubHeader from '@/components/DashboardSubHeader';
import TranscriptionList from '@/components/TranscriptionList';
export default function Dashboard() {
  const router = useRouter();
  const fullUrl = router.asPath;
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('Upload');

  const dummyTranscriptions: any[] = [
    { name: 'File1.mp3', date: '20th Aug 2023' },
    { name: 'MeetingNotes.mp3', date: '18th Aug 2023' },
    // Add more dummy data or fetch real data later
  ];

  const tabs = [
    { name: 'Upload', component: <UploadFile /> },
    {
      name: 'Transcriptions',
      component: (
        <TranscriptionList transcriptions={dummyTranscriptions} />
      ),
    },
    // {
    //   name: 'Settings',
    //   component: <div>Example component for settings</div>,
    // },
  ];

  useEffect(() => {
    fullUrl.includes('firstlogin')
      ? setShowModal(true)
      : setShowModal(false);
  });

  const defaultTab = tabs.find((tab) => tab.name === 'Upload');
  const defaultComponent = defaultTab?.component || (
    <div>Upload not found</div>
  );

  const selectedComponent =
    tabs.find((tab) => tab.name === activeTab)?.component ||
    defaultComponent;

  return (
    <div className='w-full h-full min-h-screen'>
      <Header />
      <DashboardSubHeader />
      <div className='tabs w-full flex mt-4 ml-5'>
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-4 py-2 mr-2 font-mono text-lg rounded-lg ${
              activeTab === tab.name
                ? 'bg-purple-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className='w-full h-full flex mt-8 min-h-4/5 justify-center items-center'>
        <div className='w-full min-h-4/5'>{selectedComponent}</div>
      </div>
      {showModal && (
        <Notification
          text='You have successfully created your account, welcome to scriby'
          status='success'
        />
      )}
    </div>
  );
}
