"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { approveAgent, fetchAgents } from "@/api/agents";
import Breadcrumb from "@/components/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/components/Layouts/DefaultLayout";
import { fetcher } from "../../../../utils/axios";
import Loader from "@/components/components/common/Loader";


const AgentsPage = () => {
  const { data, mutate, isLoading } = useSWR("/api/v1/SuperAdmin/get-agents", fetchAgents);

  const [filter, setFilter] = useState<"all" | "approved" | "unapproved">("all"); // State to manage filter

  const handleApproveAgent = async (id: number) => {
    try {
      await approveAgent(id);
      mutate(); // Revalidate SWR cache
    } catch (error) {
      console.error("Error approving agent:", error);
    }
  };

  // Function to filter agents based on approval status
  const [filteredAgents, setFilterData] = useState([])
  useEffect (()=> {
    if (data) {
      setFilterData(data.filter((agent: any) => {
        if (filter === "approved") return agent.approved;
        if (filter === "unapproved") return !agent.approved;
        return true; // If 'all', show all agents
      }))
    }
  },[data, filter])
  

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Agents" />
      <div className="col-span-12 xl:col-span-7">
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="mb-6 flex justify-between items-center">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              List of Agents
            </h4>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as "all" | "approved" | "unapproved")}
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-primary dark:bg-meta-4 dark:text-white"
              >
                <option value="all">All</option>
                <option value="approved">Approved</option>
                <option value="unapproved">Unapproved</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
              <div className="p-2.5 xl:p-4">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Name
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-4">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Email
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-4">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Gender
                </h5>
              </div>
              <div className="hidden p-2.5 text-center sm:block xl:p-4">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Actions
                </h5>
              </div>
            </div>
            {isLoading && <Loader></Loader> }
            {!isLoading && filteredAgents.map((agent: any, key: any) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-4 ${
                  key === filteredAgents.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-strokedark"
                }`}
                key={key}
              >
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {agent.firstName} {agent.lastName}
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{agent.email}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {agent.gender}
                  </p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  {!agent.approved ? (
                    <button
                      onClick={() => handleApproveAgent(agent.id)}
                      className="text-white bg-primary px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                  ) : (
                    <span className="text-green-500">Approved</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AgentsPage;
