"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Breadcrumb from "@/components/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/components/Layouts/DefaultLayout";
import Loader from "@/components/components/common/Loader";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import { fetchOrgMembers, approveOrgMember } from "@/api/orgMembers";

const OrgMemberPage = () => {
  const { data, mutate, isLoading } = useSWR(
    "/api/v1/orgAdmin/get-organization-member",
    fetchOrgMembers
  );
  const [filter, setFilter] = useState<"all" | "approved" | "unapproved">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberToApprove, setMemberToApprove] = useState<number | null>(null);

  const handleOpenModal = (id: number) => {
    setMemberToApprove(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMemberToApprove(null);
  };

  const handleApproveMember = async () => {
    if (!memberToApprove) return;

    try {
      await approveOrgMember(memberToApprove);
      mutate(); // Revalidate SWR cache
      handleCloseModal(); // Close modal after approval
    } catch (error) {
      console.error("Error approving organization member:", error);
    }
  };

  const [filteredMembers, setFilteredMembers] = useState([]);
  useEffect(() => {
    if (data) {
      setFilteredMembers(
        data.filter((member: any) => {
          if (filter === "approved") return member.approved;
          if (filter === "unapproved") return !member.approved;
          return true; // If 'all', show all members
        })
      );
    }
  }, [data, filter]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Organization Members" />
      <div className="col-span-12 xl:col-span-7">
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="mb-6 flex justify-between items-center">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              List of Organization Members
            </h4>
            {/* Filter Dropdown */}
          </div>

          <div className="flex flex-col">
            {isLoading ? (
              <Loader />
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-600 dark:text-gray-400">No organization members available</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3">
                  <div className="p-2.5 xl:p-4">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">Name</h5>
                  </div>
                  <div className="p-2.5 text-center xl:p-4">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">Email</h5>
                  </div>
                  <div className="p-2.5 text-center xl:p-4">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">Job Title</h5>
                  </div>
                </div>
                {filteredMembers.map((member: any, key: any) => (
                  <div
                    className={`grid grid-cols-3 sm:grid-cols-3 ${
                      key === filteredMembers.length - 1
                        ? ""
                        : "border-b border-stroke dark:border-strokedark"
                    }`}
                    key={key}
                  >
                    <div className="flex items-center gap-3 p-2.5 xl:p-5">
                      <p className="text-black dark:text-white">
                        {member?.user?.firstName} {member?.user?.lastName}
                      </p>
                    </div>

                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                      <p className="text-black dark:text-white">{member?.user?.email}</p>
                    </div>

                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                      <p className="text-black dark:text-white">{member.jobTitle}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

    </DefaultLayout>
  );
};

export default OrgMemberPage;
