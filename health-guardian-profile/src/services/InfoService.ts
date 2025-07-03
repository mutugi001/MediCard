import apiClient from '../api/axiosConfig'; // Use the interceptor-enhanced client
import Cookies from 'js-cookie';
import axios, { AxiosError, AxiosResponse } from 'axios';



interface PaginatedResponse<T> {
    data: T[];
    links: { first: string | null; last: string | null; prev: string | null; next: string | null; };
    meta: { current_page: number; from: number | null; last_page: number; path: string; per_page: number; to: number | null; total: number; };
}
interface Details {
 firstname: string;
  lastname: string;
  phoneNumber: string;
  gender: string;
  age: string;
  dateOfBirth: string;
  bloodType: string;
  allergies: string;
  medications: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalConditions: string;
  insuranceProvider: string;
  insurancePolicyNumber: string
  doctorName: string;
  doctorPhone: string;
  profilePhoto: File;
}
interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

const getCsrfCookie = async (): Promise<void> => {
  try {
    // No token needed for this request usually
    await apiClient.get('/sanctum/csrf-cookie');
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Error fetching CSRF cookie:', axiosError.response?.data?.message || axiosError.message);
    throw error;
  }
};

const getDetails = async (): Promise<PaginatedResponse<Details>> => {
  // Interceptor adds Bearer token

  try {
    const xsrfToken = Cookies.get('XSRF-TOKEN');
    try {
      const response = await apiClient.get<Details>('/api/details/index',{
        headers: { 'X-XSRF-TOKEN': xsrfToken || '' } // Add if CSRF needed here
      });
      return response.data; // Return the created project data from API
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Failed to Fetch details:', axiosError.response?.data || axiosError.message);
      throw error;
    }
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Failed to Fetch details:', axiosError.response?.data || axiosError.message);
    throw error;
  }
};

const createDetails = async (payload: FormData): Promise<Details> => {
   // Interceptor adds Bearer token & CSRF might not be needed if using token auth
   // const xsrfToken = Cookies.get('XSRF-TOKEN'); // Only needed if /api/projects requires CSRF
   //append user-id to payload if needed
  try {
    const xsrfToken = Cookies.get('XSRF-TOKEN');
    try {
      const response = await apiClient.post<Details>('/api/details/store', payload , {
        headers: { 'X-XSRF-TOKEN': xsrfToken || '' } // Add if CSRF needed here
      });
      return response.data; // Return the created project data from API
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Failed to add details:', axiosError.response?.data || axiosError.message);
      throw error;
    }
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Failed to add details:', axiosError.response?.data || axiosError.message);
    throw error;
  }
};



export const infoService = {
  getCsrfCookie,
  getDetails,
  createDetails
};