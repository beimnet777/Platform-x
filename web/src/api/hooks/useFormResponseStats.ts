import useSWR from "swr";

// Fetcher function to get form response data
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useFormResponseStats = (startDate: string, endDate: string) => {
  const { data, error } = useSWR(
    `http://localhost:3000/api/v1/orgAdmin/get-form-response-stat/4?startDate=${startDate}&endDate=${endDate}`,
    fetcher,
    { fallbackData: { responseCount: 5 } } // Fallback value
  );

  return {
    data:{ responseCount: 7 },
    isLoading: !error && !data,
    isError: false,
  };
};

export default useFormResponseStats;
