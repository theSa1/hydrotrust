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
import { Producer } from "@/generated/prisma";
import { Button } from "../ui/button";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProducersList() {
  const { data, error, isLoading } = useSWR<{ producers: Producer[] }>(
    "/api/government/all-producers",
    fetcher
  );

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Producers</CardTitle>
        <Link href="/dashboard/producers/add">
          <Button variant="outline">Add Producer</Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-muted-foreground py-8 text-center">
            Loading...
          </div>
        ) : error ? (
          <div className="text-red-500 py-8 text-center">
            Error loading producers.
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
              {data?.producers?.length ? (
                data.producers.map((producer: any) => (
                  <TableRow key={producer.id}>
                    <TableCell>{producer.id}</TableCell>
                    <TableCell>{producer.name}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {producer.address}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center text-muted-foreground"
                  >
                    No producers found.
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
