import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  CardActions,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { signin } from "../lib/api-auth.js";
import auth from "../lib/auth-helper.js";

export default function Signin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
  });

  const handleChange = (field) => (event) => {
    setValues({ ...values, [field]: event.target.value });
  };

  const clickSubmit = () => {
    const user = {
      email: values.email || undefined,
      password: values.password || undefined,
    };
    signin(user).then((data) => {
      if (data?.error) {
        setValues({ ...values, error: data.error });
      } else {
        // data = { token, user: { _id, employeeId, name, email, role } }
        auth.authenticate(data, () => {
          navigate(from, { replace: true });
        });
      }
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card elevation={6} sx={{ borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            Sign in to TaskDash
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 2 }}
          >
            Enter your credentials to access your dashboard.
          </Typography>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={values.email}
            onChange={handleChange("email")}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={values.password}
            onChange={handleChange("password")}
          />
          {values.error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {values.error}
            </Typography>
          )}
          <Typography variant="body2" sx={{ mt: 2 }}>
            Don&apos;t have an account?{" "}
            <Link to="/signup">Sign up</Link>
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "center", mb: 2 }}>
          <Button variant="contained" onClick={clickSubmit}>
            Sign In
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}