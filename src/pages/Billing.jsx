
import { useState } from "react";
import { Plus } from "../lib/icons";
import { Button } from "../components/common/Button";

export function Billing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoices, setInvoices] = useState([
    {
      id: "1",
      invoiceNo: "INV-001",
      patientName: "John Doe",
      services: "Consultation, Lab Tests",
      amount: 1250.0,
      paid: 1250.0,
      balance: 0,
      date: "2024-10-28",
      status: "PAID",
    },
    {
      id: "2",
      invoiceNo: "INV-002",
      patientName: "Jane Smith",
      services: "MRI Scan, Consultation",
      amount: 3500.0,
      paid: 1500.0,
      balance: 2000.0,
      date: "2024-10-28",
      status: "PARTIAL",
    },
  ]);

  const [newInvoice, setNewInvoice] = useState({
    invoiceNo: "",
    patientName: "",
    services: "",
    amount: "",
    paid: "",
    date: "",
    status: "PENDING",
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";
      case "PARTIAL":
        return "bg-yellow-100 text-yellow-700";
      case "PENDING":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleCreateInvoice = (e) => {
    e.preventDefault();

    const balance =
      parseFloat(newInvoice.amount || 0) - parseFloat(newInvoice.paid || 0);

    const newEntry = {
      id: Date.now().toString(),
      ...newInvoice,
      balance,
    };

    setInvoices([...invoices, newEntry]); // ✅ Add to table
    setNewInvoice({
      invoiceNo: "",
      patientName: "",
      services: "",
      amount: "",
      paid: "",
      date: "",
      status: "PENDING",
    });
    setIsModalOpen(false); // Close modal
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Billing
          </h1>
          <p className="text-gray-600 mt-1">
            Manage invoices and payment records
          </p>
        </div>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          Create Invoice
        </Button>
      </div>

      {/* ✅ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[420px] p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Create New Invoice</h2>

            <form className="space-y-3" onSubmit={handleCreateInvoice}>
              <input
                type="text"
                placeholder="Invoice Number"
                className="w-full border rounded-lg p-2"
                value={newInvoice.invoiceNo}
                onChange={(e) =>
                  setNewInvoice({ ...newInvoice, invoiceNo: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Patient Name"
                className="w-full border rounded-lg p-2"
                value={newInvoice.patientName}
                onChange={(e) =>
                  setNewInvoice({ ...newInvoice, patientName: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Services"
                className="w-full border rounded-lg p-2"
                value={newInvoice.services}
                onChange={(e) =>
                  setNewInvoice({ ...newInvoice, services: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Amount"
                className="w-full border rounded-lg p-2"
                value={newInvoice.amount}
                onChange={(e) =>
                  setNewInvoice({ ...newInvoice, amount: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Paid"
                className="w-full border rounded-lg p-2"
                value={newInvoice.paid}
                onChange={(e) =>
                  setNewInvoice({ ...newInvoice, paid: e.target.value })
                }
              />
              <input
                type="date"
                className="w-full border rounded-lg p-2"
                value={newInvoice.date}
                onChange={(e) =>
                  setNewInvoice({ ...newInvoice, date: e.target.value })
                }
                required
              />
              <select
                className="w-full border rounded-lg p-2"
                value={newInvoice.status}
                onChange={(e) =>
                  setNewInvoice({ ...newInvoice, status: e.target.value })
                }
              >
                <option value="PENDING">Pending</option>
                <option value="PARTIAL">Partial</option>
                <option value="PAID">Paid</option>
              </select>

              <Button type="submit">Add Invoice</Button>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Invoice No</th>
              <th className="p-3">Patient</th>
              <th className="p-3">Services</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Balance</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{inv.invoiceNo}</td>
                <td className="p-3">{inv.patientName}</td>
                <td className="p-3">{inv.services}</td>
                <td className="p-3">₹{inv.amount}</td>
                <td className="p-3">₹{inv.paid}</td>
                <td className="p-3">₹{inv.balance}</td>
                <td className="p-3">{inv.date}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold ${getStatusColor(
                      inv.status
                    )}`}
                  >
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}





   

