const API_BASE = "/api/employees";

const listEmployees = async (credentials, signal) => {
  try {
    const response = await fetch(API_BASE, {
      method: "GET",
      signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.t}`,
      },
    });
    return await response.json();
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("listEmployees aborted");
      return { aborted: true };
    }
    console.error("listEmployees error:", err);
    return { error: "Network error" };
  }
};

const readEmployee = async (params, credentials, signal) => {
  try {
    const response = await fetch(`${API_BASE}/${params.employeeId}`, {
      method: "GET",
      signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.t}`,
      },
    });
    return await response.json();
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("readEmployee aborted");
      return { aborted: true };
    }
    console.error("readEmployee error:", err);
    return { error: "Network error" };
  }
};

const updateEmployee = async (params, credentials, employee) => {
  try {
    const response = await fetch(`${API_BASE}/${params.employeeId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.t}`,
      },
      body: JSON.stringify(employee),
    });
    return await response.json();
  } catch (err) {
    console.error("updateEmployee error:", err);
    return { error: "Network error" };
  }
};

const removeEmployee = async (params, credentials) => {
  try {
    const response = await fetch(`${API_BASE}/${params.employeeId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.t}`,
      },
    });
    return await response.json();
  } catch (err) {
    console.error("removeEmployee error:", err);
    return { error: "Network error" };
  }
};

export {
  listEmployees,
  readEmployee,
  updateEmployee,
  removeEmployee,
};