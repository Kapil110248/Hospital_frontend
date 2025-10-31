import { useState } from "react";
import { Button } from "../common/Button";

export function ProcessPayrollModal({ isOpen, onClose }) {
  const [isProcessing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handleProcess = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      alert("Payroll processed successfully!");
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Process Payroll</h2>
        <p className="text-gray-700 mb-4">
          This will calculate and release salaries for all employees for this
          month.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleProcess}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
}
