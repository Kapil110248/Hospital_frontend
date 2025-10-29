import { useState, useEffect } from 'react';
import { Row, Col, Badge, ListGroup } from 'react-bootstrap';
import { Calendar, Users, FileText, Clock, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { StatsCard } from '../../common/Card';
import { Card } from '../../common/Card';
import DataTable from '../../common/DataTable';
import Button from '../../common/Button';
import { appointmentService, patientService } from '../../../jsx-services/api';

export const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    completedToday: 0,
    pendingAppointments: 0,
    totalPatients: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [appointments, patients] = await Promise.all([
        appointmentService.getTodayAppointments(),
        patientService.getAll(),
      ]);

      setTodayAppointments(appointments);
      setRecentPatients(patients.slice(0, 5));

      const completed = appointments.filter(a => a.status === 'COMPLETED').length;
      const pending = appointments.filter(a =>
        ['SCHEDULED', 'CHECKED_IN', 'IN_CONSULTATION'].includes(a.status)
      ).length;

      setStats({
        todayAppointments: appointments.length,
        completedToday: completed,
        pendingAppointments: pending,
        totalPatients: patients.length,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartConsultation = async (appointmentId) => {
    try {
      await appointmentService.update(appointmentId, { status: 'IN_CONSULTATION' });
      loadDashboardData();
    } catch (error) {
      console.error('Error starting consultation:', error);
    }
  };

  const handleCompleteConsultation = async (appointmentId) => {
    try {
      await appointmentService.update(appointmentId, { status: 'COMPLETED' });
      loadDashboardData();
    } catch (error) {
      console.error('Error completing consultation:', error);
    }
  };

  const appointmentColumns = [
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
      header: 'Time',
      render: (row) => new Date(row.scheduled_at).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
    },
    {
      header: 'Status',
      render: (row) => {
        const variants = {
          SCHEDULED: 'secondary',
          CHECKED_IN: 'info',
          IN_CONSULTATION: 'warning',
          COMPLETED: 'success',
        };
        return <Badge bg={variants[row.status] || 'secondary'}>{row.status}</Badge>;
      },
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="d-flex gap-1">
          {row.status === 'CHECKED_IN' && (
            <Button
              size="sm"
              variant="success"
              onClick={() => handleStartConsultation(row.id)}
            >
              Start
            </Button>
          )}
          {row.status === 'IN_CONSULTATION' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleCompleteConsultation(row.id)}
            >
              Complete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout title="Doctor Dashboard">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Doctor's Dashboard</h2>
          <p className="text-muted">Manage your appointments and patient care</p>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col md={6} xl={3}>
          <StatsCard
            title="Today's Appointments"
            value={stats.todayAppointments}
            icon={Calendar}
            bgColor="primary"
          />
        </Col>
        <Col md={6} xl={3}>
          <StatsCard
            title="Completed Today"
            value={stats.completedToday}
            icon={Activity}
            bgColor="success"
          />
        </Col>
        <Col md={6} xl={3}>
          <StatsCard
            title="Pending"
            value={stats.pendingAppointments}
            icon={Clock}
            bgColor="warning"
          />
        </Col>
        <Col md={6} xl={3}>
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={Users}
            bgColor="info"
          />
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card title="Today's Appointments">
            <DataTable
              columns={appointmentColumns}
              data={todayAppointments}
              loading={loading}
              searchable={false}
              pageSize={10}
            />
          </Card>
        </Col>

        <Col lg={4}>
          <Card title="Quick Actions" className="mb-3">
            <div className="d-grid gap-2">
              <Button
                variant="outline-primary"
                onClick={() => navigate('/prescriptions')}
              >
                <FileText size={18} className="me-2" />
                Write Prescription
              </Button>
              <Button
                variant="outline-success"
                onClick={() => navigate('/laboratory')}
              >
                <Activity size={18} className="me-2" />
                Order Lab Test
              </Button>
              <Button
                variant="outline-info"
                onClick={() => navigate('/patients')}
              >
                <Users size={18} className="me-2" />
                View Patient History
              </Button>
            </div>
          </Card>

          <Card title="Next Appointment">
            {todayAppointments.length > 0 ? (
              <div className="p-3 bg-light rounded">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="mb-1">
                      {todayAppointments[0].patient?.first_name}{' '}
                      {todayAppointments[0].patient?.last_name}
                    </h6>
                    <small className="text-muted">
                      Token: {todayAppointments[0].token_number}
                    </small>
                  </div>
                  <Badge bg="info">{todayAppointments[0].status}</Badge>
                </div>
                <div className="d-flex align-items-center text-muted small">
                  <Clock size={14} className="me-1" />
                  {new Date(todayAppointments[0].scheduled_at).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ) : (
              <p className="text-muted text-center py-3">No upcoming appointments</p>
            )}
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={12}>
          <Card title="Recent Patients">
            <ListGroup variant="flush">
              {recentPatients.map((patient) => (
                <ListGroup.Item
                  key={patient.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <h6 className="mb-0">
                      {patient.first_name} {patient.last_name}
                    </h6>
                    <small className="text-muted">UPID: {patient.upid}</small>
                  </div>
                  <Button size="sm" variant="outline-primary">
                    View Details
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
