"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

type SubsidyWithRelations = {
  id: number;
  name: string;
  contractAddress: string;
  government?: { address: string };
  producer?: { name: string; address: string };
  oracles?: { name: string; address: string }[];
};

export const ListSubsidy = () => {
  const [subsidies, setSubsidies] = useState<SubsidyWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

  const fetchSubsidies = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/government/list-subsidies?governmentAddress=${address}`
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
    <div className="p-5">
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
        <div>
          {subsidies.map((subsidy) => (
            <Link
              key={subsidy.id}
              href={`/dashboard/subsidies/${subsidy.contractAddress}`}
            >
              <Card className="p-4">{subsidy.name}</Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
