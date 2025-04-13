import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

declare global {
  interface Window {
    google: any;
    handleCredentialResponse?: (response: any) => void;
  }
}

const Login = () => {
  const navigate = useNavigate();

  const sendToBackend = async (credential: string) => {
    try {
      console.log("Sending credential to backend...");
      const response = await fetch('http://localhost:8000/auth/google-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credential })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Authentication error:', errorData);
        throw new Error('Authentication failed: ' + errorData);
      }

      const data = await response.json();
      console.log("Received response from backend:", data);
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('user_id', data.user.id);
      localStorage.setItem('user_email', data.user.email);
      localStorage.setItem('user_first_name', data.user.first_name);
      localStorage.setItem('user_last_name', data.user.last_name);
      localStorage.setItem('user_full_name', `${data.user.first_name} ${data.user.last_name}`);
      if (data.user.profile_picture) {
        localStorage.setItem('user_profile_picture', data.user.profile_picture);
      }
      
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to log in. Please try again.');
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.handleCredentialResponse = (response) => {
      console.log("Received Google response");
      sendToBackend(response.credential);
    };

    return () => {
      document.body.removeChild(script);
      delete window.handleCredentialResponse;
    };
  }, [navigate]);

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
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;