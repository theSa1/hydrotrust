"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProgressBar } from "@/components/ui/progress-bar";
import MyContractABI from "@/MyContractABI.json";
import { ethers } from "ethers";

export default function SubsidyContractPage() {
  const { contract } = useParams();
  const [contractData, setContractData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [oracleName, setOracleName] = useState<string>("");

  useEffect(() => {
    if (!contract) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use window.ethereum for provider (MetaMask or injected)
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contractInstance = new ethers.Contract(
          contract as string,
          MyContractABI,
          provider
        );
        // Example: fetch contract summary data
        const [
          company,
          government,
          oracle,
          totalProducedHydrogen,
          totalSubsidyPaid,
          contractActive,
        ] = await Promise.all([
          contractInstance.company(),
          contractInstance.government(),
          contractInstance.oracle(),
          contractInstance.totalProducedHydrogen(),
          contractInstance.totalSubsidyPaid(),
          contractInstance.contractActive(),
        ]);
        // Example: fetch all milestones
        const milestones = await contractInstance.getAllMilestones();
        setContractData({
          company,
          government,
          oracle,
          totalProducedHydrogen: totalProducedHydrogen.toString(),
          totalSubsidyPaid: totalSubsidyPaid.toString(),
          contractActive,
          milestones,
        });

        // Fetch company and oracle names from API
        const [companyRes, oracleRes] = await Promise.all([
          fetch(`/api/address-to-name?address=${company}`),
          fetch(`/api/address-to-name?address=${oracle}`),
        ]);
        const companyJson = await companyRes.json();
        const oracleJson = await oracleRes.json();
        setCompanyName(companyJson.name || company);
        setOracleName(oracleJson.name || oracle);
      } catch (err: any) {
        setError(err.message || "Failed to fetch contract data");
      }
      setLoading(false);
    };
    fetchData();
  }, [contract]);

  return (
    <div className="w-full min-h-screen bg-background p-0 md:p-8">
      <div className="max-w-5xl mx-auto py-8">
        <strong className="block mb-4 text-2xl text-foreground">
          Subsidy Contract Details
        </strong>
        {loading ? (
          <div>Loading contract data...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : contractData ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-card rounded-xl p-6 border border-border shadow-sm">
              <div>
                <span className="font-semibold text-foreground">Company:</span>{" "}
                {companyName}
                <div className="text-xs text-muted-foreground break-all">
                  {contractData.company}
                </div>
              </div>
              <div>
                <span className="font-semibold text-foreground">
                  Government:
                </span>{" "}
                {contractData.government}
              </div>
              <div>
                <span className="font-semibold text-foreground">Oracle:</span>{" "}
                {oracleName}
                <div className="text-xs text-muted-foreground break-all">
                  {contractData.oracle}
                </div>
              </div>
              <div>
                <span className="font-semibold text-foreground">
                  Total Produced Hydrogen:
                </span>{" "}
                {contractData.totalProducedHydrogen}
              </div>
              <div>
                <span className="font-semibold text-foreground">
                  Total Subsidy Paid:
                </span>{" "}
                {contractData.totalSubsidyPaid}
              </div>
              <div>
                <span className="font-semibold text-foreground">
                  Contract Active:
                </span>{" "}
                {contractData.contractActive ? "Yes" : "No"}
              </div>
            </div>
            <div>
              <strong className="block mb-4 text-2xl text-foreground">
                Milestones
              </strong>
              <div className="space-y-6">
                {contractData.milestones.length === 0 && (
                  <div className="text-gray-500">No milestones found.</div>
                )}
                {contractData.milestones.map((m: any, idx: number) => {
                  // Calculate progress and amounts
                  const hydrogenRequired = Number(
                    m.hydrogenRequired?.toString?.() ?? m.hydrogenRequired
                  );
                  const produced = Number(contractData.totalProducedHydrogen);
                  const progress = Math.min(
                    100,
                    Math.round((produced / hydrogenRequired) * 100)
                  );
                  const subsidyAmount = Number(
                    m.subsidyAmount?.toString?.() ?? m.subsidyAmount
                  );
                  const isClaimed = m.isClaimed;
                  const claimed = isClaimed ? subsidyAmount : 0;
                  const yetToClaim = isClaimed ? 0 : subsidyAmount;
                  return (
                    <div
                      key={idx}
                      className="bg-card border border-border rounded-xl shadow-sm p-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-2 mb-2">
                        <div className="text-lg font-semibold text-foreground flex items-center gap-2">
                          Milestone #{m.id?.toString?.() ?? m.id}
                          {isClaimed && (
                            <span className="ml-2 px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
                              Claimed
                            </span>
                          )}
                        </div>
                        <div className="flex-1"></div>
                        <div>
                          <span className="font-medium text-foreground">
                            Hydrogen Required:
                          </span>{" "}
                          {hydrogenRequired}
                        </div>
                        <div>
                          <span className="font-medium text-foreground">
                            Subsidy:
                          </span>{" "}
                          {subsidyAmount}
                        </div>
                      </div>
                      <ProgressBar
                        value={progress}
                        label={`Progress: ${produced} / ${hydrogenRequired}`}
                      />
                      <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-2 text-sm mt-2">
                        <div>
                          <span className="font-medium text-green-700">
                            Subsidy Claimed:
                          </span>{" "}
                          {claimed}
                        </div>
                        <div>
                          <span className="font-medium text-blue-700">
                            Yet to Claim:
                          </span>{" "}
                          {yetToClaim}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div>No contract data found.</div>
        )}
      </div>
    </div>
  );
}
