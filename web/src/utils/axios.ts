import axios, { AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({ baseURL: process.env.BASE_URL });

console.log("hi, axioInstance")
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");

    // Check if the headers exist and are of type AxiosHeaders
    if (config.headers) {
      config.headers.set('Authorization', `Bearer ${token}`);
    } else {
      // If headers do not exist, create them using AxiosHeaders
      config.headers = new axios.AxiosHeaders();
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  console.log(args, "arges")
  const [url, config] = Array.isArray(args) ? args : [args];
  
  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};