import { createContext } from "react";

export const AuthContext = createContext({
  isLoaded: false,
  user: null,
  token: null,
  requests: [],
  setRequestData: () => {},
  setUser: () => {},
  setToken: () => {},
  logOut: () => {},
});
