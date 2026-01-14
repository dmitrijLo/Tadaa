import axios from "axios";

export const TEST_EVENT_UUID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
export const TEST_ROUTE = `http://localhost:3000/events/${TEST_EVENT_UUID}/guests`;

export const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((cfg) => {
  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    cfg.headers["x-dev-user-id"] = TEST_EVENT_UUID;
  } else {
    //token
  }

  //if token
  // cfg.headers ....

  return cfg;
});
