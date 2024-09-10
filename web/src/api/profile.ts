import axios from "@/utils/axios";

export const fetchUserProfile = async () => {
    const response = await axios.get('/api/v1/auth/get-profile');
    return response.data;
  };