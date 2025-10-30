import { useState, useEffect } from "react";
import { Row, Col, Badge } from "react-bootstrap";
import { Calendar, UserPlus, Users, Clock } from "../../../lib/icons";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { StatsCard } from "../../common/Card";
import { Card } from "../../common/Card";
import DataTable from "../../common/DataTable";
import Button from "../../common/Button";
import Modal from "../../common/Modal";
import PatientRegistrationForm from "../../forms/PatientRegistrationForm";
import { appointmentService, patientService } from "../../../jsx-services/api";

export const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

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
      setPatients(patientData.slice(0, 10));
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSuccess = () => {
    setShowPatientModal(false);
    loadDashboardData();
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
      header: "Doctor",
      render: (row) =>
        row.doctor
          ? `Dr. ${row.doctor.first_name} ${row.doctor.last_name}`
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
          CANCELLED: "danger",
        };
        return (
          <Badge bg={variants[row.status] || "secondary"}>{row.status}</Badge>
        );
      },
    },
  ];

  const patientColumns = [
    {
      header: "UPID",
      key: "upid",
    },
    {
      header: "Name",
      render: (row) => `${row.first_name} ${row.last_name}`,
    },
    {
      header: "Phone",
      key: "phone",
    },
    {
      header: "Status",
      render: (row) => <Badge bg="primary">{row.status}</Badge>,
    },
  ];

  return (
    <DashboardLayout title="Receptionist Dashboard">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Reception Desk</h2>
          <p className="text-muted">
            Manage patient registrations and appointments
          </p>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button variant="primary" onClick={() => setShowPatientModal(true)}>
            <UserPlus size={18} className="me-2" />
            Register Patient
          </Button>
          <Button
            variant="success"
            onClick={() => setShowAppointmentModal(true)}
          >
            <Calendar size={18} className="me-2" />
            Book Appointment
          </Button>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col md={6} xl={3}>
          <StatsCard
            title="Today's Appointments"
            value={appointments.length}
            icon={Calendar}
            bgColor="primary"
          />
        </Col>
        <Col md={6} xl={3}>
          <StatsCard
            title="Total Patients"
            value={patients.length}
            icon={Users}
            bgColor="info"
          />
        </Col>
        <Col md={6} xl={3}>
          <StatsCard
            title="Waiting"
            value={appointments.filter((a) => a.status === "CHECKED_IN").length}
            icon={Clock}
            bgColor="warning"
          />
        </Col>
        <Col md={6} xl={3}>
          <StatsCard
            title="Completed"
            value={appointments.filter((a) => a.status === "COMPLETED").length}
            icon={Calendar}
            bgColor="success"
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
              searchable
              pageSize={10}
            />
          </Card>
        </Col>

        <Col lg={4}>
          <Card title="Quick Actions">
            <div className="d-grid gap-2">
              <Button
                variant="outline-primary"
                onClick={() => setShowPatientModal(true)}
              >
                <UserPlus size={18} className="me-2" />
                Register New Patient
              </Button>
              <Button
                variant="outline-success"
                onClick={() => setShowAppointmentModal(true)}
              >
                <Calendar size={18} className="me-2" />
                Book Appointment
              </Button>
              <Button
                variant="outline-info"
                onClick={() => navigate("/patients")}
              >
                <Users size={18} className="me-2" />
                Search Patient
              </Button>
            </div>
          </Card>

          <Card title="Queue Status" className="mt-3">
            <div className="d-flex flex-column gap-2">
              <div className="d-flex justify-content-between p-2 bg-light rounded">
                <span>Waiting</span>
                <Badge bg="warning">
                  {appointments.filter((a) => a.status === "CHECKED_IN").length}
                </Badge>
              </div>
              <div className="d-flex justify-content-between p-2 bg-light rounded">
                <span>In Consultation</span>
                <Badge bg="info">
                  {
                    appointments.filter((a) => a.status === "IN_CONSULTATION")
                      .length
                  }
                </Badge>
              </div>
              <div className="d-flex justify-content-between p-2 bg-light rounded">
                <span>Completed</span>
                <Badge bg="success">
                  {appointments.filter((a) => a.status === "COMPLETED").length}
                </Badge>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={12}>
          <Card title="Recent Patients">
            <DataTable
              columns={patientColumns}
              data={patients}
              loading={loading}
              searchable
              pageSize={10}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        show={showPatientModal}
        onHide={() => setShowPatientModal(false)}
        title="Register New Patient"
        size="xl"
      >
        <PatientRegistrationForm
          onSuccess={handlePatientSuccess}
          onCancel={() => setShowPatientModal(false)}
        />
      </Modal>

      <Modal
        show={showAppointmentModal}
        onHide={() => setShowAppointmentModal(false)}
        title="Book Appointment"
        size="lg"
      >
        <div className="p-4 text-center">
          <p>Appointment booking form will be here</p>
          <Button onClick={() => setShowAppointmentModal(false)}>Close</Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default ReceptionistDashboard;
