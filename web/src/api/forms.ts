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

// Fetch all forms
export const fetchForms = async () => {
  try {
    const response = await axios.get('/api/v1/orgAdmin/get-forms');
    return response.data;
  } catch (error) {
    console.error("Error fetching forms:", error);
    throw error;
  }
};

// Fetch questions for a specific form
export const fetchFormQuestions = async (formId: number) => {
  try {
    const response = await axios.get(`/api/v1/orgAdmin/get-form-questions/${formId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching form questions:", error);
    throw error;
  }
};
export const fetchFormResponses = async (formId: number | null | string): Promise<any> => {
  try {
    const response = await axios.get(`/api/v1/orgAdmin/get-responses/${formId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching form responses:', error);
    throw error;
  }
};
