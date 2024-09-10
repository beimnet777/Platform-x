import axios from "@/utils/axios";


// Function to fetch organizations
export const fetchOrganizations = async () => {
  
  const response = await axios.get('/api/v1/SuperAdmin/get-organizations')
  return response.data;
};

// Function to approve an organization
export const approveOrganization = async (id: number) => {
  const response = await axios.patch(`/api/v1/SuperAdmin/approve-organization/${id}`);
  return response.data;
};

interface CreateOrganizationData {
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: string;
  organizationName: string;
  organizationDescription: string;
}

export const createOrganization = async (orgData: CreateOrganizationData) => {
  try {
    const response = await axios.post('/api/v1/SuperAdmin/create_org_member', orgData);
    if (response.data.status === 'success') {
      return true;
    }
  } catch (error) {
    console.error('Error creating organization:', error);
    return false;
  }
};
