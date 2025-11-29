import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
} from "@mui/material";
import { useParams, useNavigate, Link } from "react-router-dom";
import auth from "../lib/auth-helper.js";
import {
  readEmployee,
  removeEmployee,
} from "../lib/api-employee.js";

export default function Profile() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const jwt = auth.isAuthenticated();
  const currentUser = jwt?.user;

  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");

  const isOwner = currentUser && currentUser._id === employeeId;
  const isAdmin = currentUser && currentUser.role === "admin";

  useEffect(() => {
    const currentJwt = auth.isAuthenticated();
    if (!currentJwt) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    readEmployee({ employeeId }, currentJwt, signal).then((data) => {
      if (data?.aborted) return;
      if (data?.error) {
        setError(data.error);
      } else {
        setEmployee(data);
      }
    });

    return () => abortController.abort();
  }, [employeeId]);
  
  const deleteAccount = () => {
    const currentJwt = auth.isAuthenticated();
    if (!currentJwt) return;

    removeEmployee({ employeeId }, currentJwt).then((data) => {
      if (data?.error) {
        setError(data.error);
      } else {
        if (isOwner) {
          auth.clearJWT(() => navigate("/"));
        } else {
          navigate("/employees");
        }
      }
    });
  };

  if (!employee && !error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={4} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {employee.name}
        </Typography>
        <Typography>Employee ID: {employee.employeeId}</Typography>
        <Typography>Email: {employee.email}</Typography>
        <Typography>
          Location: {employee.location || "N/A"}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Chip label={employee.role} size="small" />
        </Box>

        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          {(isOwner || isAdmin) && (
            <Button
              variant="outlined"
              component={Link}
              to={`/employees/edit/${employee._id}`}
            >
              Edit Profile
            </Button>
          )}
          {isAdmin && (
            <Button
              variant="contained"
              color="error"
              onClick={deleteAccount}
            >
              Delete
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}