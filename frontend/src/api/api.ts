import axios from "axios";

export const Api = axios.create({
  baseURL: "http://127.0.0.1:5000/",
});
