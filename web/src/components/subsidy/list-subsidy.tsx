"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useUserStore } from "@/app/state/user";

type SubsidyWithRelations = {
  id: number;
  name: string;
  contractAddress: string;
  description: string;
  government?: { address: string };
  producer?: { name: string; address: string };
  oracles?: { name: string; address: string }[];
};

export const ListSubsidy = () => {
  const [subsidies, setSubsidies] = useState<SubsidyWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();
  const user = useUserStore();

  const fetchSubsidies = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/government/list-subsidies?role=${user.role}&address=${address}`
    );
    const data = await res.json();
    setSubsidies(data.subsidies || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!address) return;
    fetchSubsidies();
  }, [address]);

  return (
    <div>
      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : subsidies.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center">
          No subsidies found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subsidies.map((subsidy) => (
            <Link
              key={subsidy.id}
              href={
                user.role != "Oracle"
                  ? `/dashboard/subsidies/${subsidy.contractAddress}`
                  : `/dashboard/subsidies/oracle/${subsidy.contractAddress}`
              }
            >
              <Card>
                <CardHeader>
                  <CardTitle>{subsidy.name}</CardTitle>
                  <CardDescription>{subsidy.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
