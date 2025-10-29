import { Navbar, Container, Form, Badge } from 'react-bootstrap';
import { Bell, Search } from 'lucide-react';

export const TopBar = ({ title = 'Dashboard' }) => {
  return (
    <Navbar bg="white" className="border-bottom shadow-sm py-3">
      <Container fluid>
        <Navbar.Brand className="fw-bold text-dark fs-4">{title}</Navbar.Brand>

        <div className="d-flex align-items-center gap-3">
          <Form className="d-none d-md-flex">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Search size={18} />
              </span>
              <Form.Control
                type="search"
                placeholder="Search patients, appointments..."
                className="border-start-0"
                style={{ minWidth: '300px' }}
              />
            </div>
          </Form>

          <div className="position-relative">
            <button className="btn btn-light position-relative">
              <Bell size={20} />
              <Badge
                bg="danger"
                pill
                className="position-absolute top-0 start-100 translate-middle"
                style={{ fontSize: '0.65rem' }}
              >
                3
              </Badge>
            </button>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default TopBar;
