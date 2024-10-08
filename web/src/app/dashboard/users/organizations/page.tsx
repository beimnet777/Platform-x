"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { fetchOrganizations, approveOrganization } from "@/api/organizations";
import Breadcrumb from "@/components/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/components/Layouts/DefaultLayout";
import Loader from "@/components/components/common/Loader";
import ConfirmationModal from "@/components/modal/ConfirmationModal";

const OrganizationsPage = () => {
  const { data, mutate, isLoading } = useSWR(
    "/api/v1/SuperAdmin/list-organizations",
    fetchOrganizations
  );

  const [filter, setFilter] = useState<"all" | "approved" | "unapproved">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [organizationToApprove, setOrganizationToApprove] = useState<number | null>(null);

  const handleOpenModal = (id: number) => {
    setOrganizationToApprove(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOrganizationToApprove(null);
  };

  const handleApproveOrganization = async () => {
    if (!organizationToApprove) return;

    try {
      await approveOrganization(organizationToApprove);
      mutate();
      handleCloseModal();
    } catch (error) {
      console.error("Error approving organization:", error);
    }
  };

  const [filteredOrganizations, setFilterOrg] = useState([]);

  useEffect(() => {
    if (data) {
      setFilterOrg(
        data.filter((org: any) => {
          if (filter === "approved") return org.approved;
          if (filter === "unapproved") return !org.approved;
          return true;
        })
      );
    }
  }, [data, filter]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Organizations" />

      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-6 flex justify-between items-center">
          <h4 className="text-xl font-semibold text-black dark:text-white">List of Organizations</h4>

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
          {isLoading ? (
            <Loader />
          ) : filteredOrganizations.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-600 dark:text-gray-400">No organizations available</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
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
                      {org.user.firstName} {org.user.lastName}
                    </p>
                  </div>

                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">{org.user.email}</p>
                  </div>

                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">{org.organizationName}</p>
                  </div>

                  <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                    {!org.approved ? (
                      <button
                        onClick={() => handleOpenModal(org.id)}
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
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleApproveOrganization}
        title="Approve Organizations"
        message="Are you sure you want to approve this organization?"
        confirmText="Approve"
        cancelText="Cancel"
      />
    </DefaultLayout>
  );
};

export default OrganizationsPage;
