import { useState, useEffect } from "react";
import { Row, Col, Badge, Form, Alert } from "react-bootstrap";
import { Radio, Plus, Edit, Trash2, Eye } from "../../../lib/icons";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card } from "../../common/Card";
import Button from "../../common/Button";
import DataTable from "../../common/DataTable";
import Modal from "../../common/Modal";
import {
  radiologyService,
  patientService,
  staffService,
} from "../../../jsx-services/api";

export const RadiologyList = () => {
  const [radiologyOrders, setRadiologyOrders] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    scanType: "",
    bodyPart: "",
    priority: "ROUTINE",
    clinicalHistory: "",
    instructions: "",
  });

  const scanTypes = [
    "X-Ray",
    "CT Scan",
    "MRI",
    "Ultrasound",
    "Fluoroscopy",
    "Mammography",
    "PET Scan",
    "Nuclear Medicine",
    "Other",
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [radData, patData, docData] = await Promise.all([
        radiologyService.getAll(),
        patientService.getAll(),
        staffService.getDoctors(),
      ]);

      setRadiologyOrders(radData);
      setPatients(patData);
      setDoctors(docData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRadiologyOrder = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const radiologyOrderData = {
        patient_id: formData.patientId,
        doctor_id: formData.doctorId,
        scan_type: formData.scanType,
        body_part: formData.bodyPart,
        priority: formData.priority,
        clinical_history: formData.clinicalHistory,
        instructions: formData.instructions,
        status: "REQUESTED",
      };

      await radiologyService.create(radiologyOrderData);
      setSuccess("Radiology order created successfully!");
      setShowModal(false);
      loadData();
      resetForm();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error creating radiology order:", err);
      setError(err.message || "Failed to create radiology order");
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: "",
      doctorId: "",
      scanType: "",
      bodyPart: "",
      priority: "ROUTINE",
      clinicalHistory: "",
      instructions: "",
    });
  };

  const columns = [
    {
      header: "Order No",
      key: "id",
      render: (row) => `RAD-${row.id?.substring(0, 8).toUpperCase()}`,
    },
    {
      header: "Patient",
      render: (row) =>
        row.patient
          ? `${row.patient.first_name} ${row.patient.last_name}`
          : "N/A",
    },
    {
      header: "Doctor",
      render: (row) =>
        row.doctor
          ? `Dr. ${row.doctor.first_name} ${row.doctor.last_name}`
          : "N/A",
    },
    {
      header: "Scan Type",
      key: "scan_type",
    },
    {
      header: "Body Part",
      key: "body_part",
    },
    {
      header: "Priority",
      render: (row) => {
        const variants = {
          URGENT: "danger",
          ROUTINE: "primary",
          STAT: "warning",
        };
        return (
          <Badge bg={variants[row.priority] || "secondary"}>
            {row.priority}
          </Badge>
        );
      },
    },
    {
      header: "Status",
      render: (row) => {
        const variants = {
          REQUESTED: "secondary",
          SCHEDULED: "info",
          IN_PROGRESS: "warning",
          COMPLETED: "success",
          CANCELLED: "danger",
        };
        return (
          <Badge bg={variants[row.status] || "secondary"}>{row.status}</Badge>
        );
      },
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="d-flex gap-1">
          <Button size="sm" variant="outline-primary">
            <Eye size={14} />
          </Button>
          <Button size="sm" variant="outline-info">
            <Edit size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout title="Radiology">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Radiology</h2>
          <p className="text-muted">
            Manage radiology orders and imaging reports
          </p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus size={18} className="me-2" />
            Create Radiology Order
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

      <Card>
        <DataTable
          columns={columns}
          data={radiologyOrders}
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
        title="Create Radiology Order"
        size="lg"
      >
        <Form onSubmit={handleCreateRadiologyOrder}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Patient <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.patientId}
                  onChange={(e) =>
                    setFormData({ ...formData, patientId: e.target.value })
                  }
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name} - {patient.upid}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Doctor <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.doctorId}
                  onChange={(e) =>
                    setFormData({ ...formData, doctorId: e.target.value })
                  }
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.first_name} {doctor.last_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Scan Type <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.scanType}
                  onChange={(e) =>
                    setFormData({ ...formData, scanType: e.target.value })
                  }
                  required
                >
                  <option value="">Select Scan Type</option>
                  {scanTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Body Part <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.bodyPart}
                  onChange={(e) =>
                    setFormData({ ...formData, bodyPart: e.target.value })
                  }
                  placeholder="e.g., Chest, Head, Abdomen"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                >
                  <option value="ROUTINE">Routine</option>
                  <option value="URGENT">Urgent</option>
                  <option value="STAT">STAT (Immediate)</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Clinical History <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.clinicalHistory}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      clinicalHistory: e.target.value,
                    })
                  }
                  placeholder="Enter relevant clinical history..."
                  required
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Special Instructions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData({ ...formData, instructions: e.target.value })
                  }
                  placeholder="Enter any special instructions or contrast requirements..."
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
              Create Radiology Order
            </Button>
          </div>
        </Form>
      </Modal>
    </DashboardLayout>
  );
};

export default RadiologyList;
