import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

interface UserData {
  name: string;
  email: string;
  sub: string;
}

declare global {
  interface Window {
    google: any;
    handleCredentialResponse: (response: any) => void;
  }
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);

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
      console.log("User signed up:", data);
      setUserData({
        name: data.name,
        email: data.email,
        sub: data.sub
      });
      
      // Redirect to home after a brief delay to show the user info
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    };

    return () => {
      document.body.removeChild(script);
      delete window.handleCredentialResponse;
    };
  }, [navigate]);

  const parseJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  };

  return (
    <div className="auth-container">
      <h2>Sign Up with Google</h2>
      <div
        id="g_id_onload"
        data-client_id="339592120472-nlm1adirm0hrm2b4okpb5lqalk4bpnci.apps.googleusercontent.com"
        data-context="signup"
        data-callback="handleCredentialResponse"
        data-auto_prompt="false"
      ></div>
      <div
        className="g_id_signin google-button"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="sign_up_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>

      {userData && (
        <div className="user-info">
          <strong>Signed up as:</strong><br />
          Name: {userData.name}<br />
          Email: {userData.email}<br />
          Google ID: {userData.sub}
        </div>
      )}
    </div>
  );
};

export default Signup; 