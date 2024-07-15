import axios from "axios";

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

    // Add a response interceptor
    instance.interceptors.response.use(
      function (response) {
        // Any status code that lies within the range of 2xx causes this function to trigger
        return response;
      },
      function (error) {
        if (error.response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  request(options) {
    options = { ...this.getInsideConfig(), ...options };
    const instance = axios.create();

    this.intercept(instance);

    return instance(options);
  }
}
export default new HttpRequest(baseUrl);
