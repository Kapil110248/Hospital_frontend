import { useState, useEffect } from "react";
import { Row, Col, Badge, Form, Alert } from "react-bootstrap";
import { Pill, Plus, Edit, Trash2, AlertCircle } from "../../../lib/icons";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card } from "../../common/Card";
import Button from "../../common/Button";
import DataTable from "../../common/DataTable";
import Modal from "../../common/Modal";
import { medicineService } from "../../../jsx-services/api";

export const PharmacyList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    strength: "",
    manufacturer: "",
    category: "",
    unitPrice: "",
    stockQuantity: "",
    reorderLevel: "",
    expiryDate: "",
    description: "",
  });

  const categories = [
    "Analgesics",
    "Antibiotics",
    "Antivirals",
    "Antifungals",
    "Cardiovascular",
    "Diabetes",
    "Gastrointestinal",
    "Respiratory",
    "Dermatology",
    "Vitamins & Supplements",
    "Other",
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await medicineService.getAll();
      setMedicines(data);
    } catch (err) {
      console.error("Error loading medicines:", err);
      setError("Failed to load medicines");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const medicineData = {
        name: formData.name,
        generic_name: formData.genericName,
        strength: formData.strength,
        manufacturer: formData.manufacturer,
        category: formData.category,
        unit_price: parseFloat(formData.unitPrice),
        stock_quantity: parseInt(formData.stockQuantity),
        reorder_level: parseInt(formData.reorderLevel),
        expiry_date: formData.expiryDate,
        description: formData.description,
        is_active: true,
      };

      if (editMode) {
        await medicineService.update(editingId, medicineData);
        setSuccess("Medicine updated successfully!");
      } else {
        await medicineService.create(medicineData);
        setSuccess("Medicine added successfully!");
      }

      setShowModal(false);
      loadData();
      resetForm();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving medicine:", err);
      setError(err.message || "Failed to save medicine");
    }
  };

  const handleEdit = (medicine) => {
    setEditMode(true);
    setEditingId(medicine.id);
    setFormData({
      name: medicine.name || "",
      genericName: medicine.generic_name || "",
      strength: medicine.strength || "",
      manufacturer: medicine.manufacturer || "",
      category: medicine.category || "",
      unitPrice: medicine.unit_price || "",
      stockQuantity: medicine.stock_quantity || "",
      reorderLevel: medicine.reorder_level || "",
      expiryDate: medicine.expiry_date || "",
      description: medicine.description || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?"))
      return;

    try {
      await medicineService.delete(id);
      setSuccess("Medicine deleted successfully!");
      loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting medicine:", err);
      setError(err.message || "Failed to delete medicine");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      genericName: "",
      strength: "",
      manufacturer: "",
      category: "",
      unitPrice: "",
      stockQuantity: "",
      reorderLevel: "",
      expiryDate: "",
      description: "",
    });
    setEditMode(false);
    setEditingId(null);
  };

  const getStockStatus = (medicine) => {
    const stock = medicine.stock_quantity;
    const reorder = medicine.reorder_level;

    if (stock === 0) return { label: "OUT OF STOCK", variant: "danger" };
    if (stock <= reorder) return { label: "LOW STOCK", variant: "warning" };
    return { label: "IN STOCK", variant: "success" };
  };

  const lowStockCount = medicines.filter(
    (m) => m.stock_quantity <= m.reorder_level
  ).length;

  const columns = [
    {
      header: "Brand Name",
      key: "name",
    },
    {
      header: "Generic Name",
      key: "generic_name",
    },
    {
      header: "Strength",
      key: "strength",
    },
    {
      header: "Category",
      key: "category",
    },
    {
      header: "Stock",
      render: (row) => {
        const status = getStockStatus(row);
        return (
          <span
            className={
              row.stock_quantity <= row.reorder_level
                ? "text-danger fw-bold"
                : ""
            }
          >
            {row.stock_quantity}
          </span>
        );
      },
    },
    {
      header: "Reorder Level",
      key: "reorder_level",
    },
    {
      header: "Price",
      render: (row) => `$${parseFloat(row.unit_price || 0).toFixed(2)}`,
    },
    {
      header: "Expiry",
      render: (row) => new Date(row.expiry_date).toLocaleDateString(),
    },
    {
      header: "Status",
      render: (row) => {
        const status = getStockStatus(row);
        return <Badge bg={status.variant}>{status.label}</Badge>;
      },
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="d-flex gap-1">
          <Button
            size="sm"
            variant="outline-info"
            onClick={() => handleEdit(row)}
          >
            <Edit size={14} />
          </Button>
          <Button
            size="sm"
            variant="outline-danger"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout title="Pharmacy Management">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Pharmacy Inventory</h2>
          <p className="text-muted">Manage medication stock and inventory</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus size={18} className="me-2" />
            Add Medicine
          </Button>
        </Col>
      </Row>

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {lowStockCount > 0 && (
        <Alert variant="warning" className="mb-4">
          <div className="d-flex align-items-center">
            <AlertCircle size={20} className="me-2" />
            <strong>{lowStockCount} medicine(s)</strong> are below reorder
            level!
          </div>
        </Alert>
      )}

      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card>
            <div className="text-center">
              <Pill size={32} className="text-primary mb-2" />
              <h3 className="fw-bold">{medicines.length}</h3>
              <p className="text-muted mb-0">Total Medicines</p>
            </div>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <div className="text-center">
              <Pill size={32} className="text-success mb-2" />
              <h3 className="fw-bold">
                {
                  medicines.filter((m) => m.stock_quantity > m.reorder_level)
                    .length
                }
              </h3>
              <p className="text-muted mb-0">In Stock</p>
            </div>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <div className="text-center">
              <Pill size={32} className="text-warning mb-2" />
              <h3 className="fw-bold">{lowStockCount}</h3>
              <p className="text-muted mb-0">Low Stock</p>
            </div>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <div className="text-center">
              <Pill size={32} className="text-danger mb-2" />
              <h3 className="fw-bold">
                {medicines.filter((m) => m.stock_quantity === 0).length}
              </h3>
              <p className="text-muted mb-0">Out of Stock</p>
            </div>
          </Card>
        </Col>
      </Row>

      <Card>
        <DataTable
          columns={columns}
          data={medicines}
          loading={loading}
          searchable
          pageSize={15}
        />
      </Card>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editMode ? "Edit Medicine" : "Add New Medicine"}
        size="xl"
      >
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Brand Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter brand name"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Generic Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.genericName}
                  onChange={(e) =>
                    setFormData({ ...formData, genericName: e.target.value })
                  }
                  placeholder="Enter generic name"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Strength <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.strength}
                  onChange={(e) =>
                    setFormData({ ...formData, strength: e.target.value })
                  }
                  placeholder="e.g., 500mg, 10ml"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Manufacturer</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) =>
                    setFormData({ ...formData, manufacturer: e.target.value })
                  }
                  placeholder="Enter manufacturer name"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Category <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Unit Price <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, unitPrice: e.target.value })
                  }
                  placeholder="0.00"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Stock Quantity <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    setFormData({ ...formData, stockQuantity: e.target.value })
                  }
                  placeholder="0"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Reorder Level <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  value={formData.reorderLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, reorderLevel: e.target.value })
                  }
                  placeholder="0"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Expiry Date <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                  required
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter medicine description or usage instructions..."
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2 justify-content-end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editMode ? "Update Medicine" : "Add Medicine"}
            </Button>
          </div>
        </Form>
      </Modal>
    </DashboardLayout>
  );
};

export default PharmacyList;
