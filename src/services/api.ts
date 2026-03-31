import axios from "axios";

export const api = axios.create({
    baseURL: window.location.hostname === "localhost"
        ? "http://158.160.203.172:8080"
        : "/api",
    auth: {
        username: "admin",
        password: "6812363",
    }
});