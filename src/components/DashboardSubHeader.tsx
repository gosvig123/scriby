import PaymentModal from "./payment/PaymentModal";
interface IUser {
  email: string;
  userId: number;
  iat: number;
  credits: number;
}

import { useEffect, useState } from "react";
export default function DashboardSubHeader() {
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      const response = await fetch("/api/user/myuser");
      if (response.ok) {
        const userData: IUser = await response.json();
        console.log("User data:", userData);
        setUser(userData);
      } else {
        console.error("Failed to fetch user data");
      }
    }

    fetchUserData();
  }, []);


  return (
    <div className="w-full flex flex-auto px-5 ">
      <div className="w-full gap-5   bg-white text-center items-center px-4 py-4 flex flex-auto justify-between rounded-lg shadow-lg">
        <h1 className="text-2xl font-mono font-bold">Dashboard</h1>
        <p className="text-lg ">
          You currently have {user?.credits} minutes of transcription
          remaining.
        </p>
        <button
          className="solidGreenButton"
          onClick={() => setPaymentModalOpen(true)}
        >
          Buy Credits
        </button>
      </div>
      <div>
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
        />{" "}
      </div>
    </div>
  );
}
