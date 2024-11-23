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
    <div className="auth-page min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
    <div className="flex flex-col md:flex-row w-11/12 md:w-8/12 bg-gray-900 text-white shadow-xl rounded-lg overflow-hidden">
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
        className={`w-full bg-gray-900 md:w-1/2 p-8 flex flex-col justify-center items-center text-white shadow-xl rounded-lg ${
          isLogin ? "order-2" : "order-1"
        }`}
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
          className="mt-6 w-1/2 px-4 py-2 bg-transparent border border-white text-white hover:border hover:border-primary rounded-lg font-semibold transition duration-150"
        >
          {isLogin ? "Sign up" : "Login"}
        </button>
      </div>
    </div>
  </div>
  );
};

export default AuthPage;
