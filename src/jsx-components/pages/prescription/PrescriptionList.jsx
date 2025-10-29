import { useState, useEffect } from 'react';
import { Row, Col, Badge, Form, Alert } from 'react-bootstrap';
import { FileText, Plus, Edit, Trash2, Eye } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Card } from '../../common/Card';
import Button from '../../common/Button';
import DataTable from '../../common/DataTable';
import Modal from '../../common/Modal';
import { prescriptionService, patientService, staffService, medicineService } from '../../../jsx-services/api';

export const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    diagnosis: '',
    notes: '',
    medicineItems: [{ medicineId: '', dosage: '', frequency: '', duration: '', instructions: '' }],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prescData, patData, docData, medData] = await Promise.all([
        prescriptionService.getAll(),
        patientService.getAll(),
        staffService.getDoctors(),
        medicineService.getAll(),
      ]);

      setPrescriptions(prescData);
      setPatients(patData);
      setDoctors(docData);
      setMedicines(medData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const prescriptionData = {
        patient_id: formData.patientId,
        doctor_id: formData.doctorId,
        diagnosis: formData.diagnosis,
        notes: formData.notes,
        status: 'PENDING',
        medicines: formData.medicineItems.filter(item => item.medicineId),
      };

      await prescriptionService.create(prescriptionData);
      setSuccess('Prescription created successfully!');
      setShowModal(false);
      loadData();
      resetForm();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error creating prescription:', err);
      setError(err.message || 'Failed to create prescription');
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      diagnosis: '',
      notes: '',
      medicineItems: [{ medicineId: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    });
  };

  const addMedicineItem = () => {
    setFormData({
      ...formData,
      medicineItems: [...formData.medicineItems, { medicineId: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    });
  };

  const removeMedicineItem = (index) => {
    const newItems = formData.medicineItems.filter((_, i) => i !== index);
    setFormData({ ...formData, medicineItems: newItems });
  };

  const updateMedicineItem = (index, field, value) => {
    const newItems = [...formData.medicineItems];
    newItems[index][field] = value;
    setFormData({ ...formData, medicineItems: newItems });
  };

  const columns = [
    {
      header: 'Prescription No',
      key: 'id',
      render: (row) => `RX-${row.id?.substring(0, 8).toUpperCase()}`,
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
      header: 'Diagnosis',
      key: 'diagnosis',
    },
    {
      header: 'Date',
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      header: 'Status',
      render: (row) => {
        const variants = {
          PENDING: 'warning',
          DISPENSED: 'success',
          CANCELLED: 'danger',
        };
        return <Badge bg={variants[row.status] || 'secondary'}>{row.status}</Badge>;
      },
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="d-flex gap-1">
          <Button size="sm" variant="outline-primary">
            <Eye size={14} />
          </Button>
          <Button size="sm" variant="outline-info">
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
    <DashboardLayout title="Prescriptions">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Prescriptions</h2>
          <p className="text-muted">Manage patient prescriptions and medications</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus size={18} className="me-2" />
            Create Prescription
          </Button>
        </Col>
      </Row>

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card>
        <DataTable
          columns={columns}
          data={prescriptions}
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
        title="Create New Prescription"
        size="xl"
      >
        <Form onSubmit={handleCreatePrescription}>
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

            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Diagnosis <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  placeholder="Enter diagnosis..."
                  required
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <h6 className="mb-3">Medicines</h6>
              {formData.medicineItems.map((item, index) => (
                <div key={index} className="border rounded p-3 mb-3">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>Medicine</Form.Label>
                        <Form.Select
                          value={item.medicineId}
                          onChange={(e) => updateMedicineItem(index, 'medicineId', e.target.value)}
                        >
                          <option value="">Select Medicine</option>
                          {medicines.map((med) => (
                            <option key={med.id} value={med.id}>
                              {med.name} - {med.strength}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-2">
                        <Form.Label>Dosage</Form.Label>
                        <Form.Control
                          type="text"
                          value={item.dosage}
                          onChange={(e) => updateMedicineItem(index, 'dosage', e.target.value)}
                          placeholder="e.g., 1 tablet"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-2">
                        <Form.Label>Frequency</Form.Label>
                        <Form.Control
                          type="text"
                          value={item.frequency}
                          onChange={(e) => updateMedicineItem(index, 'frequency', e.target.value)}
                          placeholder="e.g., 3 times/day"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>Duration</Form.Label>
                        <Form.Control
                          type="text"
                          value={item.duration}
                          onChange={(e) => updateMedicineItem(index, 'duration', e.target.value)}
                          placeholder="e.g., 7 days"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>Instructions</Form.Label>
                        <Form.Control
                          type="text"
                          value={item.instructions}
                          onChange={(e) => updateMedicineItem(index, 'instructions', e.target.value)}
                          placeholder="e.g., After meals"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  {formData.medicineItems.length > 1 && (
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => removeMedicineItem(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline-primary" size="sm" onClick={addMedicineItem}>
                + Add Medicine
              </Button>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Additional Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Enter any additional notes..."
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
              Create Prescription
            </Button>
          </div>
        </Form>
      </Modal>
    </DashboardLayout>
  );
};

export default PrescriptionList;
