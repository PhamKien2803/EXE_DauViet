import React, { useState } from "react";
import { FaFacebookF, FaGooglePlusG, FaInstagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

function SignInForm() {
  const [state, setState] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useUser();

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    setErrorMessage(""); // clear lỗi cũ

    const { email, password } = state;

    try {
      const response = await fetch("http://localhost:9999/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { accessToken } = data;
        localStorage.setItem("accessToken", accessToken);
        const responseMe = await fetch("http://localhost:9999/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const userInfo = await responseMe.json();

        const { role } = userInfo;
        login(userInfo);
        if (role === "admin") {
          navigate("admin/dashboard");
          console.log("Tài khoản admin");
        } else if (role === "customer") {
          localStorage.setItem("user", JSON.stringify(userInfo));
          navigate("/");
        } else {
          setErrorMessage("Không xác định được vai trò người dùng.");
        }
      } else {
        setErrorMessage("Sai thông tin đăng nhập hoặc mật khẩu.");
      }
    } catch (error) {
      setErrorMessage("Không thể kết nối đến máy chủ: " + error.message);
    }

    setState({ email: "", password: "" });
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

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1 style={{ fontSize: 32 }}>Sign in</h1>
        <div className="social-container">
          <button type="button" className="social" aria-label="Sign in with Facebook">
            <FaFacebookF />
          </button>
          <button type="button" className="social" aria-label="Sign in with Google Plus">
            <FaGooglePlusG />
          </button>
          <button type="button" className="social" aria-label="Sign in with Instagram">
            <FaInstagram />
          </button>
        </div>
        <span>or use your account</span>
        <input
          type="text"
          placeholder="Username"
          name="email"
          value={state.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
        />
        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            color: "#007bff",
            textDecoration: "underline",
            cursor: "pointer",
            padding: 0,
            font: "inherit"
          }}
          onClick={() => alert("Forgot password functionality not implemented yet.")}
        >
          Forgot your password?
        </button>
        <button type="submit" style={buttonStyle}>
          Sign In
        </button>

        {/* Hiển thị lỗi đăng nhập */}
        {errorMessage && (
          <p style={{ color: "red", marginTop: "12px", fontSize: "14px" }}>
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}

export default SignInForm;
