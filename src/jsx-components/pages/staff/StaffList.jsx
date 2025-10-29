import { useState, useEffect } from 'react';
import { Row, Col, Badge, Alert } from 'react-bootstrap';
import { UserPlus, Edit, Eye } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Card } from '../../common/Card';
import Button from '../../common/Button';
import DataTable from '../../common/DataTable';
import Modal from '../../common/Modal';
import StaffRegistrationForm from '../../forms/StaffRegistrationForm';
import { staffService } from '../../../jsx-services/api';

export const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const data = await staffService.getAll();
      setStaff(data);
    } catch (error) {
      console.error('Error loading staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setSuccess('Staff member saved successfully!');
    setShowModal(false);
    setSelectedStaff(null);
    loadStaff();
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEdit = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowModal(true);
  };

  const columns = [
    {
      header: 'Employee ID',
      key: 'employee_id',
    },
    {
      header: 'Name',
      render: (row) => `${row.first_name} ${row.last_name}`,
    },
    {
      header: 'Phone',
      key: 'phone',
    },
    {
      header: 'Gender',
      key: 'gender',
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge bg={row.is_active ? 'success' : 'danger'}>
          {row.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="d-flex gap-1">
          <Button size="sm" variant="outline-primary" onClick={() => handleEdit(row)}>
            <Edit size={14} />
          </Button>
          <Button size="sm" variant="outline-info">
            <Eye size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout title="Staff Management">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Staff</h2>
          <p className="text-muted">Manage hospital staff and employees</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => {
            setSelectedStaff(null);
            setShowModal(true);
          }}>
            <UserPlus size={18} className="me-2" />
            Add Staff
          </Button>
        </Col>
      </Row>

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Card>
        <DataTable
          columns={columns}
          data={staff}
          loading={loading}
          searchable
          pageSize={15}
        />
      </Card>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedStaff(null);
        }}
        title={selectedStaff ? 'Edit Staff' : 'Register New Staff'}
        size="xl"
      >
        <StaffRegistrationForm
          staff={selectedStaff}
          onSuccess={handleSuccess}
          onCancel={() => {
            setShowModal(false);
            setSelectedStaff(null);
          }}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default StaffList;
