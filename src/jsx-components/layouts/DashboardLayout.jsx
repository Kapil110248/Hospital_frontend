import { Container } from 'react-bootstrap';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export const DashboardLayout = ({ children, title }) => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 bg-light min-vh-100">
        <TopBar title={title} />
        <Container fluid className="p-4">
          {children}
        </Container>
      </div>
    </div>
  );
};

export default DashboardLayout;
