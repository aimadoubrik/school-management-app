import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, User, AlertCircle, Loader2, GraduationCap } from 'lucide-react';
import { signup, clearError } from '../../auth/slices/authSlice';

// Password validation helper that matches the backend requirements
const validatePassword = (password) => {
  const requirements = {
    minLength: 8,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    numbers: /[0-9]/,
    specialCharacters: /[!@#$%^&*(),.?":{}|<>]/,
  };

  const errors = [];
  if (password.length < requirements.minLength) {
    errors.push(`Password must be at least ${requirements.minLength} characters long`);
  }
  if (!requirements.uppercase.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!requirements.lowercase.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!requirements.numbers.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!requirements.specialCharacters.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return errors;
};

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get auth states from Redux
  const isLoading = useSelector((state) => state.auth.status === 'loading');
  const reduxError = useSelector((state) => state.auth.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    acceptTerms: false,
  });

  const [localErrors, setLocalErrors] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    errors: [],
  });

  // Clear any existing errors when component mounts or unmounts
  useEffect(() => {
    dispatch(clearError());
    return () => dispatch(clearError());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  // Validate password on change
  useEffect(() => {
    if (formData.password) {
      const errors = validatePassword(formData.password);
      setPasswordStrength({
        score: errors.length === 0 ? 100 : Math.max(0, 100 - errors.length * 20),
        errors,
      });
    } else {
      setPasswordStrength({ score: 0, errors: [] });
    }
  }, [formData.password]);

  const validateForm = () => {
    const errors = [];

    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }

    if (passwordStrength.errors.length > 0) {
      errors.push(...passwordStrength.errors);
    }

    if (!formData.acceptTerms) {
      errors.push('You must accept the Terms of Service and Privacy Policy');
    }

    setLocalErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalErrors([]);

    if (!validateForm()) {
      return;
    }

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...signupData } = formData;
    const resultAction = await dispatch(signup(signupData));

    if (signup.fulfilled.match(resultAction)) {
      navigate('/home');
    }
  };

  // Combine local validation errors with backend errors
  const displayErrors = [...localErrors, reduxError].filter(Boolean);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="">
        <div className="flex flex-row space-x-4">
          <div className="flex-1">
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="name"
                id="name"
                className="block py-2.5 px-0 w-full text-lg bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <label
                htmlFor="name"
                className="absolute text-lg duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:translate-y-[-1.5rem] peer-focus:scale-75 peer-focus:text-blue-400"
              >
                Full Name
              </label>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="email"
                name="email"
                id="email"
                className="block py-2.5 px-0 w-full text-lg  bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
          </div>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            className="select select-primary w-full bg-transparent"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option className='text-white bg-slate-900' value="trainee">Trainee</option>
            <option className='text-white bg-slate-900' value="trainer">Trainer</option>
            <option className='text-white bg-slate-900' value="admin">Admin</option>
          </select>
        </div>
        <div className="md:flex lg:flex gap-4">
          <div className="w-full md:w-1/2 lg:w-1/2">
            <div className="relative z-0 w-full mb-6 group">
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
          </div>
          <div className="w-full md:w-1/2 lg:w-1/2">
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="block py-2.5 px-0 w-full text-lg bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
              <label
                htmlFor="confirmPassword"
                className="absolute text-lg duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:translate-y-[-1.5rem] peer-focus:scale-75 peer-focus:text-blue-400"
              >
                Confirm Password
              </label>
            </div>
          </div>
        </div>
      </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="mr-2"
            checked={formData.acceptTerms}
            onChange={(e) =>
              setFormData({ ...formData, acceptTerms: e.target.checked })
            }
            required
          />
          <span className="text-lg">
            I agree to the{" "}
            <a href="/terms" className="text-green-500 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-green-500 hover:underline">
              Privacy Policy
            </a>
          </span>
        </div>
        <button
          type="submit"
          className="w-full bg-transparent border border-primary text-white p-3 rounded-lg hover:bg-primary cursor-pointer transition"
          disabled={!formData.acceptTerms}
        >
          Create Account
        </button>
    </form>

  );
};

export default SignupForm;
