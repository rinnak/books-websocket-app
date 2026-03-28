import axios from "axios";

export const api = axios.create({
    baseURL: "http://158.160.203.172:8080",
    auth: {
        username: "admin",
        password: "6812363",
    }
});