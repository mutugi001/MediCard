import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { AxiosError } from 'axios';

// --- Import the project service ---
import { infoService } from '../services/InfoService'; // Adjust path as needed

// 1. Define the Project type based on your API response (ProjectResource)
// Ensure this matches the interface in apiService.ts and your API response
interface Details {
 firstname: string;
  lastname: string;
  phoneNumber: string;
  gender: string;
  age: string;
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

type NewDetailsPayload = Omit<Details,'age' | 'id' | 'created_at' | 'updated_at' | 'user_id'> & {
  team_id?: number; // Optional if not required for creation
  
};

// 2. Define the shape of the context data
interface DetailsContextType {
  Details: Details[];
  loading: boolean;
  error: string | null;
  fetchDetails: () => Promise<void>; // fetchProjects typically doesn't need to return details, it sets state
  addDetails: (payload: NewDetailsPayload) => Promise<Details | null>;
  updateDetails: (id: number, payload: Partial<Details>) => Promise<Details | null>;
  deleteDetails: (id: number) => Promise<boolean>;
}

// 3. Create the Context
const DetailsContext = createContext<DetailsContextType | null>(null);

// 4. Create the Provider Component
interface DetailsProviderProps {
  children: ReactNode;
}

export const DetailsProvider: React.FC<DetailsProviderProps> = ({ children }) => {
  const [details, setDetails] = useState<Details[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Define the function to fetch details using the projectService
  const fetchdetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // --- Use projectService.getProjects() ---
      const details = await infoService.getDetails();
      // The service function already extracts the data array and handles pagination structure
      setDetails(details); // Set state with the returned array
    } catch (err) {
      // Service function might re-throw error, catch it here to set state
      const error = err as AxiosError | Error; // Can be AxiosError or other Error
      console.error("Error fetching details via context:", error.message);
      setError('Failed to load details.');
      // Optional: Handle specific errors like 401/403
      // if (axiosError.response && (axiosError.response.status === 401 || axiosError.response.status === 419)) {
      //   // Handle unauthorized access
      // }
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array for useCallback is fine here as it doesn't depend on component scope variables that change

  const addDetails = useCallback(async (payload: FormData): Promise<Details | null> => {
    setLoading(true); // Indicate loading state
    setError(null);
    console.log(payload);
    try {
      // Use the service function to create the project via API
      const details = await infoService.createDetails(payload);
      console.log("Details created via API:", details);
      // Refresh the details list to include the new one
      await fetchdetails(); // Await fetch to ensure list is updated before returning
      return details; // Return the newly created project data
    } catch (error) {
      const err = error as AxiosError | Error;
      console.error("Failed to add project via context:", err.message);
      setError("Failed to add project."); // Set error state in context
      return null; // Indicate failure
    } finally {
      setLoading(false); // Reset loading state
    }
  }, [fetchdetails]); // Depend on fetchProjects to ensure it is up-to-date

//   const updateProject = useCallback(async (id: number, payload: Partial<Details>): Promise<Details | null> => {
//     setLoading(true); // Indicate loading state
//     setError(null);
//     try {
//       // Use the service function to update the project via API
//       const updatedProject = await infoService.updateProject(id, payload);
//       console.log("Project updated via API:", updatedProject);
//       // Refresh the details list to reflect the updated project
//       await fetchProjects(); // Await fetch to ensure list is updated before returning
//       return updatedProject; // Return the updated project data
//     } catch (error) {
//       const err = error as AxiosError | Error;
//       console.error("Failed to update project via context:", err.message);
//       setError("Failed to update project."); // Set error state in context
//       return null; // Indicate failure
//     } finally {
//       setLoading(false); // Reset loading state
//     }
//   }, [fetchProjects]); // Depend on fetchProjects to ensure it is up-to-date

//   const deleteProject = useCallback(async (id: number): Promise<boolean> => {
//     setLoading(true); // Indicate loading state
//     setError(null);
//     try {
//       // Use the service function to delete the project via API
//       await projectService.deleteProject(id);
//       console.log("Project deleted via API:", id);
//       // Refresh the details list to reflect the deletion
//       await fetchProjects(); // Await fetch to ensure list is updated
//       return true; // Indicate success
//     } catch (error) {
//       const err = error as AxiosError | Error;
//       console.error("Failed to delete project via context:", err.message);
//       setError("Failed to delete project."); // Set error state in context
//       return false; // Indicate failure
//     } finally {
//       setLoading(false); // Reset loading state
//     }
//   }, [fetchProjects]); // Depend on fetchProjects to ensure it is up-to-date

  // Fetch details automatically when the provider mounts
  useEffect(() => {
    // Check if user is authenticated before fetching? Maybe get user from AuthContext here?
    // For now, fetch on mount assuming auth is handled by interceptor/protected routes
    fetchdetails();
  }, [fetchdetails]); // Depend on the stable fetchProjects function

  // Value provided by the context
  const value = useMemo<DetailsContextType>(() => ({
    Details: details,
    loading,
    error,
    fetchDetails: fetchdetails,
    addDetails,
    updateDetails: async () => { throw new Error('updateDetails not implemented'); },
    deleteDetails: async () => { throw new Error('deleteDetails not implemented'); },
  }), [details, loading, error, fetchdetails, addDetails]);

  return (
    <DetailsContext.Provider value={value}>
      {children}
    </DetailsContext.Provider>
  );
};

// 5. Create a custom hook for easy consumption
export const useDetails = (): DetailsContextType => {
  const context = useContext(DetailsContext);
  if (!context) {
    throw new Error('useDetails must be used within a DetailsProvider');
  }
  return context;
};
