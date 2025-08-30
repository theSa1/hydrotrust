"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function AddOracleForm() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/government/add-oracle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, address }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setMessage("Oracle added successfully!");
      setName("");
      setAddress("");
    } else {
      setMessage(data.error || "Failed to add oracle.");
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Add Oracle</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit} autoComplete="off">
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="oracle-address">Address</Label>
            <Input
              id="oracle-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="0x..."
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oracle-name">Name</Label>
            <Input
              id="oracle-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Oracle Name"
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
            {loading ? "Adding..." : "Add Oracle"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
