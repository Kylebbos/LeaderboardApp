import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ScoreForm from "./ScoreForm";
import Leaderboard from "./Leaderboard";
import AdminScores from "./AdminScores";
import AdminLogin from "./AdminLogin";
import { Container, Typography, Button, Stack } from "@mui/material";

// Home page component
function Home() {
  return (
    <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8 }}>
      <Typography variant="h3" gutterBottom>Reflex Game</Typography>
      <Stack direction="row" spacing={2}>
        <Button href="/reflexgame/submit" variant="contained">Submit Score</Button>
        <Button href="/reflexgame/leaderboard" variant="contained" color="success">View Leaderboard</Button>
        <Button href="/reflexgame/login" variant="contained" color="secondary">Admin</Button>
      </Stack>
    </Container>
  );
}

// ProtectedRoute component ensures that only authenticated admins can access certain pages
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if admin is logged in by calling backend API
    fetch("../api/check_admin.php", { credentials: "include" })
      .then(res => res.json())
      .then(data => setIsAuth(data.loggedIn))
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) return <p>Loading...</p>;
  return <>{isAuth ? children : <Navigate to="/reflexgame/login" replace />}</>;
}

// Main App component with routing
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/reflexgame" element={<Home />} />
        <Route path="/reflexgame/submit" element={<ScoreForm />} />
        <Route path="/reflexgame/leaderboard" element={<Leaderboard />} />
        <Route path="/reflexgame/login" element={<AdminLogin />} />
        <Route
          path="/reflexgame/management"
          element={
            <ProtectedRoute>
              <AdminScores />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
