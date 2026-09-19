import { useState } from "react";
import AdminSignIn from "./adminSignIn";
import LoginForm from "./loginform ";
// import SignupForm from "./SignupForm";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState(""); // Define setMessage here

  return (
    <div className="flex relative justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      {message && (
        <p className="absolute px-4 py-2 text-white font-semibold top-2 right-2 bg-blue-500 text-center rounded mt-4">
          {message}
        </p>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl transition-all duration-300">
        <div className="flex mb-8 border-b border-gray-200">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-3 font-semibold text-lg transition-colors duration-200 ${!isSignUp ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-500"}`}
          >
            User
          </button>
          {/* <button
                        onClick={() => setIsSignUp(true)}
                        className={`flex-1 py-3 font-semibold text-lg transition-colors duration-200 ${isSignUp ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-500"}`}
                    >
                        Admin
                    </button> */}
        </div>

        {isSignUp ? (
          // <SignupForm setMessage={setMessage} /> // Pass setMessage here
          <AdminSignIn />
        ) : (
          <LoginForm setMessage={setMessage} /> // Pass setMessage here
        )}
      </div>
    </div>
  );
};

export default AuthForm;
