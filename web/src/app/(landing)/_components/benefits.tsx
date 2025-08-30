import React from "react";
import { Shield, Zap, TrendingUp, Globe } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/magicui/badge";

const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: Shield,
      title: "Corruption-Resistant",
      description:
        "Multi-oracle consensus and blockchain transparency eliminate single points of failure",
      stats: "99.9% Fraud Prevention",
      badge: "Fraud Prevention",
    },
    {
      icon: Zap,
      title: "Faster Payouts",
      description:
        "Automated processing eliminates bureaucratic delays and manual intervention",
      stats: "24-48 Hour Processing",
      badge: "Speed",
    },
    {
      icon: TrendingUp,
      title: "Predictable Funding",
      description:
        "Companies receive subsidies on time, enabling better cash flow planning",
      stats: "100% On-Time Payments",
      badge: "Reliability",
    },
    {
      icon: Globe,
      title: "Scalable Framework",
      description:
        "Same model works for EV subsidies, renewable energy, and carbon credits",
      stats: "Multi-Sector Ready",
      badge: "Scalable",
    },
  ];

  return (
    <section id="benefits" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Transform India's Subsidy System
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            HydroTrust delivers measurable improvements in speed, transparency,
            and reliability
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex flex-col items-center justify-center gap-4 pb-0">
                <span className="rounded-xl bg-muted flex items-center justify-center w-16 h-16 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </span>
                <Badge text={benefit.badge} />
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle className="text-2xl mb-2">{benefit.title}</CardTitle>
                <CardDescription className="mb-6">
                  {benefit.description}
                </CardDescription>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    Key Metric
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {benefit.stats}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
