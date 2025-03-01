import axios, { AxiosError } from "axios";
import { getStrapiURL } from "@/lib/utils";

interface RegisterUserProps {
  username: string;
  password: string;
  email: string;
}

interface LoginUserProps {
  identifier: string;
  password: string;
}

const baseUrl = getStrapiURL();

export async function registerUserService(userData: RegisterUserProps) {
  const url = `${baseUrl}/api/auth/local/register`;

  try {
    const response = await axios.post(url, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Registration Service Error:", error);
    throw error;
  }
}

export async function loginUserService(userData: LoginUserProps) {
  const url = `${baseUrl}/api/auth/local`;

  try {
    const response = await axios.post(url, userData, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Login Error Response:", error.response?.data);

      if (error.response?.status === 400 || error.response?.status === 401) {
        return { error: "Invalid username or password." };
      }
    }

    return { error: "Something went wrong. Please try again." };
  }
}
