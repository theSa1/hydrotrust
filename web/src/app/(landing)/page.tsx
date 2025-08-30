"use client";

import { Button } from "@/components/ui/button";
import { Header } from "./_components/header";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Badge } from "@/components/magicui/badge";
import { Safari } from "@/components/magicui/safari";
import { WobbleCard } from "@/components/ui/wobble-card";
import { AlertTriangle, Clock, Eye, Target, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import Solution from "./_components/solution";
import Benefits from "./_components/benefits";

const Page = () => {
  return (
    <main>
      <Header />

      <section
        id="home"
        className="min-h-screen container mx-auto flex flex-col-reverse md:flex-row items-center justify-center gap-8 md:gap-16 px-5 md:px-0 pt-32 md:pt-0"
      >
        <BackgroundBeams />
        <Safari className="w-3xl" url="www.hydrotrust.com" />
        <div className="z-20 text-center md:text-left w-full max-w-xl">
          <Badge text="BlockChain X Green Hydrogen" />
          <h1 className="text-4xl md:text-5xl font-bold z-10 leading-tight md:leading-[1.1]">
            Corruption-Free Subsidy Disbursement for Green Hydrogen
          </h1>
          <p className="mt-6 md:mt-10 text-gray-400 z-10 max-w-2xl text-lg md:text-xl mx-auto md:mx-0">
            Smart Contracts + Multiple Oracles = Transparent, Automated, and
            Reliable Funding
          </p>
          <div className="flex gap-4 mt-8 md:mt-10 z-10 items-center justify-center md:justify-start">
            <Button
              onClick={() => {
                const el = document.getElementById("join-waitlist");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="w-max"
            >
              Join Waitlist
            </Button>
            <Button
              className="w-max"
              variant="outline"
              onClick={() => {
                const el = document.getElementById("problem");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <section
        id="problem"
        className="container mx-auto my-24 md:my-32 text-center px-5"
      >
        <div className="w-16 h-16 bg-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-100" />
        </div>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          The Hidden Cost of Corruption
        </h2>
        <p className="text-gray-400 mb-10 md:mb-14 max-w-2xl mx-auto text-base md:text-lg">
          Current subsidy systems are plagued by inefficiencies and
          vulnerabilities that cost India billions in lost productivity and
          misallocated resources.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          <WobbleCard containerClassName="bg-pink-800">
            {/* <p className="text-6xl mb-2">💳</p> */}
            <Clock className="h-12 w-12 mb-4 mx-auto" />
            <h3 className="text-2xl font-semibold mb-2">Manual Approvals</h3>
            <p>
              Lengthy bureaucratic processes cause delays for startups and
              producers
            </p>
          </WobbleCard>

          <WobbleCard containerClassName="bg-orange-800">
            <Eye className="h-12 w-12 mb-4 mx-auto" />
            <h3 className="text-2xl font-semibold mb-2">Opaque Processes</h3>
            <p>
              Lack of transparency makes it easy to hide misuse and corruption
            </p>
          </WobbleCard>

          <WobbleCard>
            <Users className="h-12 w-12 mb-4 mx-auto" />
            <h3 className="text-2xl font-semibold mb-2">
              Government-Company Collusion
            </h3>
            <p>
              Direct relationships can lead to unfair payouts and favoritism
            </p>
          </WobbleCard>

          <WobbleCard>
            <Target className="h-12 w-12 mb-4 mx-auto" />
            <h3 className="text-2xl font-semibold mb-2">Single Oracle Risk</h3>
            <p>
              Reliance on one data source creates opportunities for manipulation
            </p>
          </WobbleCard>
        </div>
      </section>

      <section
        id="problem"
        className="container mx-auto my-24 md:my-32 text-center px-5"
      >
        <Card className="p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold">₹</span>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              The Cost of Corruption in India's Subsidy System
            </h3>
            <p className="text-primary/70 mb-6 max-w-2xl mx-auto">
              Billions of rupees in subsidies are lost annually due to
              corruption, manipulation, and inefficient processes. This directly
              impacts India's clean energy goals and the growth of the green
              hydrogen sector.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="text-2xl font-bold text-red-400 mb-1">
                  ₹2000+ Cr
                </div>
                <div className="text-sm text-gray-400">
                  Annual subsidy leakage
                </div>
              </div>
              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-400 mb-1">
                  6-12 months
                </div>
                <div className="text-sm text-gray-400">
                  Average approval delay
                </div>
              </div>
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  40%
                </div>
                <div className="text-sm text-gray-400">
                  Projects affected by delays
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <Solution />

      <Benefits />
    </main>
  );
};

export default Page;
