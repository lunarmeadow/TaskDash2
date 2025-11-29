
import React from "react";
import { Routes, Route } from "react-router-dom";

import Menu from "./core/Menu.jsx";
import Home from "./core/Home.jsx";

import Signin from "./auth/Signin.jsx";
import Signup from "./auth/Signup.jsx";

import Employees from "./employee/Employees.jsx";
import Profile from "./employee/Profile.jsx";
import EditProfile from "./employee/EditProfile.jsx";

import Tasks from "./task/Tasks.jsx";
import TaskForm from "./task/TaskForm.jsx";

import PrivateRoute from "./lib/PrivateRoute.jsx";

export default function MainRouter() {
  return (
    <div>
      <Menu />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        {/* Employees (User object) CRUD */}
        <Route
          path="/employees"
          element={
            <PrivateRoute>
              <Employees />
            </PrivateRoute>
          }
        />
        <Route
          path="/employees/:employeeId"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/employees/edit/:employeeId"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />

        {/* Tasks CRUD */}
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Tasks />
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks/new"
          element={
            <PrivateRoute>
              <TaskForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks/:taskId/edit"
          element={
            <PrivateRoute>
              <TaskForm editMode />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}