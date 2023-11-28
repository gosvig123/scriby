import Notification from "@/components/Alert";
import Header from "@/components/Header";
import UploadFile from "@/components/UploadFile";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardSubHeader from "@/components/DashboardSubHeader";
import TranscriptionList from "@/components/TranscriptionList";
import { useSession } from "next-auth/react";
export default function Dashboard() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Upload");
  const [transcriptions, setTranscriptions] = useState<any[]>([]);

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchTranscriptions = async () => {
      if (!session) {
        await router.push("/");
        return;
      }
      const response = await fetch("/api/getmytranscriptions", {
        credentials: "include",
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
        console.error("Failed to fetch transcriptions");
        // redirect to login
      }
    };

    fetchTranscriptions();
  }, []);

  const tabs = [
    { name: "Upload", component: <UploadFile /> },
    {
      name: "Transcriptions",
      component: <TranscriptionList transcriptions={transcriptions} />,
    },
  ];

  const defaultTab = tabs.find((tab) => tab.name === "Upload");
  const defaultComponent = defaultTab?.component || <div>Upload not found</div>;

  const selectedComponent =
    tabs.find((tab) => tab.name === activeTab)?.component || defaultComponent;

  return (
    <div className="w-full h-full min-h-screen overflow-hidden">
      <Header />
      <DashboardSubHeader />
      <div className="tabs w-full flex mt-4 ml-5">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-4 py-2 mr-2 font-mono text-lg rounded-lg ${
              activeTab === tab.name
                ? "bg-purple-700 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="w-full h-full flex mt-8 min-h-4/5 justify-center items-center">
        <div className="w-full min-h-4/5">{selectedComponent}</div>
      </div>
      {showModal && (
        <Notification
          text="You have successfully created your account, welcome to scriby"
          status="success"
        />
      )}
    </div>
  );
}
