"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import useOrganizationResponseStats from "@/api/hooks/useOrganizationResponseStats";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const organizationResponseOptions: ApexOptions = {
  colors: ["#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 350,
    type: "bar",
    toolbar: { show: false },
  },
  xaxis: { categories: ["Organization Responses"] },
  dataLabels: { enabled: false },
  legend: { position: "top", horizontalAlign: "left" },
};

const OrganizationResponseChart: React.FC = () => {
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-25");
  const { data, isLoading, isError } = useOrganizationResponseStats(startDate, endDate);

  const handleFilter = () => {
    // SWR will automatically refetch with the updated dates
  };

  const organizationResponseSeries = [
    {
      name: "Organization Responses",
      data: [data?.responseCount || 0],
    },
  ];

  return (
    <div className="col-span-12 md:col-span-6 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h4 className="mb-4 text-xl font-semibold text-black dark:text-white">
        Organization Responses
      </h4>
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
          <button
            onClick={handleFilter}
            className="bg-primary text-white px-4 py-2 rounded-md"
          >
            Filter
          </button>
        </div>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>No data available</div>
      ) : (
        <ReactApexChart
          options={organizationResponseOptions}
          series={organizationResponseSeries}
          type="bar"
          height={350}
        />
      )}
    </div>
  );
};

export default OrganizationResponseChart;
