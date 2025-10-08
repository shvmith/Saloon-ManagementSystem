import { AxiosError } from "axios";
import client from "../../api/axiosClient";
import API_CONSTANTS from "../../constants/apiConstants";
// import { signInWithPopup } from "firebase/auth";
// import { auth, googleProvider, facebookProvider } from "../../firebase";

const authService = {
  signup: async (userData) => {
    try {
      const response = await client.post(API_CONSTANTS.SIGNUP, userData);

      return {
        success: true,
        message: response.data.message || "Account created successfully",
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data) {
          console.error("Error creating account:", error.response.data);
          return {
            success: false,
            message: error.response.data.message || "Failed to create account",
          };
        }
      } else if (error instanceof Error) {
        console.error("Error creating account:", error.message);
        return {
          success: false,
          message: error.message,
        };
      }
      console.error("Error creating account:", error);
      return {
        success: false,
        message: "An unknown error occurred",
      };
    }
  },

  login: async (credentials) => {
    try {
      const response = await client.post(API_CONSTANTS.LOGIN, credentials);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      return {
        success: true,
        message: "Login successful",
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data) {
          console.error("Login error:", error.response.data);
          return {
            success: false,
            message: error.response.data.message || "Login failed",
          };
        }
      } else if (error instanceof Error) {
        console.error("Login error:", error.message);
        return {
          success: false,
          message: error.message,
        };
      }
      console.error("Login error:", error);
      return {
        success: false,
        message: "An unknown error occurred",
      };
    }
  },
  logout: async () => {
    try {
      await client.get(API_CONSTANTS.LOGOUT);
      localStorage.removeItem("token");

      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");

      return {
        success: true,
        message: "Logged out successfully",
      };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await client.get(API_CONSTANTS.GET_CURRENT_USER);
      return response.data.user;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  },

  //   loginWithGoogle: async () => {
  //     try {
  //       const result = await signInWithPopup(auth, googleProvider);
  //       const user = result.user;

  //       const response = await client.post(API_CONSTANTS.SOCIAL_AUTH, {
  //         email: user.email,
  //         name: user.displayName,
  //         photo: user.photoURL,
  //       });

  //       if (response.data.token) {
  //         localStorage.setItem("token", response.data.token);
  //       }

  //       return {
  //         success: true,
  //         message: "Google login successful",
  //         token: response.data.token,
  //         user: response.data.user,
  //       };
  //     } catch (error) {
  //       if (error instanceof AxiosError) {
  //         if (error.response?.data) {
  //           console.error("Google login error:", error.response.data);
  //           return {
  //             success: false,
  //             message: error.response.data.message || "Google login failed",
  //           };
  //         }
  //       } else if (error instanceof Error) {
  //         console.error("Google login error:", error.message);
  //         return {
  //           success: false,
  //           message: error.message,
  //         };
  //       }
  //       console.error("Google login error:", error);
  //       return {
  //         success: false,
  //         message: "An unknown error occurred during Google login",
  //       };
  //     }
  //   },
};

export default authService;
