import { useEffect, useState } from "react";
import {
  fetchIdeas,
  createIdea,
  updateStatus,
  updateIdea,
  deleteIdea,
} from "./services/api";
import { logout } from "./services/cognito";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import LandingPage from "./components/LandingPage";
import NewsroomDashboard from "./components/NewsroomDashboard";

function App() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authPage, setAuthPage] = useState("landing");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    logout();
    setIsAuthenticated(false);
    setCheckingAuth(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    loadIdeas();
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setIdeas([]);
    setAuthPage("landing");
  };

  const loadIdeas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchIdeas();
      const sorted = (data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setIdeas(sorted);
    } catch (err) {
      setError("Failed to load ideas. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (idea) => {
    try {
      const newIdea = await createIdea(idea);
      setIdeas((prev) =>
        [newIdea, ...prev].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } catch (err) {
      alert("Failed to create idea.");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const updated = await updateStatus(id, status);
      setIdeas((prev) =>
        prev.map((idea) => (idea.id === id ? updated : idea))
      );
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleUpdate = async (id, fields) => {
    try {
      const updated = await updateIdea(id, fields);
      setIdeas((prev) => prev.map((idea) => (idea.id === id ? updated : idea)));
    } catch (err) {
      alert("Failed to update idea.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteIdea(id);
      setIdeas((prev) => prev.filter((idea) => idea.id !== id));
    } catch (err) {
      alert("Failed to delete idea.");
    }
  };

  if (checkingAuth) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "var(--cream)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
          Loading...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authPage === "signup") {
      return (
        <SignUpPage
          onGoToLogin={() => setAuthPage("login")}
          onGoToLanding={() => setAuthPage("landing")}
        />
      );
    }
    if (authPage === "login") {
      return (
        <LoginPage
          onLogin={handleLogin}
          onGoToSignUp={() => setAuthPage("signup")}
          onGoToLanding={() => setAuthPage("landing")}
        />
      );
    }
    return (
      <LandingPage
        onGetStarted={() => setAuthPage("signup")}
        onSignIn={() => setAuthPage("login")}
      />
    );
  }

  return (
    <>
      <NewsroomDashboard
        ideas={ideas}
        onStatusChange={handleStatusChange}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onCreate={handleCreate}
        onLogout={handleLogout}
        loading={loading}
        error={error}
      />
    </>
  );
}

export default App;
