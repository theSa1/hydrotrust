import React from "react";
import { Shield, Network, FileCheck, Eye } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/magicui/badge";

const Solution: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: "Smart Contracts",
      description: "Immutable rules for subsidy per kg of hydrogen production",
      badge: "Security",
    },
    {
      icon: Network,
      title: "Multiple Oracles",
      description:
        "Independent verifiers including IoT meters, grid operators, and auditors",
      badge: "Decentralized",
    },
    {
      icon: FileCheck,
      title: "Consensus Required",
      description: "Payment only triggered when multiple oracles agree on data",
      badge: "Trustless",
    },
    {
      icon: Eye,
      title: "Audit Trail",
      description:
        "Every transaction permanently logged for complete transparency",
      badge: "Transparent",
    },
  ];

  return (
    <section id="solution" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            HydroTrust:{" "}
            <span className="text-primary">Transparency by Design</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our blockchain-based platform eliminates corruption through
            automated verification, multi-source validation, and complete
            transparency in every transaction.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex flex-col items-center justify-center gap-4 pb-0">
                <span className="rounded-xl bg-muted flex items-center justify-center w-14 h-14 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary" />
                </span>
                <Badge text={feature.badge} />
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solution;
