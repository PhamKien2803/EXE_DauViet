import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";

function SignInForm() {
  const [state, setState] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;

      const response = await fetch(
        "https://azure-dau-viet-function-bucwa3f7b2fjbnbh.eastus-01.azurewebsites.net/api/auth/google-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: credential }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const { accessToken } = data;
        localStorage.setItem("accessToken", accessToken);

        const responseMe = await fetch("http://localhost:7071/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const userInfo = await responseMe.json();
        login(userInfo);

        // Chuyển hướng về trang chủ (do không có admin)
        localStorage.setItem("user", JSON.stringify(userInfo));
        navigate("/");
      } else {
        setErrorMessage("Không thể đăng nhập bằng Google.");
      }
    } catch (error) {
      setErrorMessage("Lỗi đăng nhập Google: " + error.message);
    }
  };

  const handleError = () => {
    setErrorMessage("Đăng nhập Google thất bại. Vui lòng thử lại.");
  };

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
      // https://azure-dau-viet-function-bucwa3f7b2fjbnbh.eastus-01.azurewebsites.net/
      const response = await fetch("https://azure-dau-viet-function-bucwa3f7b2fjbnbh.eastus-01.azurewebsites.net/api/auth/login", {
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
        const responseMe = await fetch("https://azure-dau-viet-function-bucwa3f7b2fjbnbh.eastus-01.azurewebsites.net/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const userInfo = await responseMe.json();
        login(userInfo);

        // Chuyển hướng về trang chủ (do không có admin)
        localStorage.setItem("user", JSON.stringify(userInfo));
        navigate("/");
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
    marginTop: "30px",
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1 style={{ fontSize: 32, paddingBottom: 20 }}>Sign in</h1>
        {/* <div className="social-container">
          <a href="#" className="social">
            <FaFacebookF />
          </a>
          <a href="#" className="social">
            <FaGooglePlusG />
          </a>
          <a href="#" className="social">
            <FaInstagram />
          </a>
        </div> */}
        {/* <span>or use your account</span> */}
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
        <Link to="/forgot-password" className="text-blue-500 hover:underline">
          Forgot your password?
        </Link>
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />

        <button type="submit" style={buttonStyle}>
          Sign In
        </button>

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
