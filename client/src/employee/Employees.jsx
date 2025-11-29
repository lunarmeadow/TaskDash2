import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import auth from "../lib/auth-helper.js";
import { listEmployees } from "../lib/api-employee.js";

export default function Employees() {
  const jwt = auth.isAuthenticated();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const currentJwt = auth.isAuthenticated();
    if (!currentJwt) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    listEmployees(currentJwt, signal).then((data) => {
      if (data?.aborted) return;
      if (data?.error) {
        setError(data.error);
      } else {
        setEmployees(data);
      }
    });

    return () => abortController.abort();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={4} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Employees
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {!error && employees.length === 0 && (
          <Typography color="text.secondary">
            No employees found.
          </Typography>
        )}
        <List>
          {employees.map((emp) => (
            <ListItem
              key={emp._id}
              component={Link}
              to={`/employees/${emp._id}`}
              sx={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemAvatar>
                <Avatar>{emp.name?.[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${emp.name} (${emp.employeeId})`}
                secondary={emp.email}
              />
              <Chip
                label={emp.role}
                size="small"
                color={
                  emp.role === "admin"
                    ? "error"
                    : emp.role === "manager"
                      ? "primary"
                      : "default"
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}