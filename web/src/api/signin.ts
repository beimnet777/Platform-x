import { setStorage } from '@/utils/auth';
import axios from '@/utils/axios';



interface SignInCredentials {
  email: string;
  password: string;
}

export const signIn = async (credentials: SignInCredentials) => {
  try {
    const response = await axios.post('/api/v1/auth/login', credentials);
    console.log(response)
    if (response.data.status === 'Success' && response.data.token) {
      const { token } = response.data;

      setStorage(token); // Store the token and decode role
      return true; // Indicate success
    } else {
      console.error('Sign-in failed:', response.data);
      return response.data; // Indicate failure
    }
  } catch (error) {
    console.log(error)
    throw error;
  }
};

const useSignupApi = () => {
  // Function to handle agent signup
  const signupAgent = async (agentData: {
    userName: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userType: string;
    gender: string;
    age: number;
  }) => {
    try {
      const response = await axios.post('/api/v1/auth/signup/agent', agentData);

      console.log(response)
      
     
        setStorage(response.data.data.token);
        
        // Redirect to the dashboard
        return true;
    } catch (error) {
      throw error
    }
  };

  // Function to handle organization signup
  const signupOrganization = async (orgData: {
    userName: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userType: string;
    organizationName: string;
    organizationDescription: string;
  }) => {
    try {
      const response = await axios.post('/api/v1/auth/signup/organization', orgData);

      console.log(response)
      
     
       
        setStorage(response.data.data.token);

        return true;
      
    } catch (error) {
      throw error;
    }
  };

  return { signupAgent, signupOrganization };
};

export default useSignupApi;
