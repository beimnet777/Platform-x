import axios from "@/utils/axios";

// Function to fetch agents
export const fetchAgents = async () => {
  const response = await axios.get('/api/v1/SuperAdmin/get-agents');
  return response.data;
};

// Function to approve an agent
export const approveAgent = async (id: number) => {
  const response = await axios.patch(`/api/v1/SuperAdmin/approve-agent/${id}`);
  return response.data;
};

interface CreateAgentData {
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: string;
  gender: string;
  age: number;
}

export const createAgent = async (agentData: CreateAgentData) => {
  try {
    const response = await axios.post('/api/v1/auth/signup/agent', agentData);
    if (response.data.status === 'success') {
      return true;
    }
  } catch (error) {
    console.error('Error creating agent:', error);
    return false;
  }
};

