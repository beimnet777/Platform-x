"use client";
import React from "react";
import useSWR from "swr";
import { fetchOrganizations, approveOrganization } from "@/api/organizations";
import Breadcrumb from "@/components/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/components/Layouts/DefaultLayout";

const OrganizationsPage = () => {
  const { data, mutate } = useSWR("/api/v1/SuperAdmin/list-organizations", fetchOrganizations, {
    fallbackData: [
      {
        id: 6,
        userName: "orgAdm334in5",
        email: "admin5223@org.com",
        firstName: "Jane",
        lastName: "Smith",
        userType: "OrgAdmin",
        organization: {
          id: 6,
          organizationName: "OrgName",
          organizationDescription: "A description of the organization",
          approved: true,
        },
      },
    ],
  });

  const handleApproveOrganization = async (id: number) => {
    try {
      await approveOrganization(id);
      mutate(); // Revalidate SWR cache
    } catch (error) {
      console.error("Error approving organization:", error);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Organizations" />

      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          List of Organizations
        </h4>

        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Name</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Email</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Organization</h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
            </div>
          </div>

          {data.map((org:any, key:any) => (
            <div
              className={`grid grid-cols-3 sm:grid-cols-5 ${
                key === data.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
              }`}
              key={key}
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{org.firstName} {org.lastName}</p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{org.email}</p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{org.organization.organizationName}</p>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                {!org.organization.approved ? (
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
