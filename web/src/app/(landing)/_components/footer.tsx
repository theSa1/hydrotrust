import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t bg-background py-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>
          © {new Date().getFullYear()} HydroTrust. All rights reserved.
        </span>
        <span>Built at DAIICT HackOut'25</span>
      </div>
    </footer>
  );
};

export default Footer;
