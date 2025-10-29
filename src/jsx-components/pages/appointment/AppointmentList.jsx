import { useState, useEffect } from 'react';
import { Row, Col, Badge, Form } from 'react-bootstrap';
import { Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Card } from '../../common/Card';
import Button from '../../common/Button';
import DataTable from '../../common/DataTable';
import Modal from '../../common/Modal';
import { appointmentService, patientService, staffService } from '../../../jsx-services/api';

export const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    scheduledAt: '',
    duration: 30,
    type: 'CONSULTATION',
    reason: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appointmentData, patientData, doctorData] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        staffService.getDoctors(),
      ]);

      setAppointments(appointmentData);
      setPatients(patientData);
      setDoctors(doctorData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
      await appointmentService.create({
        patient_id: formData.patientId,
        doctor_id: formData.doctorId,
        scheduled_at: formData.scheduledAt,
        duration: parseInt(formData.duration),
        type: formData.type,
        reason: formData.reason,
        status: 'SCHEDULED',
      });
      setShowModal(false);
      loadData();
      setFormData({
        patientId: '',
        doctorId: '',
        scheduledAt: '',
        duration: 30,
        type: 'CONSULTATION',
        reason: '',
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  const columns = [
    {
      header: 'Token',
      key: 'token_number',
    },
    {
      header: 'Patient',
      render: (row) =>
        row.patient ? `${row.patient.first_name} ${row.patient.last_name}` : 'N/A',
    },
    {
      header: 'Doctor',
      render: (row) =>
        row.doctor ? `Dr. ${row.doctor.first_name} ${row.doctor.last_name}` : 'N/A',
    },
    {
      header: 'Date & Time',
      render: (row) => new Date(row.scheduled_at).toLocaleString('en-US', {
        dateStyle: 'short',
        timeStyle: 'short'
      }),
    },
    {
      header: 'Type',
      key: 'type',
    },
    {
      header: 'Status',
      render: (row) => {
        const variants = {
          SCHEDULED: 'secondary',
          CHECKED_IN: 'info',
          IN_CONSULTATION: 'warning',
          COMPLETED: 'success',
          CANCELLED: 'danger',
          NO_SHOW: 'dark',
        };
        return <Badge bg={variants[row.status] || 'secondary'}>{row.status}</Badge>;
      },
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="d-flex gap-1">
          <Button size="sm" variant="outline-primary">
            <Edit size={14} />
          </Button>
          <Button size="sm" variant="outline-danger">
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout title="Appointments">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Appointments</h2>
          <p className="text-muted">Manage patient appointments and schedules</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus size={18} className="me-2" />
            Book Appointment
          </Button>
        </Col>
      </Row>

      <Card>
        <DataTable
          columns={columns}
          data={appointments}
          loading={loading}
          searchable
          pageSize={15}
        />
      </Card>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        title="Book New Appointment"
        size="lg"
      >
        <Form onSubmit={handleCreateAppointment}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Patient <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
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
                <Form.Label>Doctor <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
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
                <Form.Label>Date & Time <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Duration (minutes)</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="CONSULTATION">Consultation</option>
                  <option value="FOLLOW_UP">Follow Up</option>
                  <option value="EMERGENCY">Emergency</option>
                  <option value="CHECKUP">Checkup</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Reason for Visit</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Enter reason for appointment..."
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2 justify-content-end">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Book Appointment
            </Button>
          </div>
        </Form>
      </Modal>
    </DashboardLayout>
  );
};

export default AppointmentList;
