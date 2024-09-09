"use client";

import React from "react";

import FormResponseChart from "./components/FormResponseChart";
import OrganizationResponseChart from "./components/OrganizationResponseChart";
import DefaultLayout from "@/components/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/components/Breadcrumbs/Breadcrumb";

const ChartsPage: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Dashboard" />
      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <FormResponseChart />
        <OrganizationResponseChart />
      </div>
    </DefaultLayout>
  );
};

export default ChartsPage;
