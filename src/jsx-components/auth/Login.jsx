import { useState } from 'react';
import { Container, Row, Col, Form, Alert } from 'react-bootstrap';
import { Activity } from 'lucide-react';
import { useAuth } from '../../jsx-context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col md={5} lg={4}>
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3"
                   style={{ width: '80px', height: '80px' }}>
                <Activity size={40} />
              </div>
              <h2 className="fw-bold text-primary">Hospital Management</h2>
              <p className="text-muted">Sign in to your account</p>
            </div>

            <div className="card shadow-lg border-0">
              <div className="card-body p-4">
                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      size="lg"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      size="lg"
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={loading}
                      disabled={loading}
                    >
                      Sign In
                    </Button>
                  </div>
                </Form>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    Forgot your password? Contact administrator
                  </small>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-muted small">
                &copy; 2024 Hospital Management System. All rights reserved.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
