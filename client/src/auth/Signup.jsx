import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  CardActions,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import { signup } from "../lib/api-auth.js";

export default function Signup() {
  const [values, setValues] = useState({
    employeeId: "",
    name: "",
    email: "",
    password: "",
    role: "employee",
    location: "",
    error: "",
    open: false,
  });

  const handleChange = (field) => (event) => {
    setValues({ ...values, [field]: event.target.value });
  };

  const clickSubmit = () => {
    const user = {
      employeeId: values.employeeId || undefined,
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
      role: values.role || undefined,
      location: values.location || undefined,
    };

    signup(user).then((data) => {
      if (data?.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          employeeId: "",
          name: "",
          email: "",
          password: "",
          role: "employee",
          location: "",
          error: "",
          open: true,
        });
      }
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card elevation={6} sx={{ borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            Create a TaskDash Account
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 2 }}
          >
            Add your details to create an employee profile.
          </Typography>

          <TextField
            label="Employee ID"
            margin="normal"
            fullWidth
            value={values.employeeId}
            onChange={handleChange("employeeId")}
          />
          <TextField
            label="Name"
            margin="normal"
            fullWidth
            value={values.name}
            onChange={handleChange("name")}
          />
          <TextField
            label="Email"
            margin="normal"
            fullWidth
            type="email"
            value={values.email}
            onChange={handleChange("email")}
          />
          <TextField
            label="Password"
            margin="normal"
            fullWidth
            type="password"
            value={values.password}
            onChange={handleChange("password")}
          />
          <TextField
            label="Location"
            margin="normal"
            fullWidth
            value={values.location}
            onChange={handleChange("location")}
          />

          <TextField
            select
            label="Role"
            margin="normal"
            fullWidth
            value={values.role}
            onChange={handleChange("role")}
            helperText="For testing you may create admin/manager/employee"
          >
            <MenuItem value="employee">Employee</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>

          {values.error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: "center", mb: 2 }}>
          <Button variant="contained" onClick={clickSubmit}>
            Sign Up
          </Button>
        </CardActions>
      </Card>

      <Dialog open={values.open} onClose={() => setValues({ ...values, open: false })}>
        <DialogTitle>Account created</DialogTitle>
        <DialogContent>
          <Typography>Your TaskDash account has been created. You can now sign in.</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            component={Link}
            to="/signin"
            onClick={() => setValues({ ...values, open: false })}
          >
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}