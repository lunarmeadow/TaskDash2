import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import auth from "../lib/auth-helper.js";
import { Link, useNavigate, useLocation } from "react-router-dom";

const isActive = (location, path) =>
  location.pathname === path ||
  (path !== "/" && location.pathname.startsWith(path));

const navButtonSx = (location, path) => ({
  color: isActive(location, path) ? "#ffeb3b" : "#ffffff",
  fontWeight: isActive(location, path) ? 700 : 500,
  px: 1.5,
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.12)",
  },
});

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const jwt = auth.isAuthenticated();
  const user = jwt && jwt.user;

  return (
    <AppBar
      position="static"
      elevation={3}
      sx={{
        background: "linear-gradient(90deg,#1565c0,#1976d2)",
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Logo + Name */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexGrow: 1,
          }}
        >
          <Box
            component="img"
            src="/taskdash-logo.png"
            alt="TaskDash Logo"
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "2px solid #fff",
              objectFit: "cover",
              boxShadow: 2,
            }}
            onError={(e) => {
              // fallback: simple circle if image missing
              e.target.style.display = "none";
            }}
          />
          <Typography variant="h6" component="div">
            TaskDash
          </Typography>
        </Box>

        {/* Home */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <IconButton
            sx={{
              color: isActive(location, "/") ? "#ffeb3b" : "#ffffff",
            }}
          >
            <HomeIcon />
          </IconButton>
        </Link>

        {/* Tasks */}
        {jwt && (
          <Link to="/tasks" style={{ textDecoration: "none" }}>
            <Button sx={navButtonSx(location, "/tasks")}>Tasks</Button>
          </Link>
        )}

        {/* Employees list only for admin/manager */}
        {jwt && (user.role === "admin" || user.role === "manager") && (
          <Link to="/employees" style={{ textDecoration: "none" }}>
            <Button sx={navButtonSx(location, "/employees")}>
              Employees
            </Button>
          </Link>
        )}

        {/* When NOT signed in: Sign Up / Sign In */}
        {!jwt && (
          <>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <Button sx={navButtonSx(location, "/signup")}>Sign Up</Button>
            </Link>
            <Link to="/signin" style={{ textDecoration: "none" }}>
              <Button sx={navButtonSx(location, "/signin")}>Sign In</Button>
            </Link>
          </>
        )}

        {/* When signed in: My Profile / Sign out */}
        {jwt && (
          <>
            <Link
              to={`/employees/${user._id}`}
              style={{ textDecoration: "none" }}
            >
              <Button
                sx={navButtonSx(
                  location,
                  `/employees/${user._id}`
                )}
              >
                My Profile
              </Button>
            </Link>
            <Button
              sx={{ color: "#ffffff", ml: 1 }}
              onClick={() => {
                auth.clearJWT(() => navigate("/"));
              }}
            >
              Sign out
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
