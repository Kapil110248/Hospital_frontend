import { Modal as BSModal } from 'react-bootstrap';
import Button from './Button';

export const Modal = ({
  show,
  onHide,
  title,
  children,
  size = 'lg',
  centered = true,
  footer,
  showCloseButton = true,
  ...props
}) => {
  return (
    <BSModal
      show={show}
      onHide={onHide}
      size={size}
      centered={centered}
      backdrop="static"
      {...props}
    >
      {title && (
        <BSModal.Header closeButton={showCloseButton}>
          <BSModal.Title>{title}</BSModal.Title>
        </BSModal.Header>
      )}
      <BSModal.Body>{children}</BSModal.Body>
      {footer && <BSModal.Footer>{footer}</BSModal.Footer>}
    </BSModal>
  );
};

export const ConfirmModal = ({
  show,
  onHide,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <BSModal.Header closeButton>
        <BSModal.Title>{title}</BSModal.Title>
      </BSModal.Header>
      <BSModal.Body>{message}</BSModal.Body>
      <BSModal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={variant} onClick={onConfirm} loading={loading}>
          {confirmText}
        </Button>
      </BSModal.Footer>
    </Modal>
  );
};

export default Modal;
