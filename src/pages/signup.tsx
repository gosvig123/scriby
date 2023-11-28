import { FormEvent, useState, useEffect } from "react";
import Notification from "../components/Alert";
import { signIn } from "next-auth/react";

function Signup() {
  type NotificationStatus = "success" | "failure" | "info";

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isChecked, setIsChecked] = useState(true);
  const [statusState, setStatusState] = useState<NotificationStatus>("info");
  const [notificationTextState, setNotificationTextState] = useState("info");
  const [authNotification, setAuthNotification] = useState(false);

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

    console.log("data received", data);
    if (response.status === 200) {
      setStatusState("success");
      setNotificationTextState(
        "You have successfully signed up and will be redirected shortly!"
      );
      setAuthNotification(true);
      await handleNotificationClose();

      setTimeout(() => {
        signIn("credentials", {
          email,
          password,
          callbackUrl: "/dashboard",
        });
      }, 5000);
    } else {
      setStatusState("failure");
      setNotificationTextState(data.message);
      setAuthNotification(true);
      await handleNotificationClose();
    }
  }

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
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
        <button
          onClick={handleGoogleLogin}
          className="w-full mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 flex items-center justify-center transition-colors duration-200 ease-in-out"
        >
          Sign in with Google
        </button>

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
