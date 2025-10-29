import { useState, useEffect } from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import { UserPlus, Eye, Edit, Trash2 } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Card } from '../../common/Card';
import Button from '../../common/Button';
import DataTable from '../../common/DataTable';
import Modal from '../../common/Modal';
import PatientRegistrationForm from '../../forms/PatientRegistrationForm';
import { patientService } from '../../../jsx-services/api';

export const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalMode, setModalMode] = useState('create');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await patientService.getAll();
      setPatients(data);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedPatient(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleSuccess = () => {
    setShowModal(false);
    loadPatients();
  };

  const getStatusBadge = (status) => {
    const variants = {
      OPD: 'primary',
      IPD: 'warning',
      DISCHARGED: 'success',
      EMERGENCY: 'danger',
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const columns = [
    {
      header: 'UPID',
      key: 'upid',
      minWidth: '120px',
    },
    {
      header: 'Name',
      render: (row) => `${row.first_name} ${row.last_name}`,
      minWidth: '180px',
    },
    {
      header: 'Phone',
      key: 'phone',
      minWidth: '130px',
    },
    {
      header: 'Gender',
      key: 'gender',
      minWidth: '100px',
    },
    {
      header: 'Age',
      key: 'age',
      minWidth: '80px',
    },
    {
      header: 'Blood Group',
      key: 'blood_group',
      minWidth: '120px',
    },
    {
      header: 'Status',
      render: (row) => getStatusBadge(row.status),
      minWidth: '120px',
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
          >
            <Edit size={16} />
          </Button>
          <Button variant="outline-info" size="sm">
            <Eye size={16} />
          </Button>
        </div>
      ),
      minWidth: '120px',
    },
  ];

  return (
    <DashboardLayout title="Patient Management">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Patients</h2>
          <p className="text-muted">Manage patient records and information</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleCreate}>
            <UserPlus size={18} className="me-2" />
            Register New Patient
          </Button>
        </Col>
      </Row>

      <Card>
        <DataTable
          columns={columns}
          data={patients}
          loading={loading}
          searchable
          pageSize={10}
        />
      </Card>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        title={modalMode === 'create' ? 'Register New Patient' : 'Edit Patient'}
        size="xl"
      >
        <PatientRegistrationForm
          patient={selectedPatient}
          onSuccess={handleSuccess}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default PatientList;
