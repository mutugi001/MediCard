import { Token } from '@/types/api_response';
import apiClient from '../api/axiosConfig'; // Adjust the import path as necessary
import Cookies from 'js-cookie'; // <--- Import js-cookie
import axios, { AxiosError, AxiosResponse } from 'axios';

// Define the structure of the User object based on your Laravel User model/resource
// Adjust properties as needed (id, name, email, email_verified_at, etc.)
export interface User {
  id: number;
  name: string;
  email: string;
  // Add other relevant user fields
  // email_verified_at?: string; // Example optional field
  // created_at?: string;
  // updated_at?: string;
}

// Define payload types for clarity (optional but good practice)
interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload extends LoginPayload {
  name: string; // Assuming you have a company_name field
  email:string;
  password: string;
  password_confirmation: string;
  // terms: boolean; // Assuming you have a terms checkbox
}

interface LogoutPayload extends LoginPayload {
  email: string; // Define any additional fields if needed
}

// Define a type for API errors if your backend sends a consistent structure
interface ApiError {
    message: string;
    errors?: Record<string, string[]>; // Example for validation errors
}

// --- Service Functions ---

const getCsrfCookie = async (): Promise<void> => {
  try {
    const csrf = await apiClient.get('/sanctum/csrf-cookie');

  } catch (error) {
    // Type the error if possible, otherwise use 'unknown' or 'any'
    const axiosError = error as AxiosError<ApiError>;
    console.error('Error fetching CSRF cookie:', axiosError.response?.data?.message || axiosError.message);
    // Re-throw or handle as needed
    throw error;
  }
};

// Login returns a boolean indicating success/failure for easier handling in context/component
const login = async (payload: LoginPayload): Promise<boolean> => {
  await getCsrfCookie();
  const xsrfToken = Cookies.get('XSRF-TOKEN');
  try {
    console.log(apiClient);
    // Fortify usually returns 2xx on success without user data in body
    const response: AxiosResponse<Token> = await apiClient.post('api/login', payload, {
      headers: {
        'X-XSRF-TOKEN': xsrfToken, // Set the header explicitly
        'Content-Type': 'application/json',

    }
    });


    if (response.data) {

      localStorage.setItem('accessToken', response.data); // Store token string in localStorage
      return true;
    } else {
      console.error('Login successful, but accessToken not found in response.');
      return false;
    }

  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Login failed:', axiosError.response?.data || axiosError.message);
    // Optionally extract specific error messages from axiosError.response.data.errors
    return false; // Indicate failure
  }
};

// Define payload for registration

// --- Add Register Function ---
const register = async (payload: RegisterPayload): Promise<boolean> => {
  await getCsrfCookie(); // Ensure CSRF cookie is set
  // console.log('csrf cookie set: ', csrf);
  // console.log('Document cookies right before POST /register:', document.cookie);
  const xsrfToken = Cookies.get('XSRF-TOKEN');
  if (!xsrfToken) {
    console.error('CSRF TOKEN Mismatch Pre-Check: Could not read XSRF-TOKEN cookie!');
    // You might want to inform the user here
    return false;
}
  try {
    console.log(payload);
      // Fortify returns 2xx on successful registration (e.g., 201 or 204)
      await apiClient.post('api/register', payload, {
        headers: {
          'X-XSRF-TOKEN': xsrfToken, // Set the header explicitly
          'Content-Type': 'application/json',

      }
      });
      return true;
  } catch (error) {
      const axiosError = error as AxiosError<ApiError>; // Use ApiError type if defined
      // Log the full error details, especially validation errors
      console.error('Registration failed:', axiosError.response?.data || axiosError.message);
      // You might want to extract specific validation messages from:
      // axiosError.response?.data?.errors
      return false; // Indicate failure
  }
}

// Logout returns a boolean, assuming success unless a server error occurs
const logout = async () => {
  try {
    await apiClient.post('api/logout', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    localStorage.removeItem('accessToken'); // Clear token from localStorage
    // Redirect to login page
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Fetches the currently authenticated user or null
const getUser = async (): Promise<User | null> => {
  try {
    // `Bearer ${accessToken}`
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return null;
    }

    apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    const response = await apiClient.get<User>('/api/user');

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Failed to fetch user:', axiosError.response?.status);

    if (axiosError.response && (axiosError.response.status === 401 || axiosError.response.status === 419)) {
      return null;
    }

    // For other errors (network, server), re-throw the error
    throw error;
  }
};

// Export functions grouped in an object
export const authService = {
  getCsrfCookie,
  login,
  register,
  logout,
  getUser,
};
