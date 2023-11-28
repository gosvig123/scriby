import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginModal() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e:any) => {
    e.preventDefault();
    setError("");

    // Using NextAuth's signIn function for credentials authentication
    signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard", // Specify where to redirect after successful login, adjust as needed
      redirect: false, // Set to false to handle redirect manually
    })
      .then((result: any) => {
        if (result.error) {
          setError(result.error);
        } else if (result.url) {
          window.location.href = result.url; // Redirect to the specified callbackUrl
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        setError("Login failed");
      });
  };

  const handleGoogleLogin = () => {
    // Using NextAuth's signIn function for Google authentication
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="justify-center items-center p-2 transparentPurpleButton">
      <button onClick={() => setIsOpen(true)}>Login</button>

      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center"
          style={{ background: "rgba(0, 0, 0, .8)" }}
        >
          <div className="relative w-4/6 h-4/5 bg-white text-center items-center px-32 py-10 flex flex-col justify-around rounded-lg shadow-lg">
            <button
              style={{
                position: "absolute",
                right: 20,
                top: 20,
                fontSize: "2rem",
              }}
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>
            <div className="flex flex-col w-full">
              <h1 className="text-3xl font-sans font-bold">Login</h1>
              <p className="text-sm text-gray-500 mt-3">
                Login with Google or use the form to access your account.
              </p>
              <button
                onClick={handleGoogleLogin}
                className="w-full mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 flex items-center justify-center transition-colors duration-200 ease-in-out"
              >
                Sign in with Google
              </button>

              {error && <p className="text-red-500">{error}</p>}
            </div>
            <div className="w-full flex flex-col">
              <form
                className="flex flex-col gap-5 text-left"
                onSubmit={handleLogin}
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
                <button className="w-full solidPurpleButton" type="submit">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
