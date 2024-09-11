import axios from "@/utils/axios";
import useSWR from "swr";

// Fetcher function to get organization response data
const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const useOrganizationResponseStats = (startDate: string, endDate: string) => {
  
  const { data, error } = useSWR(
    `/api/v1/orgAdmin/get-organization-response-stat/?startDate=${startDate}&endDate=${endDate}`,
    fetcher
  );


  return {
    data, 
    isLoading: !data && !error, 
    isError: !!error, 
  };
};

export default useOrganizationResponseStats;
