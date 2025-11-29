
import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Box,
  Button,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import auth from "../lib/auth-helper.js";
import { listTasks, removeTask } from "../lib/api-task.js";

export default function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  const jwt = auth.isAuthenticated();
  const user = jwt?.user;

  useEffect(() => {
    const currentJwt = auth.isAuthenticated();
    if (!currentJwt) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    listTasks(currentJwt, signal).then((data) => {
      if (data?.aborted) {
        // ignore the aborted dev-mode request
        return;
      }
      if (data?.error) {
        setError(data.error);
        setTasks([]);
      } else if (Array.isArray(data)) {
        setError("");          
        setTasks(data);
      }
    });

    return () => abortController.abort();
  }, []); 

  const canDelete = (task) =>
    user &&
    (user.role === "admin" || user.role === "manager");

  const canEdit = (task) => {
    if (!user) return false;
    if (user.role === "admin" || user.role === "manager") return true;
    return task.assignedTo && task.assignedTo._id === user._id;
  };

  const handleDelete = (taskId) => {
    removeTask({ taskId }, jwt).then((data) => {
      if (data?.error) {
        setError(data.error);
      } else {
        setError(""); // clear delete errors on success
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
      }
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={4} sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h5">Tasks</Typography>
          {(user?.role === "admin" || user?.role === "manager") && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/tasks/new")}
            >
              New Task
            </Button>
          )}
        </Box>

        {error && <Typography color="error">{error}</Typography>}
        {!error && tasks.length === 0 && (
          <Typography color="text.secondary">
            No tasks found.
          </Typography>
        )}

        {tasks.length > 0 && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Task ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Scheduled</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell>{task.taskId}</TableCell>
                  <TableCell>{task.name}</TableCell>
                  <TableCell>{task.location}</TableCell>
                  <TableCell>
                    {new Date(task.scheduledAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip label={task.status} size="small" />
                  </TableCell>
                  <TableCell>
                    {task.assignedTo
                      ? `${task.assignedTo.name} (${task.assignedTo.employeeId})`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {task.createdBy
                      ? `${task.createdBy.name} (${task.createdBy.role})`
                      : "—"}
                  </TableCell>
                  <TableCell align="right">
                    {canEdit(task) && (
                      <IconButton
                        onClick={() =>
                          navigate(`/tasks/${task._id}/edit`)
                        }
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    {canDelete(task) && (
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(task._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
}
