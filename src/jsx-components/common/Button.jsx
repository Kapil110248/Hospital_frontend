import { Button as BSButton } from 'react-bootstrap';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };

  return (
    <BSButton
      type={type}
      variant={variant}
      size={size === 'md' ? undefined : size}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${className} ${loading ? 'position-relative' : ''}`}
      {...props}
    >
      {loading && (
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
      )}
      {children}
    </BSButton>
  );
};

export default Button;
