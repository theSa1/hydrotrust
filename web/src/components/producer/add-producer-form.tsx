"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AddProducerForm() {
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/government/add-producer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, name }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setMessage("Producer added successfully!");
      setAddress("");
      setName("");
    } else {
      setMessage(data.error || "Failed to add producer.");
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Add Producer</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit} autoComplete="off">
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="producer-address">Address</Label>
            <Input
              id="producer-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="0x..."
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="producer-name">Name</Label>
            <Input
              id="producer-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Producer Name"
              autoComplete="off"
            />
          </div>
          {message && (
            <div
              className={`text-sm ${
                message.includes("success") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading} className="w-full mt-5">
            {loading ? "Adding..." : "Add Producer"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
