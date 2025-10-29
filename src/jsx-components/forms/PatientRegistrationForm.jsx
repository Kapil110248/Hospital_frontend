import { useState } from 'react';
import { Form, Row, Col, Nav, Alert } from 'react-bootstrap';
import Button from '../common/Button';
import { patientService } from '../../jsx-services/api';
import { GENDER_OPTIONS, BLOOD_GROUPS } from '../../jsx-utils/constants';

export const PatientRegistrationForm = ({ patient, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState({
    firstName: patient?.first_name || '',
    lastName: patient?.last_name || '',
    dateOfBirth: patient?.date_of_birth || '',
    gender: patient?.gender || 'MALE',
    phone: patient?.phone || '',
    email: patient?.email || '',
    address: patient?.address || '',
    age: patient?.age || '',
    height: patient?.height || '',
    weight: patient?.weight || '',
    bloodGroup: patient?.blood_group || '',
    allergies: patient?.allergies || '',
    currentTreatment: patient?.current_treatment || '',
    medicalHistory: patient?.medical_history || '',
    nationalId: patient?.national_id || '',
    insuranceProvider: patient?.insurance_provider || '',
    insurancePolicyNumber: patient?.insurance_policy_number || '',
    emergencyContactName: patient?.emergency_contact_name || '',
    emergencyContactPhone: patient?.emergency_contact_phone || '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const patientData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email || null,
        address: formData.address || null,
        age: formData.age ? parseInt(formData.age) : null,
        height: formData.height ? parseInt(formData.height) : null,
        weight: formData.weight ? parseInt(formData.weight) : null,
        blood_group: formData.bloodGroup || null,
        allergies: formData.allergies || null,
        current_treatment: formData.currentTreatment || null,
        medical_history: formData.medicalHistory || null,
        national_id: formData.nationalId || null,
        insurance_provider: formData.insuranceProvider || null,
        insurance_policy_number: formData.insurancePolicyNumber || null,
        emergency_contact_name: formData.emergencyContactName || null,
        emergency_contact_phone: formData.emergencyContactPhone || null,
        status: 'OPD',
      };

      let result;
      if (patient) {
        result = await patientService.update(patient.id, patientData);
      } else {
        result = await patientService.create(patientData);
      }

      onSuccess?.(result);
    } catch (err) {
      setError(err.message || 'Failed to save patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link active={activeTab === 'basic'} onClick={() => setActiveTab('basic')}>
            Basic Information
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={activeTab === 'medical'} onClick={() => setActiveTab('medical')}>
            Medical Information
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={activeTab === 'insurance'} onClick={() => setActiveTab('insurance')}>
            Insurance & Emergency
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === 'basic' && (
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                First Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Last Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Date of Birth <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Gender <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
                {GENDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Phone <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>National ID</Form.Label>
              <Form.Control
                type="text"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
      )}

      {activeTab === 'medical' && (
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Height (cm)</Form.Label>
              <Form.Control
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Weight (kg)</Form.Label>
              <Form.Control
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Blood Group</Form.Label>
              <Form.Select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                <option value="">Select Blood Group</option>
                {BLOOD_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Current Treatment</Form.Label>
              <Form.Control
                type="text"
                name="currentTreatment"
                value={formData.currentTreatment}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Allergies</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="List any known allergies..."
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Medical History</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                placeholder="Enter medical history, past conditions, surgeries, etc..."
              />
            </Form.Group>
          </Col>
        </Row>
      )}

      {activeTab === 'insurance' && (
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Insurance Provider</Form.Label>
              <Form.Control
                type="text"
                name="insuranceProvider"
                value={formData.insuranceProvider}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Policy Number</Form.Label>
              <Form.Control
                type="text"
                name="insurancePolicyNumber"
                value={formData.insurancePolicyNumber}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Emergency Contact Name</Form.Label>
              <Form.Control
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Emergency Contact Phone</Form.Label>
              <Form.Control
                type="tel"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
      )}

      <div className="d-flex justify-content-end gap-2 pt-3 border-top">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={loading}>
          {patient ? 'Update Patient' : 'Register Patient'}
        </Button>
      </div>
    </Form>
  );
};

export default PatientRegistrationForm;
