import React, {
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Yukticlogo.png";
import api from "../services/api";
import "../style/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [capsLock, setCapsLock] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  /* =========================================================
     PASSWORD VALIDATION
  ========================================================= */

  const passwordHasMinLength = password.length >= 8;

  const passwordHasNumber = /[0-9]/.test(password);

  const passwordHasSpecialCharacter =
    /[^A-Za-z0-9\s]/.test(password);

  const passwordIsValid =
    passwordHasMinLength &&
    passwordHasNumber &&
    passwordHasSpecialCharacter;


  /* =========================================================
     CAPS LOCK
  ========================================================= */

  const handleCapsLock = (
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    setCapsLock(
      e.getModifierState("CapsLock")
    );
  };


  /* =========================================================
     EMAIL VALIDATION
  ========================================================= */

  const validateEmail = (value: string): string => {
    if (!value.trim()) {
      return "Email address is required.";
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value.trim())) {
      return "Please enter a valid email address.";
    }

    return "";
  };


  /* =========================================================
     PASSWORD VALIDATION
  ========================================================= */

  const validatePassword = (
    value: string
  ): string => {

    if (!value) {
      return "Password is required.";
    }

    if (value.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (!/[0-9]/.test(value)) {
      return "Password must contain at least one number.";
    }

    if (!/[^A-Za-z0-9\s]/.test(value)) {
      return "Password must contain at least one special character.";
    }

    return "";
  };


  /* =========================================================
     EMAIL CHANGE
  ========================================================= */

  const handleEmailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const value = e.target.value;

    setEmail(value);

    setError("");

    if (!value) {
      setEmailError("");
      return;
    }

    setEmailError(
      validateEmail(value)
    );
  };


  /* =========================================================
     PASSWORD CHANGE
  ========================================================= */

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const value = e.target.value;

    setPassword(value);

    setError("");

    if (!value) {
      setPasswordError("");
      return;
    }

    setPasswordError(
      validatePassword(value)
    );
  };


  /* =========================================================
     LOGIN
  ========================================================= */

  const handleLogin = async (
    e: FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setError("");

    /* -----------------------------------------
       VALIDATE EMAIL
    ----------------------------------------- */

    const currentEmailError =
      validateEmail(email);

    /* -----------------------------------------
       VALIDATE PASSWORD
    ----------------------------------------- */

    const currentPasswordError =
      validatePassword(password);

    setEmailError(currentEmailError);
    setPasswordError(currentPasswordError);

    /* -----------------------------------------
       STOP LOGIN IF VALIDATION FAILS
    ----------------------------------------- */

    if (
      currentEmailError ||
      currentPasswordError
    ) {
      return;
    }

    setLoading(true);

    try {

      const res = await api.post(
        "/auth/login",
        {
          email: email.trim(),
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "role",
        res.data.role
      );

      localStorage.setItem(
        "email",
        res.data.email
      );

      navigate("/dashboard");

    } catch (err: unknown) {

      console.error(
        "Login error:",
        err
      );

      let errorMessage: string | undefined;

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err
      ) {

        const axiosError =
          err as {
            response?: {
              data?: {
                detail?: string;
                message?: string;
              };
            };
          };

        errorMessage =
          axiosError.response?.data?.detail ||
          axiosError.response?.data?.message;
      }

      setError(
        errorMessage ||
        "Unable to sign in. Please check your credentials."
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <main className="login-page">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="login-background">

        <div className="bg-grid"></div>

        <div className="ambient ambient-one"></div>
        <div className="ambient ambient-two"></div>
        <div className="ambient ambient-three"></div>

        <div className="floating-shape shape-one"></div>
        <div className="floating-shape shape-two"></div>
        <div className="floating-shape shape-three"></div>

        <div className="background-dots dots-one"></div>
        <div className="background-dots dots-two"></div>

      </div>


      {/* =====================================================
          HEADER
      ===================================================== */}

      


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="login-content">

        {/* ===================================================
            LEFT CONTENT
        =================================================== */}

        <div className="login-intro">

          <div className="intro-eyebrow">

            <span className="eyebrow-line"></span>

            YUKTIC ADMINISTRATION

          </div>


          <h1>

            Welcome

            <span>
              back.
            </span>

          </h1>


          <p className="intro-text">

            Sign in to your Yuktic workspace and continue
            managing everything from one intelligent
            administrative platform.

          </p>


          <div className="intro-cards">

            <div className="mini-card mini-card-primary">

              <div className="mini-icon">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                >

                  <path
                    d="M12 3L20 7V12C20 16.8 16.8 20.2 12 21C7.2 20.2 4 16.8 4 12V7L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />

                  <path
                    d="M9 12L11 14L15.5 9.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                </svg>

              </div>


              <div>

                <strong>
                  Protected access
                </strong>

                <span>
                  Your workspace is secured
                </span>

              </div>

            </div>


            <div className="mini-card mini-card-secondary">

              <div className="mini-icon purple-icon">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                >

                  <path
                    d="M4 17L9 12L13 16L20 8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M16 8H20V12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                </svg>

              </div>


              <div>

                <strong>
                  Built for teams
                </strong>

                <span>
                  Everything in one place
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* ===================================================
            LOGIN PANEL
        =================================================== */}

        <div className="login-panel-wrapper">

          <div className="login-panel-glow"></div>


          <div className="login-panel">

            {/* -----------------------------------------------
                PANEL HEADER
            ------------------------------------------------ */}

            <div className="panel-top">

              <div className="panel-icon">

                <img
                  src={Logo}
                  alt="Yuktic logo"
                />

              </div>


              <div className="panel-heading">

                <span>
                  ADMIN ACCESS
                </span>

                <h2>
                  Sign in
                </h2>

                <p>
                  Enter your credentials to continue
                </p>

              </div>

            </div>


            {/* -----------------------------------------------
                FORM
            ------------------------------------------------ */}

            <form
              onSubmit={handleLogin}
              className="login-form"
              noValidate
            >

              {/* =================================================
                  EMAIL
              ================================================= */}

              <div className="field-group">

                <label htmlFor="email">
                  Email address
                </label>


                <div
                  className={`input-wrapper ${
                    emailError
                      ? "input-error"
                      : email
                      ? "input-valid"
                      : ""
                  }`}
                >

                  <div className="input-icon">

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                    >

                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="3"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />

                      <path
                        d="M4 7L12 13L20 7"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                    </svg>

                  </div>


                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={handleEmailChange}
                    autoComplete="email"
                    disabled={loading}
                  />


                  {email &&
                    !emailError && (
                      <div className="input-check">

                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                        >

                          <path
                            d="M5 12L10 17L19 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                        </svg>

                      </div>
                    )}

                </div>


                {/* EMAIL ERROR - OUTSIDE INPUT */}

                {emailError && (
                  <div className="field-error">

                    <span>
                      !
                    </span>

                    {emailError}

                  </div>
                )}

              </div>


              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div className="field-group password-field">

                <div className="label-row">

                  <label htmlFor="password">
                    Password
                  </label>

                  <span className="required-label">
                    Required
                  </span>

                </div>


                <div
                  className={`input-wrapper ${
                    capsLock
                      ? "caps-active"
                      : ""
                  } ${
                    passwordError
                      ? "input-error"
                      : password && passwordIsValid
                      ? "input-valid"
                      : ""
                  }`}
                >

                  <div className="input-icon">

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                    >

                      <rect
                        x="5"
                        y="10"
                        width="14"
                        height="10"
                        rx="2.5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />

                      <path
                        d="M8 10V7.5C8 5.57 9.79 4 12 4C14.21 4 16 5.57 16 7.5V10"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />

                    </svg>

                  </div>


                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyDown={handleCapsLock}
                    onKeyUp={handleCapsLock}
                    autoComplete="current-password"
                    disabled={loading}
                  />


                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    tabIndex={-1}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showPassword ? (

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                      >

                        <path
                          d="M3 3L21 21"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M10.6 10.7C10.25 11.05 10 11.55 10 12C10 13.1 10.9 14 12 14C12.45 14 12.95 13.75 13.3 13.4"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M9.88 5.08C10.56 4.88 11.27 4.78 12 4.78C17.2 4.78 20.5 9.3 21.5 12C21.1 13.1 20.1 15 18.4 16.7"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M6.1 6.1C4.2 7.5 3 9.7 2.5 12C3.5 14.7 6.8 19.2 12 19.2C13.35 19.2 14.58 18.9 15.67 18.42"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                      </svg>

                    ) : (

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                      >

                        <path
                          d="M2.5 12C3.5 9.3 6.8 4.8 12 4.8C17.2 4.8 20.5 9.3 21.5 12C20.5 14.7 17.2 19.2 12 19.2C6.8 19.2 3.5 14.7 2.5 12Z"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />

                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />

                      </svg>

                    )}

                  </button>

                </div>


                {/* CAPS LOCK */}

                {capsLock && (
                  <div className="caps-warning">

                    <span>
                      ⇧
                    </span>

                    Caps Lock is on

                  </div>
                )}


                {/* PASSWORD REQUIREMENTS */}

                {password && (
                  <div className="password-requirements">

                    <div
                      className={
                        passwordHasMinLength
                          ? "requirement valid"
                          : "requirement"
                      }
                    >

                      <span>
                        {passwordHasMinLength
                          ? "✓"
                          : "○"}
                      </span>

                      At least 8 characters

                    </div>


                    <div
                      className={
                        passwordHasNumber
                          ? "requirement valid"
                          : "requirement"
                      }
                    >

                      <span>
                        {passwordHasNumber
                          ? "✓"
                          : "○"}
                      </span>

                      At least one number

                    </div>


                    <div
                      className={
                        passwordHasSpecialCharacter
                          ? "requirement valid"
                          : "requirement"
                      }
                    >

                      <span>
                        {passwordHasSpecialCharacter
                          ? "✓"
                          : "○"}
                      </span>

                      At least one special character

                    </div>

                  </div>
                )}


                {/* PASSWORD ERROR */}

                {passwordError && (
                  <div className="field-error">

                    <span>
                      !
                    </span>

                    {passwordError}

                  </div>
                )}

              </div>


              {/* =================================================
                  SERVER ERROR
              ================================================= */}

              {error && (
                <div className="login-error">

                  <div className="error-icon">
                    !
                  </div>

                  <span>
                    {error}
                  </span>

                </div>
              )}


              {/* =================================================
                  SUBMIT
              ================================================= */}

              <button
                type="submit"
                className={`continue-button ${
                  loading
                    ? "loading"
                    : ""
                }`}
                disabled={loading}
              >

                <span className="button-content">

                  {loading ? (

                    <>
                      <span className="button-spinner"></span>

                      Signing in...
                    </>

                  ) : (

                    <>
                      Continue

                      <span className="button-arrow">
                        →
                      </span>
                    </>

                  )}

                </span>


                <span className="button-shine"></span>

              </button>

            </form>


            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="panel-footer">

              <div className="footer-line"></div>

              <div className="footer-security">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                >

                  <path
                    d="M12 3L19 6V11.5C19 15.7 16.2 19.1 12 20C7.8 19.1 5 15.7 5 11.5V6L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />

                  <path
                    d="M9 12L11 14L15 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                </svg>

                Secure administrative access

              </div>

            </div>

          </div>

        </div>

      </section>


      

      
    </main>
  );
};

export default Login;