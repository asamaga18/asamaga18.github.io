import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

declare global {
  interface Window {
    google: any;
    handleCredentialResponse?: (response: any) => void;
  }
}

const Signup = () => {
  const navigate = useNavigate();

  const sendToBackend = async (data: any) => {
    await fetch('http://localhost:5000/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.handleCredentialResponse = (response) => {
      const data = parseJwt(response.credential);
      console.log("User signing up:", data);
      localStorage.setItem('firstName', data.given_name); // Store first name
      sendToBackend(data);
      navigate('/home');
    };

    return () => {
      document.body.removeChild(script);
      delete window.handleCredentialResponse;
    };
  }, [navigate]);

  const parseJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(jsonPayload);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join The Tomato Trade and start sharing</p>

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

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
