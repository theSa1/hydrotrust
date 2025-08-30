"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProgressBar } from "@/components/ui/progress-bar";
import MyContractABI from "@/MyContractABI.json";
import { ethers } from "ethers";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useWriteContract } from "wagmi";
import { toast } from "sonner";

export function useSubmitHydrogenData() {
  const { writeContractAsync, isPending, isSuccess, error } =
    useWriteContract();

  // Usage: await submitHydrogenData(hydrogenProduced)
  const submitHydrogenData = async (
    hydrogenProduced: number,
    contractAddress: string
  ) => {
    return await writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: MyContractABI,
      functionName: "submitHydrogenData",
      args: [hydrogenProduced],
    });
  };

  return { submitHydrogenData, isLoading: isPending, isSuccess, error };
}

export default function SubsidyContractPage() {
  const { contract } = useParams();
  const [contractName, setContractName] = useState<string>("");
  const [sliderValue, setSliderValue] = useState<number>(0);

  const { submitHydrogenData } = useSubmitHydrogenData();

  const fetchContractName = async () => {
    const res = await fetch(`/api/subsidy-name?address=${contract}`);
    const data = await res.json();
    setContractName(data.name || "");
  };

  useEffect(() => {
    fetchContractName();
  }, [contract]);

  const onSubmit = async () => {
    toast.loading("Submitting hydrogen data...");
    try {
      await submitHydrogenData(sliderValue, contract?.toString() || "");
      toast.success("Hydrogen data submitted successfully!");
    } catch (error) {
      console.error("Error submitting hydrogen data:", error);
      toast.error("Failed to submit hydrogen data.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-background p-0 md:p-8">
      <div className="max-w-5xl mx-auto py-8">
        <strong className="block mb-4 text-2xl text-foreground">
          Provide Data to Contract (For Demonstration)
        </strong>
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground">
              Provide data to smart contracts on the blockchain.
            </p>
          </div>
          <Card>
            <CardHeader className="flex items-center">
              <CardTitle>Subsidy Name : </CardTitle>
              <p>{contractName}</p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Oracle Data Provider</CardTitle>
              <CardDescription>
                This component allows you to provide data to smart contracts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Slider
                defaultValue={[33]}
                max={100}
                step={1}
                onValueChange={(value: number[]) => setSliderValue(value[0])}
              />
            </CardContent>
            <CardFooter>
              <CardAction className="w-full flex items-center justify-between">
                <Button variant="default" onClick={onSubmit}>
                  Submit Data
                </Button>
                <p>{sliderValue}/kg</p>
              </CardAction>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
