import React from "react";

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, label }) => {
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 text-xs font-medium text-muted-foreground flex justify-between">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      )}
      <div className="w-full bg-secondary rounded-full h-3">
        <div
          className="bg-primary h-3 rounded-full transition-all duration-300"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};
