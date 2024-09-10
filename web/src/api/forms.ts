import axios from "@/utils/axios"; // Import your configured axios instance

// Function to create a form
export const createForm = async (formData: any) => {
  try {
    const response = await axios.post('/api/v1/orgAdmin/create_form', formData);
    return response.data;
  } catch (error) {
    console.error("Error creating form:", error);
    throw error;
  }
};
