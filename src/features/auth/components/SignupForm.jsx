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
      <div className="lg:flex md:flex lg:space-x-4 md:space-x-4 space-y-4 lg:space-y-0 md:space-y-0">
        <div className="lg:w-1/2 md:w-1/2">
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
        </div>
        <div className="lg:w-1/2 md:w-1/2">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Role</label>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value })
          }
        >
          <option value="trainee">Trainee</option>
          <option value="trainer">Trainer</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="md:flex lg:flex gap-4">
        <div className="w-full md:w-1/2 lg:w-1/2">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>
        <div className="w-full md:w-1/2 lg:w-1/2">
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
          />
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
        <span className="text-sm text-gray-600">
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
        className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition"
        disabled={!formData.acceptTerms}
      >
        Create Account
      </button>
    </form>

  );
};

export default SignupForm;
