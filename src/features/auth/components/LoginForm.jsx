import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { login, clearError } from '../../auth/slices/authSlice';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get auth states from Redux
  const isLoading = useSelector((state) => state.auth.status === 'loading');
  const error = useSelector((state) => state.auth.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Clear any existing errors when component mounts or unmounts
  useEffect(() => {
    dispatch(clearError());
    return () => dispatch(clearError());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.state?.from || '/home');
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(login(formData));

    if (login.fulfilled.match(resultAction)) {
      navigate(location.state?.from || '/home');
    }
  };

  return (
<form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative z-0 w-full mb-8 group">
        <input
          type="email"
          name="email"
          id="email"
          className="block py-2.5 px-0 w-full text-lg bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <label
          htmlFor="email"
          className="absolute text-lg duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:translate-y-[-1.5rem] peer-focus:scale-75 peer-focus:text-blue-400"
        >
          Email
        </label>
      </div>

      {/* Password Input */}
      <div className="relative z-0 w-full mb-11 group">
        <input
          type="password"
          name="password"
          id="password"
          className="block py-2.5 px-0 w-full text-lg bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <label
          htmlFor="password"
          className="absolute text-lg duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:translate-y-[-1.5rem] peer-focus:scale-75 peer-focus:text-blue-400"
        >
          Password
        </label>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            className="mr-2"
            checked={formData.rememberMe}
            onChange={(e) =>
              setFormData({ ...formData, rememberMe: e.target.checked })
            }
          />
          <label className="text-sm">Remember me</label>
        </div>
        <a
          href="/forgot-password"
          className="text-sm text-green-500 hover:underline mt-6"
        >
          Forgot Password?
        </a>
      </div>
      <button
        type="submit"
        className="w-full bg-transparent border border-primary text-white p-3 rounded-lg hover:bg-primary transition"
      >
        Log in
      </button>
    </form>
  );
};

export default LoginForm;
