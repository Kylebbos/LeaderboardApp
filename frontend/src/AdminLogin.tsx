import { useState } from "react";
import { TextField, Button, Paper, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

// AdminLogin component handles the login form for administrators
export default function AdminLogin() {
  // State variables to store form input and error messages
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");  

  // useNavigate hook from react-router-dom to redirect on successful login
  const navigate = useNavigate();

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError("");     

    try {
      // Send a POST request to the PHP login API
      const res = await fetch("../api/admin_login.php", {
        method: "POST",                    
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      // Parse the JSON response from the server
      const data = await res.json();

      // Check if login was successful
      if (res.ok && data.success) {
        navigate("/reflexgame/management");
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      // Catch network or server errors
      setError("Server error");
    }
  };

  return (
    // Paper component from MUI for a card-like form container
    <Paper sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Admin Login
      </Typography>

      {/* Login form */}
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}> {/* Stack for vertical spacing between inputs */}
          
          {/* Username input */}
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* Password input */}
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Display error message if any */}
          {error && <Typography color="error">{error}</Typography>}

          {/* Submit button */}
          <Button type="submit" variant="contained">
            Log In
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
