import React from "react";
import { FaFacebookF } from "react-icons/fa";
import { FaGooglePlusG } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";

function SignUpForm() {
  const [state, setState] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    const { name, email, password } = state;

    // Gọi API đăng ký
    try {
      // https://azure-dau-viet-function-bucwa3f7b2fjbnbh.eastus-01.azurewebsites.net/
      const response = await fetch(
        "https://azure-dau-viet-function-bucwa3f7b2fjbnbh.eastus-01.azurewebsites.net/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: name, email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(`Đăng ký thành công: ${data.message}`);
        // Reset form
        setState({ username: "", email: "", password: "" });
      } else {
        alert(`Lỗi đăng ký: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      alert("Lỗi kết nối tới server: " + error.message);
    }
  };

  const buttonStyle = {
    borderRadius: "20px",
    marginTop: "20px",
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
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1 style={{ fontSize: 32 }}>Tạo tài khoản</h1>
        <div className="social-container">
          {/* <button
            type="button"
            className="social"
            aria-label="Sign up with Facebook"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <FaFacebookF className="fab fa-facebook-f" />
          </button>
          <button
            type="button"
            className="social"
            aria-label="Sign up with Google"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <FaGooglePlusG />
          </button>
          <button
            type="button"
            className="social"
            aria-label="Sign up with Instagram"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <FaInstagram />
          </button> */}
        </div>
        {/* <span>or use your email for registration</span> */}
        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Tên"
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Mật khẩu"
        />
        <button style={buttonStyle}>Đăng ký</button>
      </form>
    </div>
  );
}

export default SignUpForm;
