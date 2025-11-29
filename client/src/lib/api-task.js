
const API_BASE = "/api/tasks";

const listTasks = async (credentials, signal) => {
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
      console.log("Fetch /api/tasks aborted");
      return { aborted: true };
    }
    console.error("Fetch /api/tasks failed:", err);
    return { error: "Network error" };
  }
};


const readTask = async (params, credentials, signal) => {
  try {
    const response = await fetch(`${API_BASE}/${params.taskId}`, {
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
      console.log("readTask aborted");
      return { aborted: true };
    }
    console.error("readTask error:", err);
    return { error: "Network error" };
  }
};

// POST /api/tasks
const createTask = async (task, credentials) => {
  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.t}`,
      },
      body: JSON.stringify(task),
    });
    return await response.json();
  } catch (err) {
    console.error(err);
    return { error: "Network error" };
  }
};

// PUT /api/tasks/:taskId
const updateTask = async (params, credentials, task) => {
  try {
    const response = await fetch(`${API_BASE}/${params.taskId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.t}`,
      },
      body: JSON.stringify(task),
    });
    return await response.json();
  } catch (err) {
    console.error(err);
    return { error: "Network error" };
  }
};

// DELETE /api/tasks/:taskId
const removeTask = async (params, credentials) => {
  try {
    const response = await fetch(`${API_BASE}/${params.taskId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.t}`,
      },
    });
    return await response.json();
  } catch (err) {
    console.error(err);
    return { error: "Network error" };
  }
};

export { listTasks, readTask, createTask, updateTask, removeTask };