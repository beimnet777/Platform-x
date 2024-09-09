import axios from 'axios';

// Function to fetch agents
export const fetchAgents = async () => {
  const response = await axios.get('/api/v1/SuperAdmin/list-agents');
  return response.data;
};

// Function to approve an agent
export const approveAgent = async (id: number) => {
  const response = await axios.put(`http://localhost:3000/api/v1/SuperAdmin/approve-agent/${id}`);
  return response.data;
};
