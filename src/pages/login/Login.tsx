import React, { useState } from "react";
import "./login.css";
import assets from "../../assets/assets";
import { signUp, login, resetPass } from "../../config/firebase";

function Login() {
  const [currentState, setCurrentState] = useState<string>("Sign Up");
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentState === "Sign Up") {
      signUp(userName, email, password);
    } else {
      login(email, password);
    }
  };

  return (
    <div className="login">
      <img src={assets.logo_big} alt="" className="logo" />
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{currentState}</h2>
        {currentState === "Sign Up" ? (
          <input
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            value={userName}
            type="text"
            placeholder="Username"
            className="form-input"
            required
          />
        ) : null}
        <input
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
          type="email"
          placeholder="Email Address"
          className="form-input"
          required
        />
        <input
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
          type="password"
          placeholder="Password"
          className="form-input"
          required
        />
        <button type="submit">
          {currentState === "Sign Up" ? "Create Accoount" : "Login Now"}
        </button>
        <div className="login-term">
          <input type="checkbox" checked/>
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
                Click here
              </span>
            </p>
          )}
          {currentState === "Login" ? (
            <p className="login-toggle">
              Forgot Password
              <span onClick={() => resetPass(email)}> Reset here </span>
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}

export default Login;
