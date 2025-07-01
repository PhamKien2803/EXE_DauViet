import { useState } from "react";
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
              <h1 style={{ fontSize: 32 }}>Chào mừng bạn trở lại!</h1>
              <p>
                Để giữ liên lạc với chúng tôi, vui lòng đăng nhập bằng thông tin
                cá nhân của bạn
              </p>
              <button
                style={ghostButtonStyle}
                className="ghost"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                ĐĂng nhập
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 style={{ fontSize: 32 }}>Chào, Bạn!</h1>
              <p>
                Nhập thông tin cá nhân của bạn và bắt đầu hành trình cùng chúng
                tôi
              </p>
              <button
                style={ghostButtonStyle}
                className="ghost "
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Đăng ký tài khoản
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
