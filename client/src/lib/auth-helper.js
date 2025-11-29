
import { signout } from "./api-auth.js";

const auth = {
  isAuthenticated() {
    if (typeof window === "undefined") return false;
    const jwt = sessionStorage.getItem("jwt");
    return jwt ? JSON.parse(jwt) : false;
  },

  // data is the raw response from /auth/signin: { token, user }
  authenticate(data, cb) {
    if (typeof window !== "undefined") {
      const jwt = { t: data.token, user: data.user };   
      sessionStorage.setItem("jwt", JSON.stringify(jwt));
    }
    cb && cb();
  },

  clearJWT(cb) {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("jwt");
    }
    cb && cb();
    signout().then(() => {
      document.cookie =
        "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });
  },
};

export default auth;
