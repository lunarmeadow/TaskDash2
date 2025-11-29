
import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  CardActions,
  TextField,
  Typography,
  Button,
  MenuItem,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import auth from "../lib/auth-helper.js";
import {
  createTask,
  readTask,
  updateTask,
} from "../lib/api-task.js";
import { listEmployees } from "../lib/api-employee.js";

const statusOptions = [
  "pending",
  "in-progress",
  "completed",
  "cancelled",
];

export default function TaskForm({ editMode = false }) {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const jwt = auth.isAuthenticated();
  const user = jwt?.user;

  const [values, setValues] = useState({
    taskId: "",
    name: "",
    description: "",
    location: "",
    scheduledAt: "",
    status: "pending",
    assignedTo: "",
    error: "",
  });
  const [employees, setEmployees] = useState([]);

  const isManagerOrAdmin =
    user && (user.role === "admin" || user.role === "manager");

  // Load task for edit
useEffect(() => {
  if (!editMode || !taskId) return;

  const currentJwt = auth.isAuthenticated();
  if (!currentJwt) return;

  const abortController = new AbortController();
  const signal = abortController.signal;

  readTask({ taskId }, currentJwt, signal).then((data) => {
    if (data?.aborted) return;
    if (data?.error) {
      setValues((prev) => ({ ...prev, error: data.error }));
    } else {
      setValues({
        taskId: data.taskId || "",
        name: data.name || "",
        description: data.description || "",
        location: data.location || "",
        scheduledAt: data.scheduledAt
          ? new Date(data.scheduledAt).toISOString().slice(0, 16)
          : "",
        status: data.status || "pending",
        assignedTo: data.assignedTo?._id || "",
        error: "",
      });
    }
  });

  return () => abortController.abort();
}, [editMode, taskId]);


  // Load employees for assignment (admin/manager only)
  useEffect(() => {
    if (!isManagerOrAdmin) return;

    const currentJwt = auth.isAuthenticated();
    if (!currentJwt) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    listEmployees(currentJwt, signal).then((data) => {
      if (data?.aborted) return;
      if (Array.isArray(data)) {
        setEmployees(data);
      } else if (data?.error) {
        console.error("listEmployees error:", data.error);
      }
    });

    return () => abortController.abort();
  }, [isManagerOrAdmin]); 

  const handleChange = (field) => (event) => {
    setValues({ ...values, [field]: event.target.value });
  };

  const clickSubmit = () => {
    const currentJwt = auth.isAuthenticated();
    if (!currentJwt) {
      setValues((prev) => ({
        ...prev,
        error: "You must be signed in.",
      }));
      return;
    }

    const payload = {
      taskId: values.taskId,
      name: values.name,
      description: values.description,
      location: values.location,
      scheduledAt: values.scheduledAt
        ? new Date(values.scheduledAt)
        : undefined,
      status: values.status,
      assignedTo: values.assignedTo || undefined,
    };

    const action = editMode
      ? updateTask({ taskId }, currentJwt, payload)
      : createTask(payload, currentJwt);

    action.then((data) => {
      if (data?.error) {
        setValues((prev) => ({ ...prev, error: data.error }));
      } else {
        navigate("/tasks");
      }
    });
  };

  if (!isManagerOrAdmin && !editMode) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">
          Only managers and admins can create tasks.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card elevation={4}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            {editMode ? "Edit Task" : "Create Task"}
          </Typography>
          <TextField
            label="Task ID"
            margin="normal"
            fullWidth
            value={values.taskId}
            onChange={handleChange("taskId")}
            disabled={editMode}
          />
          <TextField
            label="Name"
            margin="normal"
            fullWidth
            value={values.name}
            onChange={handleChange("name")}
          />
          <TextField
            label="Description"
            margin="normal"
            fullWidth
            multiline
            minRows={2}
            value={values.description}
            onChange={handleChange("description")}
          />
          <TextField
            label="Location"
            margin="normal"
            fullWidth
            value={values.location}
            onChange={handleChange("location")}
          />
          <TextField
            label="Scheduled At"
            type="datetime-local"
            margin="normal"
            fullWidth
            value={values.scheduledAt}
            onChange={handleChange("scheduledAt")}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            label="Status"
            margin="normal"
            fullWidth
            value={values.status}
            onChange={handleChange("status")}
          >
            {statusOptions.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>

          {isManagerOrAdmin && (
            <TextField
              select
              label="Assigned To"
              margin="normal"
              fullWidth
              value={values.assignedTo}
              onChange={handleChange("assignedTo")}
            >
              <MenuItem value="">
                <em>Unassigned</em>
              </MenuItem>
              {employees.map((emp) => (
                <MenuItem key={emp._id} value={emp._id}>
                  {emp.name} ({emp.employeeId})
                </MenuItem>
              ))}
            </TextField>
          )}

          {values.error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: "center", mb: 2 }}>
          <Button variant="contained" onClick={clickSubmit}>
            {editMode ? "Save" : "Create"}
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}
