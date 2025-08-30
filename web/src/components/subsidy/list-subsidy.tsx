"use client";

import { Subsidy } from "@/generated/prisma";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const ListSubsidy = () => {
  const [subsidies, setSubsidies] = useState<Subsidy[]>([]);
  const { address } = useAccount();

  const fetchSubsidies = async () => {
    const res = await fetch(
      `/api/government/list-subsidies?governmentAddress=${address}`
    );
    const data = await res.json();
    setSubsidies(data.subsidies);
  };

  useEffect(() => {
    if (!address) return;
    fetchSubsidies();
  }, [address]);

  return (
    <div>
      <h1>List of Subsidies</h1>
      <ul>
        {subsidies.map((subsidy) => (
          <li key={subsidy.id}>{subsidy.name}</li>
        ))}
      </ul>
    </div>
  );
};
