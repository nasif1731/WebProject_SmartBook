"use client";

import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleCredentialResponse = useCallback((response) => {
    // The JWT token contains a user ID (sub field) but not picture
    // So we directly use Google's People API OR store the email and name
  
    const token = response.credential;
  
    const userObject = parseJwt(token);
  
    if (userObject) {
      const { name, email } = userObject;
      const picture = userObject.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  
      localStorage.setItem(
        "googleUser",
        JSON.stringify({ name, email, picture })
      );
      console.log("Google User Info:", { name, email, picture });
      navigate("/");
    } else {
      console.error("Failed to decode Google token");
    }
  }, [navigate]);
  

  useEffect(() => {
    window.google?.accounts.id.initialize({
      client_id: "172966836434-4fkjqf8kn8prf7ra2e82h6pitktc5mqj.apps.googleusercontent.com",
      callback: handleCredentialResponse,
      ux_mode: "popup",
      auto_select: true,
      scope: "profile email" 
    });
  
    window.google?.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      { theme: "outline", size: "large" }
    );
  }, [handleCredentialResponse]);
  

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Login to SmartBook</h2>

      <div id="google-signin-button" className="mb-4"></div>

      <div className="text-gray-600">or continue with email/password (coming soon)</div>
    </div>
  );
};

export default LoginPage;
