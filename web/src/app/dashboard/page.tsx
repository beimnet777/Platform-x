"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import useFormResponseStats from "@/api/hooks/useFormResponseStats";
import useOrganizationResponseStats from "@/api/hooks/useOrganizationResponseStats";
import DefaultLayout from "@/components/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/components/Breadcrumbs/Breadcrumb";
import Loader from "@/components/components/common/Loader";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const chartOptions: ApexOptions = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#3C50E0", "#80CAEE"],
  labels: ["Form Responses", "Organization Responses"],
  legend: {
    show: true,
    position: "bottom",
  },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};


const getStartOfWeek = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

const getEndOfWeek = (date: Date) => {
  const startOfWeek = getStartOfWeek(date);
  return new Date(startOfWeek.setDate(startOfWeek.getDate() + 6));
};

const getStartAndEndDates = (weekOffset = 0) => {
  const currentDate = new Date();
  const startOfWeek = getStartOfWeek(new Date(currentDate.setDate(currentDate.getDate() + weekOffset * 7)));
  const endOfWeek = getEndOfWeek(new Date(startOfWeek));
  return {
    startDate: startOfWeek.toISOString().split("T")[0],
    endDate: endOfWeek.toISOString().split("T")[0],
  };
};

const DonutChartWithFilters: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<"This Week" | "Last Week">("This Week");


  const { startDate: startDateThisWeek, endDate: endDateThisWeek } = getStartAndEndDates(0); // Current week
  const { startDate: startDateLastWeek, endDate: endDateLastWeek } = getStartAndEndDates(-1); // Previous week

  const startDate = timePeriod === "This Week" ? startDateThisWeek : startDateLastWeek;
  const endDate = timePeriod === "This Week" ? endDateThisWeek : endDateLastWeek;


  const { data: formData, isLoading: isLoadingForm } = useFormResponseStats(startDate, endDate);
  const { data: organizationData, isLoading: isLoadingOrganization } = useOrganizationResponseStats(startDate, endDate);

 
  const isLoading = isLoadingForm || isLoadingOrganization;

 
  const formResponseCount = formData?.responseCount || 0;
  const organizationResponseCount = organizationData?.responseCount || 0;
  const series = [formResponseCount, organizationResponseCount];

  // Check if there is no data
  const isNoDataAvailable = !isLoading && formResponseCount === 0 && organizationResponseCount === 0;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Dashboard" />
      <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
        <div className="mb-3 justify-between gap-4 sm:flex">
          <div>
            <h5 className="text-xl font-semibold text-black dark:text-white">
              Response Analytics
            </h5>
          </div>
          <div>
            <div className="relative z-20 inline-block">
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as "This Week" | "Last Week")}
                className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
              >
                <option value="This Week" className="dark:bg-boxdark">
                  This Week
                </option>
                <option value="Last Week" className="dark:bg-boxdark">
                  Last Week
                </option>
              </select>
              <span className="absolute right-3 top-1/2 z-10 -translate-y-1/2">
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                    fill="#637381"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
                    fill="#637381"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <div id="chartThree" className="mx-auto flex justify-center">
            {isLoading ? (
              <Loader />
            ) : isNoDataAvailable ? (
              <div>No data available</div>
            ) : (
              <ReactApexChart options={chartOptions} series={series} type="donut" />
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default DonutChartWithFilters;
