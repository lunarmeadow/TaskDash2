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
  readEmployee,
  updateEmployee,
} from "../lib/api-employee.js";

export default function EditProfile() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const jwt = auth.isAuthenticated();
  const currentUser = jwt?.user;

  const [values, setValues] = useState({
    name: "",
    email: "",
    location: "",
    role: "",
    password: "",
    error: "",
  });

  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    const currentJwt = auth.isAuthenticated();
    if (!currentJwt) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    readEmployee({ employeeId }, currentJwt, signal).then((data) => {
      if (data?.aborted) return;
      if (data?.error) {
        setValues((prev) => ({ ...prev, error: data.error }));
      } else {
        setValues((prev) => ({
          ...prev,
          name: data.name || "",
          email: data.email || "",
          location: data.location || "",
          role: data.role || "employee",
          error: "",
        }));
      }
    });

    return () => abortController.abort();
  }, [employeeId]); // ✅ only depends on id

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

    const updated = {
      name: values.name,
      email: values.email,
      location: values.location,
    };
    if (values.password) updated.password = values.password;
    if (isAdmin) updated.role = values.role;

    updateEmployee({ employeeId }, currentJwt, updated).then((data) => {
      if (data?.error) {
        setValues({ ...values, error: data.error });
      } else {
        // If editing yourself, update stored user in jwt
        if (currentUser && currentUser._id === data._id) {
          const existingJwt = auth.isAuthenticated();
          if (existingJwt) {
            const newJwt = { ...existingJwt, user: data };
            if (typeof window !== "undefined") {
              sessionStorage.setItem("jwt", JSON.stringify(newJwt));
            }
          }
        }
        navigate(`/employees/${employeeId}`);
      }
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card elevation={4}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Edit Profile
          </Typography>
          <TextField
            label="Name"
            margin="normal"
            fullWidth
            value={values.name}
            onChange={handleChange("name")}
          />
          <TextField
            label="Email"
            type="email"
            margin="normal"
            fullWidth
            value={values.email}
            onChange={handleChange("email")}
          />
          <TextField
            label="Location"
            margin="normal"
            fullWidth
            value={values.location}
            onChange={handleChange("location")}
          />
          {isAdmin && (
            <TextField
              select
              label="Role"
              margin="normal"
              fullWidth
              value={values.role}
              onChange={handleChange("role")}
            >
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          )}
          <TextField
            label="New Password"
            type="password"
            margin="normal"
            fullWidth
            value={values.password}
            onChange={handleChange("password")}
            helperText="Leave blank to keep current password"
          />
          {values.error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: "center", mb: 2 }}>
          <Button variant="contained" onClick={clickSubmit}>
            Save
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}