import { useEffect, useState } from "react";
import { Container, Typography, Paper, List, ListItem, ListItemText, Box } from "@mui/material";

// Interface for a score object
interface Score {
  id: number;
  name: string;
  points: number;
}

// Leaderboard displays all scores and updates automatically
export default function Leaderboard() {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
  const fetchScores = async () => {
    try {
      const res = await fetch("../api/get_scores.php");
      const data: Score[] = await res.json();
      setScores(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchScores();

  // Set up an interval to fetch scores every 5 seconds
  const interval = setInterval(fetchScores, 5000);

  return () => clearInterval(interval);
}, []);

  return (
    <Container maxWidth="sm" sx={{ py: 6, textAlign: "center" }}>
      <Box
        component="img"
        src={`${import.meta.env.BASE_URL}speedzonelogo.svg`}
        alt="Logo"
        sx={{ width: 240, mb: 3 }}
      />
      <Typography variant="h4" gutterBottom>
        Leaderboard
      </Typography>

      <Paper sx={{ p: 2 }}>
        <List>
          {scores.map((score, index) => (
            <ListItem key={score.id} divider>
              <ListItemText
                primary={`${index + 1}. ${score.name}`}
                secondary={`${score.points} points`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}
