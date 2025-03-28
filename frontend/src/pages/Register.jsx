import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

// Styled Components
const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  padding: 20px;

  .register-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    padding: 40px;
    width: 100%;
    max-width: 480px;
    text-align: center;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #4f46e5, #06b6d4);
    }
  }

  .logo-container {
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .logo-circle {
      width: 80px;
      height: 80px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 100%;
        height: 100%;
      }
    }

    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }
  }

  h2 {
    font-size: 22px;
    color: #1e293b;
    margin-bottom: 8px;
  }

  .subtitle {
    color: #64748b;
    margin-bottom: 24px;
    font-size: 14px;
  }

  .error-message {
    background: #fee2e2;
    color: #dc2626;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .input-group {
      text-align: left;

      label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        color: #475569;
        font-weight: 500;
      }

      input {
        width: 100%;
        padding: 12px 16px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.2s;
        background-color: #f8fafc;

        &:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
      }
    }

    button {
      background: linear-gradient(90deg, #4f46e5, #06b6d4);
      color: white;
      border: none;
      padding: 14px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;

      .spinner {
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    }
  }

  .footer-links {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-size: 14px;
    color: #64748b;

    a {
      color: #4f46e5;
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const Register = () => {
  // State Management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      
      // Backend Registration
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }), // Removed password from backend request
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }
  
      // Success
      localStorage.setItem("token", token);
      navigate("/dashboard");
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(
        error.message.includes('email-already-in-use') || 
        error.message.includes('Email already')
          ? "Email already in use. Please login instead."
          : error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Render
  return (
    <RegisterContainer>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="register-card"
      >
        {/* Logo Section */}
        <div className="logo-container">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="logo-circle"
          >
            <svg viewBox="0 0 100 100">
              <path
                d="M50 10 L90 50 L50 90 L10 50 Z"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="2"
              />
            </svg>
          </motion.div>
          <h1>StockSense</h1>
        </div>
        
        {/* Header Section */}
        <h2>Create Account</h2>
        <p className="subtitle">Get started with your investment journey</p>
        
        {/* Error Display */}
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="error-message"
          >
            {error}
          </motion.div>
        )}
        
        {/* Registration Form */}
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>
        
        {/* Footer Links */}
        <div className="footer-links">
          <span>Already have an account? <Link to="/login">Sign in</Link></span>
        </div>
      </motion.div>
    </RegisterContainer>
  );
};

export default Register;