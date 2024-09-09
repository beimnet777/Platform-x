import useSWR from "swr";

// Fetcher function to get organization response data
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useOrganizationResponseStats = (startDate: string, endDate: string) => {
  const { data, error } = useSWR(
    `http://localhost:3000/api/v1/orgAdmin/get-organization-response-stat/?startDate=${startDate}&endDate=${endDate}`,
    fetcher,
    { fallbackData: { responseCount: 7 } } // Fallback value
  );

  return {
    data:{ responseCount: 7 },
    isLoading: !error && !data,
    isError: false,
  };
};

export default useOrganizationResponseStats;
