const signup = async (user) => {
  try {
    const response = await fetch("/auth/signup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.error(err);
    return { error: "Network error" };
  }
};

const signin = async (user) => {
  try {
    const response = await fetch("/auth/signin", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.error(err);
    return { error: "Network error" };
  }
};

const signout = async () => {
  try {
    const response = await fetch("/auth/signout", {
      method: "GET",
      credentials: "include",
    });
    return await response.json();
  } catch (err) {
    console.error(err);
    return { error: "Network error" };
  }
};

export { signup, signin, signout };
