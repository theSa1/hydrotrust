"use client";

import useSWR from "swr";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Oracle, Producer } from "@/generated/prisma";
import { Button } from "../ui/button";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function OraclesList() {
  const { data, error, isLoading } = useSWR<{
    oracles: Oracle[];
  }>("/api/government/all-oracles", fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading oracles.</div>;

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Oracles</CardTitle>
        <Link href="/dashboard/oracles/add">
          <Button variant="outline">Add Oracles</Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-muted-foreground py-8 text-center">
            Loading...
          </div>
        ) : error ? (
          <div className="text-red-500 py-8 text-center">
            Error loading oracles.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.oracles?.length ? (
                data.oracles.map((oracle: any) => (
                  <TableRow key={oracle.id}>
                    <TableCell>{oracle.id}</TableCell>
                    <TableCell>{oracle.name}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {oracle.address}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center text-muted-foreground"
                  >
                    No oracles found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
