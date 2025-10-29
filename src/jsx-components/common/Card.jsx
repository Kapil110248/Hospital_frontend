import { Card as BSCard } from 'react-bootstrap';

export const Card = ({
  children,
  title,
  subtitle,
  className = '',
  bodyClassName = '',
  ...props
}) => {
  return (
    <BSCard className={`shadow-sm ${className}`} {...props}>
      {(title || subtitle) && (
        <BSCard.Header className="bg-white border-bottom">
          {title && <BSCard.Title className="mb-0">{title}</BSCard.Title>}
          {subtitle && <BSCard.Subtitle className="text-muted mt-1">{subtitle}</BSCard.Subtitle>}
        </BSCard.Header>
      )}
      <BSCard.Body className={bodyClassName}>
        {children}
      </BSCard.Body>
    </BSCard>
  );
};

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  bgColor = 'primary',
  textColor = 'white'
}) => {
  const bgClasses = {
    primary: 'bg-primary',
    success: 'bg-success',
    info: 'bg-info',
    warning: 'bg-warning',
    danger: 'bg-danger',
    secondary: 'bg-secondary',
  };

  return (
    <BSCard className={`${bgClasses[bgColor]} text-${textColor} shadow`}>
      <BSCard.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="mb-1 opacity-75 text-uppercase small">{title}</p>
            <h3 className="mb-0 fw-bold">{value}</h3>
            {trend && <small className="mt-2 d-block opacity-75">{trend}</small>}
          </div>
          {Icon && (
            <div className="opacity-75">
              <Icon size={48} />
            </div>
          )}
        </div>
      </BSCard.Body>
    </BSCard>
  );
};

export default Card;
