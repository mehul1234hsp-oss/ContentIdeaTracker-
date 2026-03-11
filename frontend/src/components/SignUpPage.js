import { useState } from "react";
import { signUp, confirmSignUp } from "../services/cognito";
import ScrollingBackground from "./ScrollingBackground";

export default function SignUpPage({ onGoToLogin, onGoToLanding }) {
  const [step, setStep] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try { await signUp(email, password); setStep("confirm"); }
    catch (err) { setError(err.message || "Sign up failed. Please try again."); }
    finally { setLoading(false); }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try { await confirmSignUp(email, code); onGoToLogin(); }
    catch (err) { setError(err.message || "Confirmation failed. Please try again."); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px", borderRadius: 12,
    border: "1.5px solid #ede8e3", fontSize: ".95rem",
    color: "#1a1a2e", outline: "none", boxSizing: "border-box",
    fontFamily: "DM Sans, sans-serif", background: "#fdf6f0",
  };

  const labelStyle = {
    display: "block", fontSize: ".85rem", fontWeight: 700,
    color: "#1a1a2e", marginBottom: 7,
  };

  return (
    <div style={{ height: "100vh", width: "100%", overflow: "hidden", position: "relative", fontFamily: "Nunito, sans-serif" }}>

      {/* Shared scrolling background */}
      <ScrollingBackground />

      {/* Floating Back to Home button */}
      <button
        type="button"
        onClick={onGoToLanding}
        style={{
          position: "absolute", top: 18, left: 20, zIndex: 20,
          background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.28)",
          borderRadius: 8, padding: "7px 16px",
          fontSize: ".85rem", fontWeight: 700, color: "#fff",
          cursor: "pointer", fontFamily: "Nunito, sans-serif",
          backdropFilter: "blur(8px)",
        }}
      >
        ← Back to Home
      </button>

      {/* Centered form card */}
      <div style={{ position: "relative", zIndex: 10, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{
          background: "rgba(255,255,255,0.97)", borderRadius: 24,
          padding: "44px 50px", width: "100%", maxWidth: 440,
          boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)",
        }}>

          {/* Heading */}
          <h2 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#1a1a2e", marginBottom: 28, fontFamily: "Nunito, sans-serif", letterSpacing: "-0.5px", textAlign: "center" }}>
            {step === "signup"
              ? <>Get <span style={{ color: "#E8334A" }}>Started</span></>
              : <>Verify <span style={{ color: "#E8334A" }}>Email</span></>
            }
          </h2>

          {step === "signup" ? (
            <form onSubmit={handleSignUp}>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={inputStyle} />
              </div>
              <div style={{ marginBottom: 26 }}>
                <label style={labelStyle}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 chars, uppercase, number, symbol" required style={inputStyle} />
              </div>
              {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "11px 15px", marginBottom: 16, color: "#dc2626", fontSize: ".88rem" }}>{error}</div>}
              <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", background: loading ? "#f9a3ae" : "#E8334A", color: "#fff", border: "none", borderRadius: 12, fontSize: ".95rem", fontWeight: 800, fontFamily: "Nunito, sans-serif", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 8px 28px rgba(232,51,74,0.45)", transition: "all 0.2s" }}>
                {loading ? "Creating account..." : "Create Account →"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleConfirm}>
              <p style={{ fontSize: ".85rem", color: "#6b6b80", marginBottom: 20, textAlign: "center" }}>
                We sent a code to <strong>{email}</strong>
              </p>
              <div style={{ marginBottom: 26 }}>
                <label style={labelStyle}>Verification Code</label>
                <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="Enter 6-digit code" required style={{ ...inputStyle, letterSpacing: 4, textAlign: "center", fontSize: "1.2rem" }} />
              </div>
              {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "11px 15px", marginBottom: 16, color: "#dc2626", fontSize: ".88rem" }}>{error}</div>}
              <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", background: loading ? "#f9a3ae" : "#E8334A", color: "#fff", border: "none", borderRadius: 12, fontSize: ".95rem", fontWeight: 800, fontFamily: "Nunito, sans-serif", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 8px 28px rgba(232,51,74,0.45)", transition: "all 0.2s" }}>
                {loading ? "Verifying..." : "Verify Email →"}
              </button>
            </form>
          )}

          <p style={{ textAlign: "center", marginTop: 22, color: "#6b6b80", fontSize: ".88rem" }}>
            Already have an account?{" "}
            <span onClick={onGoToLogin} style={{ color: "#E8334A", fontWeight: 700, cursor: "pointer" }}>Sign In</span>
          </p>
        </div>
      </div>
    </div>
  );
}