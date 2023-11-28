"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import LoginModal from "./auth/LoginModal";
import Cookies from "js-cookie";
import router from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
const AvatarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="h-6 w-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.5 10.5A1.5 1.5 0 0110 9h4a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1.5 1.5h-4A1.5 1.5 0 018.5 11.5v-1zM7 17h10"
    />
  </svg>
);

interface IUser {
  email: string;
  userId: number;
  iat: number;
}

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [user, setUser] = useState<IUser | undefined>();

  useEffect(() => {
    const getSession = async () => {
      const response = await fetch("/api/auth/session", {
        credentials: "include",
      });

      if (response.ok) {
        console.log(response);
        console.log("response", response);
        const data = await response.json();
        console.log("data", data);
        if (data.user) {
          setIsAuthenticated(true);
          setUserEmail(data.user.email);
          setUser(data.user);
        }
      } else {
        setIsAuthenticated(false);
        await router.push("/api/auth/signin");
      }
    };
    console.log("user", user);

    getSession();
  }, []);
  return (
    <div
      className={`flex flex-col overflow-hidden items-center justify-between p-5 ${
        isAuthenticated ? "bg-transparent" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center w-full">
        <div>
          <Link href="/">
            <h1>Logo</h1>
          </Link>
        </div>
        {isAuthenticated ? (
          <div className="flex items-center gap-5">
            {userEmail}
            <div onMouseEnter={() => setShowLogoutModal(true)}>
              <Link href="/settings">
                <AvatarIcon />
              </Link>
              {showLogoutModal && (
                <div
                  className="absolute bg-white flex flex-col w-48 h-48 space-y-2 mt-10 p-4 right-4 top-4 rounded-lg shadow-md justify-center gap-5"
                  onMouseLeave={() => setShowLogoutModal(false)}
                >
                  <Link href="/settings">
                    <button className="bg-gray-200 text-black px-4 py-1 w-full">
                      Settings
                    </button>{" "}
                  </Link>
                  <button
                    onClick={() =>
                      signOut({ callbackUrl: "http://localhost:3000" })
                    }
                    className="bg-red-500 text-white px-4 py-1 w-full"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex space-x-4 items-center gap-10">
            <div className="flex space-x-7">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/signup">
                <button className="solidPurpleButton">Sign up</button>
              </Link>
              <LoginModal />
            </div>
          </div>
        )}
      </div>
      {isAuthenticated && (
        <div className="border-b-2 border-solid p-2 border-gray-300 w-full"></div>
      )}
    </div>
  );
}
