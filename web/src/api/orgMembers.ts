import axios from "@/utils/axios";


export const fetchOrgMembers = async () => {
  const response = await axios.get('/api/v1/orgAdmin/get-organization-member');
  return response.data;
};

export const approveOrgMember = async (memberId:number) => {
  const response = await axios.put(`/api/v1/orgAdmin/approve-member/${memberId}`);
  return response.data;
};
