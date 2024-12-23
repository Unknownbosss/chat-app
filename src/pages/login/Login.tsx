import React, { useState } from "react";
import "./login.css/";
import assets from "../../assets/assets";

function Login() {
  const [currentState, setCurrentState] = useState<string>("Sign Up");

  return (
    <div className="login">
      <img src={assets.logo_big} alt="" className="logo" />
      <form className="login-form">
        <h2>{currentState}</h2>
        {currentState === "Sign Up" ? (
          <input
            type="text"
            placeholder="Username"
            className="form-input"
            required
          />
        ) : null}
        <input
          type="email"
          placeholder="Email Address"
          className="form-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="form-input"
          required
        />
        <button type="submit">
          {currentState === "Sign Up" ? "Create Accoount" : "Login Now"}
        </button>
        <div className="login-term">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="login-forgot">
          {currentState === "Sign Up" ? (
            <p className="login-toggle">
              Already have an account{" "}
              <span onClick={() => setCurrentState("Login")}> login Here</span>
            </p>
          ) : (
            <p className="login-toggle">
              Create an account
              <span onClick={() => setCurrentState("Sign Up")}>
                {" "}
                click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default Login;
