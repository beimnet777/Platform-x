import axios from "@/utils/axios";
import useSWR from "swr";

const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
const useFormResponseStats = (startDate: string, endDate: string) => {
 
  const { data, error } = useSWR(
    `/api/v1/orgAdmin/get-form-response-stat/4?startDate=${startDate}&endDate=${endDate}`,
    fetcher
  );

 
  return {
    data, 
    isLoading: !data && !error, 
    isError: !!error, 
  };
};

export default useFormResponseStats;
