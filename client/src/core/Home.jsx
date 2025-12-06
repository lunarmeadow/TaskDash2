import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import auth from "../lib/auth-helper.js";
import { listTasks } from "../lib/api-task.js";

export default function Home() {
  const jwt = auth.isAuthenticated();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const currentJwt = auth.isAuthenticated();
    if (!currentJwt) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    listTasks(currentJwt, signal).then((data) => {
      if (data?.aborted) return;

      if (data?.error) {
        setError(data.error);
        setTasks([]);
      } else if (Array.isArray(data)) {
        setError("");
        setTasks(data.slice(0, 5));
      }
    });

    return () => abortController.abort();
  }, []);

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Hero Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="overline" color="primary">
                Warehouse Task Management
              </Typography>
            </Box>
            <Typography variant="h3" gutterBottom>
              Welcome to TaskDash!
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Smart task scheduling and employee management to keep your
              operation running smoothly.
            </Typography>

            <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
              {!jwt && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/signup"
                  >
                    Get Started
                  </Button>
                  <Button variant="outlined" component={Link} to="/signin">
                    I already have an account
                  </Button>
                </>
              )}

              {jwt && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/tasks"
                  >
                    View All Tasks
                  </Button>
                  {(jwt.user.role === "admin" ||
                    jwt.user.role === "manager") && (
                      <Button
                        variant="outlined"
                        component={Link}
                        to="/tasks/new"
                      >
                        Create Task
                      </Button>
                    )}
                </>
              )}
            </Box>
          </Grid>

          {/* Summary card */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                borderRadius: 4,
                minHeight: 260,
                background:
                  "radial-gradient(circle at top left,#e3f2fd,#ffffff)",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Upcoming Tasks
              </Typography>

              {!jwt && (
                <Typography color="text.secondary">
                  Sign in to see tasks assigned to you or your team.
                </Typography>
              )}

              {jwt && error && (
                <Typography color="error">{error}</Typography>
              )}

              {jwt && !error && tasks.length === 0 && (
                <Typography color="text.secondary">
                  No tasks yet. Create one to get started.
                </Typography>
              )}

              {jwt &&
                tasks.map((task) => (
                  <Box
                    key={task._id}
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 3,
                      bgcolor: "rgba(255,255,255,0.9)",
                      boxShadow: 1,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      {task.taskId} – {task.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {task.location} ·{" "}
                      {new Date(task.scheduledAt).toLocaleString()}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        size="small"
                        label={task.status}
                        color={
                          task.status === "completed"
                            ? "success"
                            : task.status === "in-progress"
                              ? "primary"
                              : task.status === "cancelled"
                                ? "error"
                                : "default"
                        }
                      />
                    </Box>
                  </Box>
                ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
