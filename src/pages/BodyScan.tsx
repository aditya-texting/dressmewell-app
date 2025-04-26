
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import BodyAnalysis from "@/components/BodyAnalysis";

const BodyScan = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Body Shape Analysis</h1>
        <BodyAnalysis />
      </div>
    </MainLayout>
  );
};

export default BodyScan;
