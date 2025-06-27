import React, { useState } from "react";
import "../styles/styleLogin.css";

import SignInForm from "./SignIn";
import SignUpForm from "./SIngUp";

export default function Login() {
  const [type, setType] = useState("signIn");
  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");

  const pageStyle = {
    background: "#f6f5f7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    fontFamily: "'Montserrat', sans-serif",
    height: "100vh",
  };

  const buttonStyle = {
    borderRadius: "20px",
    border: "1px solid #ff4b2b",
    backgroundColor: "#ff4b2b",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "bold",
    padding: "12px 45px",
    letterSpacing: "1px",
    textTransform: "uppercase",
    transition: "transform 80ms ease-in",
    outline: "none",
  };

  const ghostButtonStyle = {
    ...buttonStyle,
    backgroundColor: "transparent",
    borderColor: "#ffffff",
  };

  return (
    <div className="App" style={pageStyle}>
      <div className={containerClass} id="container">
        <SignUpForm />
        <SignInForm />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 style={{ fontSize: 32 }}>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button
                style={ghostButtonStyle}
                className="ghost"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 style={{ fontSize: 32 }}>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button
                style={ghostButtonStyle}
                className="ghost "
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
