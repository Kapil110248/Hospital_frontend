import { useState, useEffect } from "react";
import { Row, Col, Badge, Form, Alert } from "react-bootstrap";
import { FlaskConical, Plus, Edit, Trash2, Eye } from "../../../lib/icons";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card } from "../../common/Card";
import Button from "../../common/Button";
import DataTable from "../../common/DataTable";
import Modal from "../../common/Modal";
import {
  labService,
  patientService,
  staffService,
} from "../../../jsx-services/api";

export const LaboratoryList = () => {
  const [labOrders, setLabOrders] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    testType: "",
    testName: "",
    priority: "ROUTINE",
    notes: "",
  });

  const testTypes = [
    "Blood Test",
    "Urine Test",
    "Stool Test",
    "X-Ray",
    "CT Scan",
    "MRI",
    "Ultrasound",
    "ECG",
    "Other",
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [labData, patData, docData] = await Promise.all([
        labService.getAll(),
        patientService.getAll(),
        staffService.getDoctors(),
      ]);

      setLabOrders(labData);
      setPatients(patData);
      setDoctors(docData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLabOrder = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const labOrderData = {
        patient_id: formData.patientId,
        doctor_id: formData.doctorId,
        test_type: formData.testType,
        test_name: formData.testName,
        priority: formData.priority,
        notes: formData.notes,
        status: "REQUESTED",
      };

      await labService.create(labOrderData);
      setSuccess("Lab order created successfully!");
      setShowModal(false);
      loadData();
      resetForm();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error creating lab order:", err);
      setError(err.message || "Failed to create lab order");
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: "",
      doctorId: "",
      testType: "",
      testName: "",
      priority: "ROUTINE",
      notes: "",
    });
  };

  const columns = [
    {
      header: "Order No",
      key: "id",
      render: (row) => `LAB-${row.id?.substring(0, 8).toUpperCase()}`,
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
      header: "Test Type",
      key: "test_type",
    },
    {
      header: "Test Name",
      key: "test_name",
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
          SAMPLE_COLLECTED: "info",
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
    <DashboardLayout title="Laboratory">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Laboratory</h2>
          <p className="text-muted">Manage lab test orders and results</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus size={18} className="me-2" />
            Create Lab Order
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
          data={labOrders}
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
        title="Create Lab Order"
        size="lg"
      >
        <Form onSubmit={handleCreateLabOrder}>
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
                  Test Type <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.testType}
                  onChange={(e) =>
                    setFormData({ ...formData, testType: e.target.value })
                  }
                  required
                >
                  <option value="">Select Test Type</option>
                  {testTypes.map((type) => (
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
                  Test Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.testName}
                  onChange={(e) =>
                    setFormData({ ...formData, testName: e.target.value })
                  }
                  placeholder="e.g., Complete Blood Count"
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
                <Form.Label>Clinical Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Enter clinical notes or special instructions..."
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
              Create Lab Order
            </Button>
          </div>
        </Form>
      </Modal>
    </DashboardLayout>
  );
};

export default LaboratoryList;
