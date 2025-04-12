import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

declare global {
  interface Window {
    google: any;
    handleCredentialResponse: (response: any) => void;
  }
}

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Google Sign-In
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Handle the credential response
    window.handleCredentialResponse = (response) => {
      const data = parseJwt(response.credential);
      console.log("User data:", data);
      navigate('/home'); // Redirect to home after successful login
    };

    return () => {
      document.body.removeChild(script);
      delete window.handleCredentialResponse;
    };
  }, [navigate]);

  const parseJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Sign in to continue to The Tomato Trade</p>

        <div
          id="g_id_onload"
          data-client_id="339592120472-nlm1adirm0hrm2b4okpb5lqalk4bpnci.apps.googleusercontent.com"
          data-context="signin"
          data-callback="handleCredentialResponse"
          data-auto_prompt="false"
        ></div>
        <div
          className="g_id_signin google-button"
          data-type="standard"
          data-shape="rectangular"
          data-theme="outline"
          data-text="sign_in_with"
          data-size="large"
          data-logo_alignment="left"
        ></div>

        <div className="auth-footer">
          Don't have an account? <a href="/signup">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Login; 