"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  useWaitForTransactionReceipt,
  useAccount,
  useDeployContract,
} from "wagmi";
import contractABI from "../../MyContractABI.json";
import { Oracle, Producer } from "@/generated/prisma";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Milestone = {
  id: string;
  amount: number;
  production: number;
};

type SubsidyForm = {
  name: string;
  applicant: string;
  description: string;
  expiryDate: string;
  milestones: Milestone[];
  selectedOracles: Oracle[];
};

function currency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(isFinite(n) ? n : 0);
}

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto)
    return crypto.randomUUID();
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function SubsidyWizard() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [submitting, setSubmitting] = useState(false);
  const [deployedContractAddress, setDeployedContractAddress] =
    useState<string>("");
  const [contractBytecode, setContractBytecode] = useState<string>("");

  const { address, isConnected } = useAccount();

  // Contract deployment hook
  const {
    data: deployHash,
    deployContract,
    isPending: isDeployPending,
    error: deployError,
  } = useDeployContract();

  const {
    isLoading: isDeployConfirming,
    isSuccess: isDeployConfirmed,
    data: deployReceipt,
  } = useWaitForTransactionReceipt({
    hash: deployHash,
  });

  // Mock oracles data - in a real app, this would come from an API
  const [availableOracles, setAvailableOracles] = useState<Oracle[]>([]);
  const [availableApplicants, setAvailableApplicants] = useState<Producer[]>(
    []
  );

  const [data, setData] = useState<SubsidyForm>({
    name: "",
    applicant: "",
    description: "",
    expiryDate: "",
    milestones: [{ id: uuid(), amount: 0, production: 0 }],
    selectedOracles: [],
  });

  const fetchContractBytecode = async () => {
    const res = await fetch("/MyContractBytecode.txt");
    const bytecode = await res.text();
    setContractBytecode(bytecode);
  };

  const fetchAvailableOracles = async () => {
    const res = await fetch("/api/government/all-oracles");
    const data = await res.json();
    setAvailableOracles(data.oracles);
  };

  const fetchAvailableProducers = async () => {
    const res = await fetch("/api/government/all-producers");
    const data = await res.json();
    setAvailableApplicants(data.producers);
  };

  useEffect(() => {
    fetchContractBytecode();
    fetchAvailableOracles();
    fetchAvailableProducers();
  }, []);

  function deploySubsidyContract(applicantAddress: string) {
    if (!data.selectedOracles.length) {
      toast.error("No oracle selected", {
        description: "Please select at least one oracle before deploying.",
      });
      return;
    }

    if (!data.milestones.length) {
      toast.error("No milestones", {
        description: "Please add at least one milestone before deploying.",
      });
      return;
    }

    // Use the first selected oracle for deployment
    const selectedOracle = data.selectedOracles[0];

    // Prepare milestone arrays for contract deployment
    const hydrogenAmounts = data.milestones.map((m) => BigInt(m.production));
    const subsidyAmounts = data.milestones.map((m) =>
      BigInt(Math.floor(m.amount * 100))
    );

    deployContract({
      abi: contractABI,
      bytecode: contractBytecode as `0x${string}`,
      args: [
        applicantAddress,
        selectedOracle.address as `0x${string}`, // oracle address
        hydrogenAmounts, // array of hydrogen requirements
        subsidyAmounts, // array of subsidy amounts
      ],
    });
  }

  const updateContractDataOnServer = async (contractAddress: string) => {
    try {
      const res = await fetch("/api/government/add-subsidy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          contractAddress,
          governmentAddress: address,
          producerAddress: data.applicant,
          oracles: data.selectedOracles.map((o) => o.address),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update contract data");
      }

      const resData = await res.json();
      console.log("Contract data updated successfully:", resData);
    } catch (error) {
      console.error("Error updating contract data on server:", error);
    }
  };

  // Handle successful contract deployment
  useEffect(() => {
    if (isDeployConfirmed && deployReceipt?.contractAddress) {
      setDeployedContractAddress(deployReceipt.contractAddress);

      updateContractDataOnServer(deployReceipt.contractAddress);

      toast.success("Subsidy created successfully!", {
        description: `Contract deployed with ${
          data.milestones.length
        } milestone${data.milestones.length !== 1 ? "s" : ""}. Address: ${
          deployReceipt.contractAddress
        }`,
      });

      // Reset form
      resetForm();
      setSubmitting(false);
    }
  }, [isDeployConfirmed, deployReceipt, data.milestones.length]);

  // Handle deployment errors
  useEffect(() => {
    if (deployError) {
      console.error("Deployment failed:", deployError);
      toast.error("Contract deployment failed", {
        description:
          deployError.message ||
          "Please check your wallet connection and try again.",
      });
      setSubmitting(false);
    }
  }, [deployError]);

  function resetForm() {
    setStep(0);
    setData({
      name: "",
      applicant: "",
      description: "",
      expiryDate: "",
      milestones: [
        {
          id: uuid(),
          amount: 0,
          production: 0,
        },
      ],
      selectedOracles: [],
    });
  }

  const detailsValid =
    data.name.trim().length > 2 &&
    data.applicant.trim().length > 1 &&
    data.expiryDate.trim().length > 0;

  const milestonesValid =
    data.milestones.length > 0 &&
    data.milestones.every((m) => !!m.amount && Number(m.amount) > 0);

  const oraclesValid = data.selectedOracles.length > 0;

  const canNext =
    step === 0
      ? detailsValid
      : step === 1
      ? milestonesValid
      : step === 2
      ? oraclesValid
      : true;

  function update<K extends keyof SubsidyForm>(key: K, value: SubsidyForm[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function updateMilestone(id: string, patch: Partial<Milestone>) {
    setData((d) => ({
      ...d,
      milestones: d.milestones.map((m) =>
        m.id === id ? { ...m, ...patch } : m
      ),
    }));
  }

  function addMilestone() {
    setData((d) => ({
      ...d,
      milestones: [
        ...d.milestones,
        { id: uuid(), title: "", dueDate: "", amount: 0, production: 0 },
      ],
    }));
  }

  function removeMilestone(id: string) {
    setData((d) => ({
      ...d,
      milestones: d.milestones.filter((m) => m.id !== id),
    }));
  }

  function toggleOracleSelection(oracleId: number) {
    const oracle = availableOracles.find((o) => o.id === oracleId);
    if (!oracle) return;

    setData((d) => {
      const isCurrentlySelected = d.selectedOracles.some(
        (o) => o.id === oracleId
      );

      if (isCurrentlySelected) {
        // Remove oracle
        return {
          ...d,
          selectedOracles: d.selectedOracles.filter((o) => o.id !== oracleId),
        };
      } else {
        // Add oracle
        return {
          ...d,
          selectedOracles: [
            ...d.selectedOracles,
            { ...oracle, isSelected: true },
          ],
        };
      }
    });
  }

  async function onSubmit() {
    // Validation checks
    if (!isConnected) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet before submitting.",
      });
      return;
    }

    if (data.milestones.length === 0) {
      toast.error("No milestones to create", {
        description: "Please add at least one milestone before submitting.",
      });
      return;
    }

    if (data.selectedOracles.length === 0) {
      toast.error("No oracle selected", {
        description: "Please select at least one oracle before submitting.",
      });
      return;
    }

    const hasInvalidMilestones = data.milestones.some(
      (m) => !m.amount || m.amount <= 0 || !m.production || m.production <= 0
    );

    if (hasInvalidMilestones) {
      toast.error("Invalid milestone data", {
        description:
          "All milestones must have valid amounts and production targets.",
      });
      return;
    }

    setSubmitting(true);

    // Deploy the contract with all milestones
    deploySubsidyContract(data.applicant as `0x${string}`);

    toast.info("Deploying subsidy contract...", {
      description: "Please confirm the contract deployment in your wallet.",
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-pretty">Create Subsidy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <WizardStep index={0} current={step} title="Details" />
            <WizardStep index={1} current={step} title="Milestones" />
            <WizardStep index={2} current={step} title="Oracles" />
            <WizardStep index={3} current={step} title="Review" />
          </div>
        </CardContent>
      </Card>

      {step === 0 && (
        <Card aria-labelledby="subsidy-details-title">
          <CardHeader>
            <CardTitle id="subsidy-details-title" className="text-pretty">
              Subsidy details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="name">Subsidy name</Label>
              <Input
                id="name"
                placeholder="e.g. Solar Expansion FY25"
                value={data.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicant">Applicant / Producer</Label>
              <Select
                defaultValue={data.applicant}
                onValueChange={(value) => update("applicant", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an applicant" />
                </SelectTrigger>
                <SelectContent>
                  {availableApplicants.map((producer) => (
                    <SelectItem key={producer.address} value={producer.address}>
                      {producer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Subsidy Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={data.expiryDate}
                onChange={(e) => update("expiryDate", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Add context or criteria for this subsidy..."
                value={data.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {detailsValid
                ? "Looks good."
                : "Fill out required fields to continue."}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" disabled>
                Back
              </Button>
              <Button disabled={!canNext} onClick={() => setStep(1)}>
                Continue
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {step === 1 && (
        <Card aria-labelledby="milestones-title">
          <CardHeader>
            <CardTitle id="milestones-title" className="text-pretty">
              Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-muted-foreground"></div>
              <div className="text-sm text-muted-foreground">
                Enter all milestone details below.
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[44%]">Amount</TableHead>
                    <TableHead className="w-[44%]">
                      Hydrogen production (in kg)
                    </TableHead>
                    <TableHead className="w-[12%]">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.milestones.map((m, idx) => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <Input
                          aria-label={`Milestone ${idx + 1} amount`}
                          type="number"
                          min={0}
                          value={Number.isFinite(m.amount) ? m.amount : 0}
                          onChange={(e) =>
                            updateMilestone(m.id, {
                              amount: Number(e.target.value),
                            })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          aria-label={`Milestone ${
                            idx + 1
                          } hydrogen production (in kg)`}
                          type="number"
                          min={0}
                          value={
                            Number.isFinite(m.production) ? m.production : 0
                          }
                          onChange={(e) =>
                            updateMilestone(m.id, {
                              production: Number(e.target.value),
                            })
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMilestone(m.id)}
                          disabled={data.milestones.length === 1}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="secondary" onClick={addMilestone}>
                Add milestone
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Button variant="secondary" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button disabled={!canNext} onClick={() => setStep(2)}>
              Continue
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card aria-labelledby="oracles-title">
          <CardHeader>
            <CardTitle id="oracles-title" className="text-pretty">
              Select Oracles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Choose one or more oracles to validate production data for this
              subsidy. Multiple oracles provide better security and reliability.
            </div>

            <div className="space-y-3">
              {availableOracles.map((oracle) => {
                const isSelected = data.selectedOracles.some(
                  (o) => o.id === oracle.id
                );
                return (
                  <div
                    key={oracle.id}
                    className={`flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    onClick={() => toggleOracleSelection(oracle.id)}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOracleSelection(oracle.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{oracle.name}</div>
                        <div className="text-xs text-muted-foreground mt-2 font-mono">
                          {oracle.address}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {data.selectedOracles.length > 0 && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-800 mb-2">
                  Selected Oracles ({data.selectedOracles.length})
                </div>
                <div className="space-y-1">
                  {data.selectedOracles.map((oracle) => (
                    <div key={oracle.id} className="text-sm text-green-700">
                      • {oracle.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {oraclesValid
                ? `${data.selectedOracles.length} oracle${
                    data.selectedOracles.length !== 1 ? "s" : ""
                  } selected.`
                : "Select at least one oracle to continue."}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button disabled={!canNext} onClick={() => setStep(3)}>
                Continue
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <Card aria-labelledby="review-title">
          <CardHeader>
            <CardTitle id="review-title" className="text-pretty">
              Review & Submit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Field label="Subsidy name" value={data.name} />
              <Field label="Applicant" value={data.applicant} />
              <Field
                label="Expiry date"
                value={
                  data.expiryDate
                    ? new Date(data.expiryDate).toLocaleDateString()
                    : "—"
                }
              />
            </div>

            {data.description ? (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Description
                  </div>
                  <div className="font-normal text-sm leading-relaxed">
                    {data.description}
                  </div>
                </div>
              </>
            ) : null}

            <Separator />
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Milestones</div>
              {data.milestones.length > 0 ? (
                <div className="space-y-2">
                  {data.milestones.map((m) => (
                    <p key={m.id} className="text-sm">
                      {currency(m.amount)} granted for {m.production} kg
                    </p>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No milestones added
                </div>
              )}
            </div>

            <Separator />
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Selected Oracles
              </div>
              {data.selectedOracles.length > 0 ? (
                <div className="space-y-2">
                  {data.selectedOracles.map((oracle) => (
                    <div
                      key={oracle.id}
                      className="text-sm border rounded-lg p-3 bg-gray-50"
                    >
                      <div className="font-medium">{oracle.name}</div>
                      <div className="text-muted-foreground text-xs font-mono mt-1">
                        {oracle.address}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No oracles selected
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Button variant="secondary" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button
              disabled={
                submitting ||
                isDeployPending ||
                isDeployConfirming ||
                !milestonesValid ||
                !detailsValid ||
                !oraclesValid
              }
              onClick={onSubmit}
            >
              {submitting || isDeployPending || isDeployConfirming
                ? "Deploying contract..."
                : "Submit subsidy"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-medium">{value || "—"}</div>
    </div>
  );
}

function WizardStep({
  index,
  current,
  title,
}: {
  index: number;
  current: number;
  title: string;
}) {
  const active = index === current;
  const done = index < current;
  return (
    <div
      className={`flex items-center gap-3 rounded-md border p-3 ${
        active ? "border-foreground" : "border-border"
      }`}
      aria-current={active ? "step" : undefined}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
          done
            ? "bg-emerald-600 text-white"
            : active
            ? "bg-foreground text-background"
            : "bg-muted"
        }`}
      >
        {index + 1}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">
          {index === 0 && "Basic information"}
          {index === 1 && "Add, edit, and balance milestones"}
          {index === 2 && "Select validation oracles"}
          {index === 3 && "Confirm and submit"}
        </div>
      </div>
    </div>
  );
}
