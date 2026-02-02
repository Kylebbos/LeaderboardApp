import { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Stack,
  Typography,
  FormControlLabel,
  Checkbox,
  Link,
} from "@mui/material";

// Interface for score submission form
interface ScoreData {
  name: string;
  email: string;
  points: number;
  marketingConsent: boolean;
}

// ScoreForm allows users to submit their reflex game score
export default function ScoreForm() {
  const [form, setForm] = useState<ScoreData>({
    name: "",
    email: "",
    points: 0,
    marketingConsent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "points" ? Number(value) : value,
    }));
  };

  // Handler for the marketing consent checkbox
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, marketingConsent: e.target.checked }));
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, points } = form;
    if (!name || !email || !points) return;

    try {
      // Send form data to the PHP backend API
      const res = await fetch("../api/scores.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");

      alert("Score submitted!");

       // Reset form after successful submission
      setForm({ name: "", email: "", points: 0, marketingConsent: false });
    } catch (err) {
      console.error(err);
      alert("Error submitting score.");
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Submit a Score
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Points"
            name="points"
            type="number"
            value={form.points || ""}
            onChange={handleChange}
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={form.marketingConsent}
                onChange={handleCheckbox}
              />
            }
            label="I agree to receive news and updates (optional)"
          />
          <Typography variant="body2">
            By submitting, you agree to our{" "}
            <Link
              href="https://www.zone.fi/static/2023/06/Zone-FI-2023-06-Privacy-Policy-ENG.pdf"
              target="_blank"
            >
              Privacy Policy
            </Link>
            .
          </Typography>
          <Button type="submit" variant="contained">
            Submit Score
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
