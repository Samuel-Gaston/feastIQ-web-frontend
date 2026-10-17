import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let pendingQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null) => {
  pendingQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token as string);
  });
  pendingQueue = [];
};

const redirectToLogin = () => {
  if (typeof window === "undefined") return;
  ["accessToken", "refreshToken", "role", "lastActivityAt"].forEach((k) =>
    localStorage.removeItem(k)
  );
  if (!window.location.pathname.includes("/login")) {
    window.location.href = "/auth/login?session_expired=true";
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      console.warn("API Network Error: No response received from server.");
      return Promise.reject(error);
    }

    const isAuthRoute =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/refresh");

    if (error.response.status === 401 && !originalRequest._retry && !isAuthRoute) {
      const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

      if (!refreshToken) {
        redirectToLogin();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (newToken: string) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${API_URL}/auth/refresh`,
          { refreshToken },
          { timeout: 30000 }
        );
        const body = res.data?.data ?? res.data;
        const newAccessToken = body?.accessToken;
        const newRefreshToken = body?.refreshToken;
        if (!newAccessToken || !newRefreshToken) {
          throw new Error("Invalid refresh response");
        }

        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError: any) {
        const latestAccess = localStorage.getItem("accessToken");
        const latestRefresh = localStorage.getItem("refreshToken");
        if (latestAccess && latestRefresh && latestRefresh !== refreshToken) {
          processQueue(null, latestAccess);
          originalRequest.headers.Authorization = `Bearer ${latestAccess}`;
          return api(originalRequest);
        }

        processQueue(refreshError, null);

        const status = refreshError?.response?.status;
        if (status === 400 || status === 401 || status === 403) {
          redirectToLogin();
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    console.warn("API Error Response:", error.response.status, error.response.data);
    return Promise.reject(error);
  }
);

export default api;