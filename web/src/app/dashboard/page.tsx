"use client";
import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { ListSubsidy } from "@/components/subsidy/list-subsidy";
import SubsidyWizard from "@/components/subsidy/subsidy-wizard";
import { useUserStore } from "../state/user";

const Page = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const user = useUserStore();

  // UI for login
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">Connect your wallet to continue</h2>
        <Button onClick={() => connect({ connector: connectors[0] })} size="lg">
          Connect MetaMask
        </Button>
      </div>
    );
  }

  if (user.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        Loading...
      </div>
    );
  }

  if (user.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-red-500">{user.error}</div>
        <Button onClick={() => disconnect()}>Disconnect</Button>
      </div>
    );
  }

  // Role-based dashboard rendering
  if (user.role === "Government") {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Government Dashboard</h2>
        <ListSubsidy />
        <Button asChild>
          <a href="/dashboard/add-subsidy">Add New Subsidy</a>
        </Button>
      </div>
    );
  }
  if (user.role === "Applicant") {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Applicant Dashboard</h2>
        {/* Applicant-specific content here */}
        <ListSubsidy />
      </div>
    );
  }
  if (user.role === "Oracle") {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Oracle Dashboard</h2>
        {/* Oracle-specific content here */}
        <ListSubsidy />
      </div>
    );
  }

  // No role found
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div>No role found for this address.</div>
      <Button onClick={() => disconnect()}>Disconnect</Button>
    </div>
  );
};

export default Page;
