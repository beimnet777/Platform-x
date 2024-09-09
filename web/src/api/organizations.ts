import axios from 'axios';

// Function to fetch organizations
export const fetchOrganizations = async () => {
  const response = await axios.get('/api/v1/SuperAdmin/list-organizations');
  return response.data;
};

// Function to approve an organization
export const approveOrganization = async (id: number) => {
  const response = await axios.put(`http://localhost:3000/api/v1/SuperAdmin/approve-organization/${id}`);
  return response.data;
};
