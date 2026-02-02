import { useEffect, useState } from "react";
import {
  Container, Typography, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField, Button, Box
} from "@mui/material";
import { Delete, Edit, Save, Cancel } from "@mui/icons-material";

// Interface for a score object
interface Score {
  id: number;
  name: string;
  email: string;
  points: number;
}

// AdminScores component allows admin to view, edit, and delete scores
export default function AdminScores() {
  const [scores, setScores] = useState<Score[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ name: string; email: string; points: number }>({
    name: "",
    email: "",
    points: 0,
  });

  // State to track if admin is logged in
  const [loggedIn, setLoggedIn] = useState(true);

  // Function to fetch scores from the backend API
  const fetchScores = async () => {
    try {
      const res = await fetch("../api/get_scores.php");
      const data: Score[] = await res.json();
      setScores(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch scores once when the component mounts
  useEffect(() => { fetchScores(); }, []);

  // Function to delete a score by ID
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;
    const res = await fetch(`../api/admin_scores.php?id=${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) setScores(scores.filter(s => s.id !== id));
  };

  // Start editing a score
  const startEditing = (score: Score) => {
    setEditingId(score.id);
    setEditValues({ name: score.name, email: score.email, points: score.points });
  };

  // Cancel editing
  const cancelEditing = () => setEditingId(null);

  // Save edited score to backend
  const saveEdit = async (id: number) => {
    const res = await fetch(`../api/admin_scores.php?id=${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editValues),
      credentials: "include",
    });
    if (res.ok) {
      setScores(scores.map(s => s.id === id ? { ...s, ...editValues } : s));
      setEditingId(null);
    }
  };

  // Logout admin
  const handleLogout = async () => {
    await fetch("../api/logout.php", { credentials: "include" });
    setLoggedIn(false);
    alert("Logged out");
    window.location.href = "/reflexgame";
  };

  // Show a message while logging out
  if (!loggedIn) return <Typography>Logging out...</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Manage Scores</Typography>
        <Button variant="contained" color="warning" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scores.map(score => (
              <TableRow key={score.id}>
                <TableCell>
                  {editingId === score.id ? (
                    <TextField
                      value={editValues.name}
                      onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                      size="small"
                    />
                  ) : score.name}
                </TableCell>
                <TableCell>
                  {editingId === score.id ? (
                    <TextField
                      type="number"
                      value={editValues.points}
                      onChange={(e) => setEditValues({ ...editValues, points: Number(e.target.value) })}
                      size="small"
                    />
                  ) : score.points}
                </TableCell>
                <TableCell>
                  {editingId === score.id ? (
                    <>
                      <IconButton onClick={() => saveEdit(score.id)}><Save /></IconButton>
                      <IconButton onClick={cancelEditing}><Cancel /></IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton onClick={() => startEditing(score)}><Edit /></IconButton>
                      <IconButton onClick={() => handleDelete(score.id)}><Delete /></IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
