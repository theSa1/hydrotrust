import SubsidyWizard from "@/components/subsidy/subsidy-wizard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Page = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Add New Subsidy</h2>
        <p className="text-muted-foreground">
          Create a new subsidy program for your beneficiaries.
        </p>
      </div>

      <SubsidyWizard />
    </div>
  );
};

export default Page;
