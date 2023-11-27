// import postUser from '../serverActions/dbActions/postUser';
import { FormEvent, useState, useEffect } from "react";
// import sendEmail from '../serverActions/sendEmail';
import Notification from "../components/Alert";
import dynamic from "next/dynamic";
const GoogleLogin = dynamic(() => import("../components/auth/GoogleLogin"), {
  ssr: false,
});

let gapi: any;
const clientId =
  "358155175620-tmo0ped23qte9gpnv4dovqr1i6tj11r6.apps.googleusercontent.com";

function Signup() {
  type NotificationStatus = "success" | "failure" | "info";

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isChecked, setIsChecked] = useState(true);
  const [statusState, setStatusState] = useState<NotificationStatus>("info");
  const [notificationTextState, setNotificationTextState] = useState("info");
  const [authNotification, setAuthNotification] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("gapi-script").then((module) => {
        gapi = module.gapi;
        gapi.load("client:auth2", () => {
          gapi.client.init({
            clientId: clientId,
            scope: "https://www.googleapis.com/auth/userinfo.profile",
          });
        });
      });
    }
  }, []);

  const handleNotificationClose = async () => {
    setTimeout(() => {
      setAuthNotification(false);
    }, 5000);
  };

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    console.log(isChecked);
    if (!isChecked) {
      console.log("not checked");
      setStatusState("info");
      setNotificationTextState(
        "Please make sure to accept our terms of service"
      );
      setAuthNotification(true);
      await handleNotificationClose();
      return;
    }

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    console.log("data", data);
    if (response.status === 200) {
      console.log(data);
      setStatusState("success");
      setNotificationTextState("You have successfully signed up!");
      setAuthNotification(true);
      await handleNotificationClose();
    } else {
      setStatusState("failure");
      setNotificationTextState(data.message);
      setAuthNotification(true);
      await handleNotificationClose();
    }
  }

  const handleGoogleLoginSuccess = async (response: any) => {
    console.log(response);
    // The response object has a different structure in react-google-login
    const { googleId, profileObj } = response;
    const { email, name, imageUrl } = profileObj;

    // Now, you can use this information as per your app's requirements
    // For example, send this data to your backend server for user creation or verification
    try {
      const userResponse = await fetch("/api/auth/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          googleId,
          name,
          email,
          imageUrl,
        }),
      });

      const data = await userResponse.json();

      if (userResponse.ok) {
        // Handle successful user creation or login
        console.log("User logged in:", data);
        // Redirect to dashboard or other page
        // window.location.href = '/dashboard';
      } else {
        // Handle errors
        console.error("Login error:", data.message);
      }
    } catch (error) {
      console.error("Request failed", error);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <div className="w-4/6 h-4/5 bg-white text-center items-center px-32 py-10 flex flex-col justify-around rounded-lg shadow-lg">
        <div className="flex flex-col w-full">
          <h1 className="text-3xl font-sans font-bold">Become a member</h1>
          <p className="text-lg text-gray-800 mt-3">
            Sign up with Google or use the form to create a new account.
          </p>
        </div>

        <GoogleLogin onSuccess={handleGoogleLoginSuccess} />
        <div className="w-full flex flex-col">
          <form
            className="flex flex-col gap-5 text-left text-lg"
            onSubmit={handleSignup}
          >
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1 w-full bg-[#ECECECFF] p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 w-full bg-[#ECECECFF] p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className="mr-2 h-5 w-5 text-purple-500 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
              />

              <label htmlFor="terms">
                By signing up, you accept our terms of service and privacy
                policy.
              </label>
            </div>
            <button className="w-full solidPurpleButton h-16" type="submit">
              Sign up
            </button>
          </form>
        </div>
      </div>
      {authNotification && (
        <Notification text={notificationTextState} status={statusState} />
      )}
    </div>
  );
}

export default Signup;
