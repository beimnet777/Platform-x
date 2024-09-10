"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { fetchOrganizations, approveOrganization } from "@/api/organizations";
import Breadcrumb from "@/components/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/components/Layouts/DefaultLayout";
import Loader from "@/components/components/common/Loader";

const OrganizationsPage = () => {
  const { data, mutate ,isLoading } = useSWR(
    "/api/v1/SuperAdmin/list-organizations",
    fetchOrganizations,
  );

  const [filter, setFilter] = useState<"all" | "approved" | "unapproved">(
    "all"
  ); // State to manage filter

  const handleApproveOrganization = async (id: number) => {
    try {
      await approveOrganization(id);
      mutate(); // Revalidate SWR cache
    } catch (error) {
      console.error("Error approving organization:", error);
    }
  };

  const [filteredOrganizations, setFilterOrg] = useState([])

  useEffect(()=> {
    if(data) {
      setFilterOrg(data.filter((org: any) => {
        if (filter === "approved") return org.approved;
        if (filter === "unapproved") return !org.approved;
        return true; // If 'all', show all organizations
      }))
    }

  }, [data,filter])


  // Function to filter organizations based on approval status
  
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Organizations" />

      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-6 flex justify-between items-center">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            List of Organizations
          </h4>

          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "all" | "approved" | "unapproved")
              }
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
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Name
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Email
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Organization
              </h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Actions
              </h5>
            </div>
          </div>
          {isLoading && <Loader />}
          {filteredOrganizations.map((org: any, key: any) => (
            <div
              className={`grid grid-cols-3 sm:grid-cols-4 ${
                key === filteredOrganizations.length - 1
                  ? ""
                  : "border-b border-stroke dark:border-strokedark"
              }`}
              key={key}
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="text-black dark:text-white">
                  {org.firstName} {org.lastName}
                </p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{org.email}</p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">
                  {org.organizationName}
                </p>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                {!org.approved ? (
                  <button
                    onClick={() => handleApproveOrganization(org.id)}
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
    </DefaultLayout>
  );
};

export default OrganizationsPage;
