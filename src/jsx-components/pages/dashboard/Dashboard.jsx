import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import {
  Users,
  Calendar,
  DollarSign,
  Activity,
  TrendingUp,
  Clock,
} from "../../../lib/icons";
import DashboardLayout from "../../layouts/DashboardLayout";
import { StatsCard } from "../../common/Card";
import { Card } from "../../common/Card";
import DataTable from "../../common/DataTable";
import {
  dashboardService,
  appointmentService,
} from "../../../jsx-services/api";

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalStaff: 0,
    todayAppointments: 0,
    totalRevenue: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, appointments] = await Promise.all([
        dashboardService.getStats(),
        appointmentService.getTodayAppointments(),
      ]);

      setStats(statsData);
      setRecentAppointments(appointments.slice(0, 5));
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const appointmentColumns = [
    {
      header: "Token",
      key: "token_number",
      minWidth: "100px",
    },
    {
      header: "Patient",
      render: (row) =>
        row.patient
          ? `${row.patient.first_name} ${row.patient.last_name}`
          : "N/A",
      minWidth: "180px",
    },
    {
      header: "Doctor",
      render: (row) =>
        row.doctor
          ? `Dr. ${row.doctor.first_name} ${row.doctor.last_name}`
          : "N/A",
      minWidth: "180px",
    },
    {
      header: "Time",
      render: (row) => new Date(row.scheduled_at).toLocaleTimeString(),
      minWidth: "120px",
    },
    {
      header: "Status",
      key: "status",
      minWidth: "120px",
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Dashboard Overview</h2>
          <p className="text-muted">
            Welcome back! Here's what's happening today.
          </p>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col md={6} xl={3}>
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={Users}
            bgColor="primary"
            trend="+12% from last month"
          />
        </Col>
        <Col md={6} xl={3}>
          <StatsCard
            title="Today's Appointments"
            value={stats.todayAppointments}
            icon={Calendar}
            bgColor="success"
            trend="5 pending"
          />
        </Col>
        <Col md={6} xl={3}>
          <StatsCard
            title="Total Staff"
            value={stats.totalStaff}
            icon={Activity}
            bgColor="info"
            trend="All departments"
          />
        </Col>
        <Col md={6} xl={3}>
          <StatsCard
            title="Monthly Revenue"
            value="$45,200"
            icon={DollarSign}
            bgColor="warning"
            trend="+8% from last month"
          />
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <Card title="Today's Appointments">
            <DataTable
              columns={appointmentColumns}
              data={recentAppointments}
              loading={loading}
              searchable={false}
              pageSize={5}
            />
          </Card>
        </Col>

        <Col lg={4}>
          <Card title="Quick Stats" className="mb-3">
            <div className="d-flex flex-column gap-3">
              <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                <div className="d-flex align-items-center">
                  <Clock className="text-primary me-2" size={24} />
                  <span>Avg Wait Time</span>
                </div>
                <strong>15 min</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                <div className="d-flex align-items-center">
                  <TrendingUp className="text-success me-2" size={24} />
                  <span>Patient Satisfaction</span>
                </div>
                <strong>98%</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                <div className="d-flex align-items-center">
                  <Users className="text-info me-2" size={24} />
                  <span>Active IPD</span>
                </div>
                <strong>24</strong>
              </div>
            </div>
          </Card>

          <Card title="Recent Activities">
            <div className="d-flex flex-column gap-2">
              {[
                "New patient registered",
                "Lab report completed",
                "Prescription dispensed",
                "Payment received",
              ].map((activity, index) => (
                <div key={index} className="p-2 border-bottom">
                  <small className="text-muted">{activity}</small>
                  <div className="text-muted small">Just now</div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
};

export default Dashboard;
