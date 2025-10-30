import { Button as BSButton } from 'react-bootstrap';

/**
 * Reusable Button Component
 * Supports:
 * - Bootstrap variants (primary, success, danger, etc.)
 * - Optional icons from lucide-react or any React icon library
 * - Loading spinner state
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon, // 👈 optional icon component
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <BSButton
      type={type}
      variant={variant}
      size={size === 'md' ? undefined : size}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${className} d-inline-flex align-items-center gap-2 ${loading ? 'position-relative' : ''}`}
      {...props}
    >
      {/* Spinner when loading */}
      {loading && (
        <span
          className="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        />
      )}

      {/* Show icon if provided */}
      {Icon && <Icon size={18} className="me-1" />}

      {/* Button label or content */}
      {children}
    </BSButton>
  );
};

export default Button;
