import axios from "axios";
import firebase from "../firebaseConfig";

// never merge (IS_RUNNING_SERVER_LOCALLY = true) to master //
const IS_RUNNING_SERVER_LOCALLY = true;

const LOCAL_SERVER_URL = "http://localhost:5900";
export const PROD_SERVER_URL = process.env.REACT_APP_PROD_API_URL;
export const serverSlug = "/api";

const axiosWrapper = axios.create({
  baseURL: IS_RUNNING_SERVER_LOCALLY
    ? LOCAL_SERVER_URL + serverSlug
    : PROD_SERVER_URL + serverSlug,
  timeout: 35000,
});

axiosWrapper.interceptors.request.use(
  async (config: any) => {
    const token = await firebase.auth().currentUser?.getIdToken();
    config.headers.Authorization = `Bearer ${token || ""}`;
    return config;
  },
  (error: Error) => Promise.reject(error)
);

export default axiosWrapper;
