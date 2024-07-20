import axios from "axios";
import { message } from "antd";

const baseUrl = "/api";

class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getInsideConfig() {
    const config = {
      baseUrl: this.baseUrl,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    return config;
  }

  intercept(instance) {
    // Add a request interceptor
    instance.interceptors.request.use(
      (config) => {
        // Add the token to headers before request is sent
        const token = localStorage.getItem("token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`; // Set the token header
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const { response } = error;
        if (response) {
          const { status, data } = response;

          if (status === 401) {
            // Handle token expiration or invalid token
            localStorage.removeItem("token");
            if (window.location.pathname !== "/login") {
              window.location.href = "/login";
            }
          } else {
            // Show error message from backend
            const errorMessage =
              data.msg || "An unexpected error occurred. Please try again.";
            message.error(errorMessage);
          }
        } else {
          // Handle network errors or other issues
          message.error(
            "Failed to connect to the server. Please check your connection."
          );
        }
        return Promise.reject(error);
      }
    );
  }

  request(options) {
    const instance = axios.create(this.getInsideConfig());
    this.intercept(instance);
    return instance(options);
  }
}
export default new HttpRequest(baseUrl);
