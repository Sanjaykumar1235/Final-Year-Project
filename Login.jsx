"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

// Icons as SVG components
const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const VideoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m22 8-6 4 6 4V8Z" />
    <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
  </svg>
)

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
)

const SpinnerIcon = () => (
  <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path
      className="spinner-path"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post("http://localhost:8000/auth/login", form)

      localStorage.setItem("authToken", response.data.token)
      navigate("/home")
    } catch (err) {
      setError("Invalid email or password.")
    } finally {
      setLoading(false)
    }
  }

  // Styles
  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f8f9fe",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    wrapper: {
      width: "100%",
      maxWidth: "420px",
    },
    headerContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "1.5rem",
    },
    iconContainer: {
      backgroundColor: "#7b68ee",
      padding: "0.75rem",
      borderRadius: "0.75rem",
      marginRight: "0.75rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    headerIcon: {
      color: "white",
    },
    headerText: {
      display: "flex",
      flexDirection: "column",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#7b68ee",
      margin: 0,
    },
    subtitle: {
      fontSize: "0.875rem",
      color: "#6b7280",
      margin: 0,
    },
    card: {
      backgroundColor: "white",
      borderRadius: "0.75rem",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
      overflow: "hidden",
    },
    cardHeader: {
      backgroundColor: "#f0f0ff",
      borderBottom: "1px solid #e5e7eb",
      padding: "1rem",
    },
    cardHeaderContent: {
      display: "flex",
      alignItems: "center",
    },
    cardHeaderIconContainer: {
      backgroundColor: "#7b68ee",
      padding: "0.5rem",
      borderRadius: "0.5rem",
      marginRight: "0.75rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    cardHeaderIcon: {
      color: "white",
    },
    cardHeaderTitle: {
      fontSize: "1.125rem",
      fontWeight: "600",
      color: "#1f2937",
      margin: 0,
    },
    cardHeaderSubtitle: {
      fontSize: "0.875rem",
      color: "#6b7280",
      margin: 0,
    },
    cardBody: {
      padding: "1.5rem",
    },
    formGroup: {
      marginBottom: "1.25rem",
    },
    label: {
      display: "block",
      marginBottom: "0.375rem",
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "#374151",
    },
    inputContainer: {
      position: "relative",
    },
    inputIcon: {
      position: "absolute",
      left: "0.75rem",
      top: "0.75rem",
      color: "#9ca3af",
    },
    input: {
      width: "100%",
      height: "3rem",
      paddingLeft: "2.5rem",
      paddingRight: "0.75rem",
      fontSize: "0.875rem",
      borderRadius: "0.5rem",
      border: "1px solid #d1d5db",
      outline: "none",
      transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
      boxSizing: "border-box",
    },
    inputFocus: {
      borderColor: "#7b68ee",
      boxShadow: "0 0 0 3px rgba(123, 104, 238, 0.1)",
    },
    errorContainer: {
      backgroundColor: "#fef2f2",
      border: "1px solid #fee2e2",
      borderRadius: "0.375rem",
      padding: "0.75rem",
      marginBottom: "1.25rem",
    },
    errorText: {
      color: "#ef4444",
      fontSize: "0.875rem",
      margin: 0,
    },
    flexRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "1.25rem",
    },
    checkboxContainer: {
      display: "flex",
      alignItems: "center",
    },
    checkbox: {
      width: "1rem",
      height: "1rem",
      borderRadius: "0.25rem",
      marginRight: "0.5rem",
      accentColor: "#7b68ee",
    },
    checkboxLabel: {
      fontSize: "0.875rem",
      color: "#4b5563",
    },
    forgotPassword: {
      fontSize: "0.875rem",
      color: "#7b68ee",
      textDecoration: "none",
      fontWeight: "500",
    },
    button: {
      width: "100%",
      height: "3rem",
      backgroundColor: "#7b68ee",
      color: "white",
      border: "none",
      borderRadius: "0.5rem",
      fontSize: "0.875rem",
      fontWeight: "500",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.15s ease-in-out",
    },
    buttonHover: {
      backgroundColor: "#6a5acd",
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: "not-allowed",
    },
    spinnerContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    spinner: {
      marginRight: "0.5rem",
      animation: "spin 1s linear infinite",
    },
    signupContainer: {
      marginTop: "1.5rem",
      textAlign: "center",
    },
    signupText: {
      fontSize: "0.875rem",
      color: "#4b5563",
    },
    signupLink: {
      color: "#7b68ee",
      textDecoration: "none",
      fontWeight: "500",
    },
    footer: {
      marginTop: "2rem",
      textAlign: "center",
    },
    footerText: {
      fontSize: "0.75rem",
      color: "#6b7280",
    },
    "@keyframes spin": {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },
  }

  // CSS for animations
  const css = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .spinner {
      animation: spin 1s linear infinite;
    }
    .spinner-circle {
      opacity: 0.25;
    }
    .spinner-path {
      opacity: 0.75;
    }
    input:focus {
      border-color: #7b68ee;
      box-shadow: 0 0 0 3px rgba(123, 104, 238, 0.1);
    }
    button:hover:not(:disabled) {
      background-color: #6a5acd;
    }
  `

  return (
    <div style={styles.container}>
      <style>{css}</style>
      <div style={styles.wrapper}>
        <div style={styles.headerContainer}>
          <div style={styles.iconContainer}>
            <VideoIcon />
          </div>
          <div style={styles.headerText}>
            <h1 style={styles.title}>Communication Apps</h1>
            <p style={styles.subtitle}>Sign in to your account</p>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardHeaderContent}>
              <div style={styles.cardHeaderIconContainer}>
                <UserIcon />
              </div>
              <div>
                <h2 style={styles.cardHeaderTitle}>Login Information</h2>
                <p style={styles.cardHeaderSubtitle}>Enter your credentials to access your account</p>
              </div>
            </div>
          </div>

          <div style={styles.cardBody}>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.label}>
                  Email
                </label>
                <div style={styles.inputContainer}>
                  <div style={styles.inputIcon}>
                    <MailIcon />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="password" style={styles.label}>
                  Password
                </label>
                <div style={styles.inputContainer}>
                  <div style={styles.inputIcon}>
                    <LockIcon />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              {error && (
                <div style={styles.errorContainer}>
                  <p style={styles.errorText}>{error}</p>
                </div>
              )}

              <div style={styles.flexRow}>
                <div style={styles.checkboxContainer}>
                  <input id="remember-me" name="remember-me" type="checkbox" style={styles.checkbox} />
                  <label htmlFor="remember-me" style={styles.checkboxLabel}>
                    Remember me
                  </label>
                </div>
                <a href="#" style={styles.forgotPassword}>
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.button,
                  ...(loading ? styles.buttonDisabled : {}),
                }}
              >
                {loading ? (
                  <div style={styles.spinnerContainer}>
                    <SpinnerIcon />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>

              <div style={styles.signupContainer}>
                <p style={styles.signupText}>
                  Don't have an account?{" "}
                  <a href="#" style={styles.signupLink}>
                    Sign up now
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>© 2025 Communication Apps. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
