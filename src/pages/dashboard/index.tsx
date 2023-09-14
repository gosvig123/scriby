import Notification from '@/components/Alert';
import Header from '@/components/Header';
import UploadFile from '@/components/UploadFile';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DashboardSubHeader from '@/components/DashboardSubHeader';
import TranscriptionList from '@/components/TranscriptionList';

interface IUser {
  email: string;
  userId: number;
  iat: number;
  credits: number;
}

interface dashboardProps {
  user: IUser;
}
export default function Dashboard({ user }: dashboardProps) {
  const router = useRouter();
  const fullUrl = router.asPath;
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('Upload');

  const [transcriptions, setTranscriptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchTranscriptions = async () => {
      const response = await fetch('/api/getmytranscriptions', {
        credentials: 'include',
      });

      if (response.ok) {
        console.log(response);
        const data: any[] = await response.json();
        console.log(data);
        const formattedData = data.map((item) => ({
          name: item.name,
          date: new Date(item.createdAt).toLocaleDateString(), // Format date as required
        }));
        setTranscriptions(formattedData);
      } else {
        // Handle the error case
        console.error('Failed to fetch transcriptions');
      }
    };

    fetchTranscriptions();
  }, []);

  const tabs = [
    { name: 'Upload', component: <UploadFile /> },
    {
      name: 'Transcriptions',
      component: (
        <TranscriptionList transcriptions={transcriptions} />
      ),
    },
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
    <div className='w-full h-full min-h-screen overflow-hidden'>
      <Header user={user} />
      <DashboardSubHeader user={user} />
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

import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import decrypt from '../../../lib/jwt/cryptography/decryption';
import { ENCRYPTION_KEY } from '../../../constants';
import { parseCookies } from 'nookies';

export const getServerSideProps: GetServerSideProps = async (
  context
) => {
  try {
    const cookies = parseCookies(context);
    const encryptedToken = cookies.token;

    if (!encryptedToken) {
      return {
        redirect: {
          destination: '/signup',
          permanent: false,
        },
      };
    }

    const decryptedToken = decrypt(
      encryptedToken,
      Buffer.from(await ENCRYPTION_KEY)
    );

    const SECRET = process.env.JWT_SECRET;

    if (!SECRET) {
      throw new Error('No JWT secret found');
    }

    const decoded = jwt.verify(decryptedToken, SECRET);

    return {
      props: { user: decoded }, // The decoded user data
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);

    return {
      redirect: {
        destination: '/login', // Redirect to login page if an error occurs
        permanent: false,
      },
    };
  }
};
