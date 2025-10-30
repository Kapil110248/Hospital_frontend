import { useState, useEffect } from "react";
import { Row, Col, Badge, Form } from "react-bootstrap";
import { Activity, Users, Heart, Thermometer } from "../../../lib/icons";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { StatsCard } from "../../common/Card";
import { Card } from "../../common/Card";
import DataTable from "../../common/DataTable";
import Button from "../../common/Button";
import Modal from "../../common/Modal";
import { appointmentService, patientService } from "../../../jsx-services/api";

export const NurseDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [ipdPatients, setIpdPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [vitalsData, setVitalsData] = useState({
    temperature: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    heartRate: "",
    respiratoryRate: "",
    oxygenSaturation: "",
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [appointmentData, patientData] = await Promise.all([
        appointmentService.getTodayAppointments(),
        patientService.getAll(),
      ]);

      setAppointments(appointmentData);
      setIpdPatients(patientData.filter((p) => p.status === "IPD").slice(0, 5));
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (appointmentId) => {
    try {
      await appointmentService.update(appointmentId, { status: "CHECKED_IN" });
      loadDashboardData();
    } catch (error) {
      console.error("Error checking in:", error);
    }
  };

  const handleRecordVitals = (patient) => {
    setSelectedPatient(patient);
    setShowVitalsModal(true);
  };

  const handleSaveVitals = async () => {
    try {
      console.log("Saving vitals for patient:", selectedPatient.id, vitalsData);
      setShowVitalsModal(false);
      setVitalsData({
        temperature: "",
        bloodPressureSystolic: "",
        bloodPressureDiastolic: "",
        heartRate: "",
        respiratoryRate: "",
        oxygenSaturation: "",
      });
    } catch (error) {
      console.error("Error saving vitals:", error);
    }
  };

  const appointmentColumns = [
    {
      header: "Token",
      key: "token_number",
    },
    {
      header: "Patient",
      render: (row) =>
        row.patient
          ? `${row.patient.first_name} ${row.patient.last_name}`
          : "N/A",
    },
    {
      header: "Time",
      render: (row) =>
        new Date(row.scheduled_at).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      header: "Status",
      render: (row) => {
        const variants = {
          SCHEDULED: "secondary",
          CHECKED_IN: "info",
          IN_CONSULTATION: "warning",
          COMPLETED: "success",
        };
        return (
          <Badge bg={variants[row.status] || "secondary"}>{row.status}</Badge>
        );
      },
    },
    {
      header: "Actions",
      render: (row) =>
        row.status === "SCHEDULED" && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleCheckIn(row.id)}
          >
            Check In
          </Button>
        ),
    },
  ];

  const ipdColumns = [
    {
      header: "UPID",
      key: "upid",
    },
    {
      header: "Name",
      render: (row) => `${row.first_name} ${row.last_name}`,
    },
    {
      header: "Age",
      key: "age",
    },
    {
      header: "Actions",
      render: (row) => (
        <Button
          size="sm"
          variant="outline-info"
          onClick={() => handleRecordVitals(row)}
        >
          <Heart size={14} className="me-1" />
          Record Vitals
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout title="Nurse Dashboard">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Nurse's Dashboard</h2>
          <p className="text-muted">Patient care and vital signs management</p>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col md={6} xl={3}>
          <StatsCard
            title="Today's Appointments"
            value={appointments.length}
            icon={Activity}
            bgColor="primary"
          />
        </Col>
        <Col md={6} xl={3}>
          <StatsCard
            title="IPD Patients"
            value={ipdPatients.length}
            icon={Users}
            bgColor="info"
          />
        </Col>
        <Col md={6} xl={3}>
          <StatsCard
            title="Checked In"
            value={appointments.filter((a) => a.status === "CHECKED_IN").length}
            icon={Heart}
            bgColor="success"
          />
        </Col>
        <Col md={6} xl={3}>
          <StatsCard
            title="Pending Check-In"
            value={appointments.filter((a) => a.status === "SCHEDULED").length}
            icon={Thermometer}
            bgColor="warning"
          />
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card title="Today's Appointments">
            <DataTable
              columns={appointmentColumns}
              data={appointments}
              loading={loading}
              searchable={false}
              pageSize={10}
            />
          </Card>
        </Col>

        <Col lg={4}>
          <Card title="Quick Actions">
            <div className="d-grid gap-2">
              <Button
                variant="outline-primary"
                onClick={() => navigate("/patients")}
              >
                <Heart size={18} className="me-2" />
                Record Vitals
              </Button>
              <Button
                variant="outline-success"
                onClick={() => navigate("/prescriptions")}
              >
                <Activity size={18} className="me-2" />
                Medication Round
              </Button>
              <Button
                variant="outline-info"
                onClick={() => navigate("/patients")}
              >
                <Users size={18} className="me-2" />
                Patient Handover
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={12}>
          <Card title="IPD Patients - Vital Signs">
            <DataTable
              columns={ipdColumns}
              data={ipdPatients}
              loading={loading}
              searchable={false}
              pageSize={5}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        show={showVitalsModal}
        onHide={() => setShowVitalsModal(false)}
        title={`Record Vitals - ${selectedPatient?.first_name} ${selectedPatient?.last_name}`}
        size="lg"
      >
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Temperature (°C)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  value={vitalsData.temperature}
                  onChange={(e) =>
                    setVitalsData({
                      ...vitalsData,
                      temperature: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>BP Systolic</Form.Label>
                <Form.Control
                  type="number"
                  value={vitalsData.bloodPressureSystolic}
                  onChange={(e) =>
                    setVitalsData({
                      ...vitalsData,
                      bloodPressureSystolic: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>BP Diastolic</Form.Label>
                <Form.Control
                  type="number"
                  value={vitalsData.bloodPressureDiastolic}
                  onChange={(e) =>
                    setVitalsData({
                      ...vitalsData,
                      bloodPressureDiastolic: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Heart Rate (bpm)</Form.Label>
                <Form.Control
                  type="number"
                  value={vitalsData.heartRate}
                  onChange={(e) =>
                    setVitalsData({ ...vitalsData, heartRate: e.target.value })
                  }
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Respiratory Rate</Form.Label>
                <Form.Control
                  type="number"
                  value={vitalsData.respiratoryRate}
                  onChange={(e) =>
                    setVitalsData({
                      ...vitalsData,
                      respiratoryRate: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Oxygen Saturation (%)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  value={vitalsData.oxygenSaturation}
                  onChange={(e) =>
                    setVitalsData({
                      ...vitalsData,
                      oxygenSaturation: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2 justify-content-end">
            <Button
              variant="secondary"
              onClick={() => setShowVitalsModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveVitals}>
              Save Vitals
            </Button>
          </div>
        </Form>
      </Modal>
    </DashboardLayout>
  );
};

export default NurseDashboard;
