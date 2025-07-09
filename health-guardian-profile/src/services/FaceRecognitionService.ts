import { AxiosError } from "axios";
import apiClient from '../api/axiosConfig'; // adjust path as needed
import { useNavigate } from "react-router-dom";


interface FaceRecognitionRequest {
  matched: boolean;
  patient_id?: string;
  confidence?: number;
  // Add other fields returned by your API
}

export const faceRecognition = async (
  payload: string | File,
  navigate?: ReturnType<typeof useNavigate>
) => {
  const formData = new FormData();

  if (payload instanceof File) {
    formData.append("image", payload);
  } else if (typeof payload === "string") {
    const blob = await (await fetch(payload)).blob();
    formData.append("image", blob, "captured.jpg");
  } else {
    throw new Error("Invalid image payload");
  }
  console.log("Sending image for face recognition:", formData);

  try {
    const response = await apiClient.post<FaceRecognitionRequest>(
      "/api/faceMatch",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Face recognition response:", response.data.user_id);
    // Redirect to the emergency page with the userId parameter if matched
    if (response.data.user_id && navigate) {
      navigate(`/emergency/${response.data.user_id}`);
    }
    // return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "Face recognition failed:",
      axiosError.response?.data || axiosError.message
    );
    throw axiosError;
  }
};
