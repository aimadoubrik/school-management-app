import { useState } from 'react';
import { useSelector } from 'react-redux';
import LoginForm from '../../features/auth/components/LoginForm';
import SignupForm from '../../features/auth/components/SignupForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // If authenticated, redirect or display a message
  if (isAuthenticated) {
    return <div>You are already logged in!</div>;
  }

  return (
    <div className="auth-page min-h-screen bg-gradient-to-r from-green-100 to-blue-300 flex items-center justify-center">
    <div className="flex flex-col md:flex-row w-11/12 max-w-5xl bg-white shadow-2xl rounded-lg overflow-hidden">
      {/* Left Section */}
      <div className={`w-full md:w-1/2 p-8 ${isLogin ? "order-1" : "order-2"}`}>
        <h1 className="text-3xl text-center font-bold mb-4">
          {isLogin ? "Welcome Back!" : "Create Account"}
        </h1>
        <p className="text-center text-gray-600 mb-6">
          {isLogin
            ? "Login to your account to continue"
            : "Join our platform today"}
        </p>

        {isLogin ? <LoginForm /> : <SignupForm />}

      </div>

      {/* Right Section */}
      <div
        className={`w-full md:w-1/2 p-8 flex flex-col justify-center items-center bg-no-repeat bg-center bg-cover text-white ${
          isLogin ? "order-2" : "order-1"
        }`}
        style={{
          backgroundImage: "linear-gradient(to right, rgba(0, 128, 0, 0.5), rgba(0, 0, 255, 0.5))",
          backdropFilter: "blur(30px)",
        }}
      >
        <h1 className="text-3xl font-bold mb-4">
          {isLogin ? "Create Account" : "Welcome Back!"}
        </h1>
        <p className="mb-6">
          {isLogin
            ? "Sign up to explore our platform"
            : "Login to manage your dashboard"}
        </p>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 w-1/2 px-4 py-2 bg-transparent border border-white text-white hover:bg-white hover:text-gray-500 text-green-500 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition duration-150"
          >
          {isLogin ? "Sign up" : "Login"}
        </button>
      </div>
    </div>
  </div>
  );
};

export default AuthPage;
