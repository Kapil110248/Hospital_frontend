import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'purple' | 'teal' | 'blue' | 'green' | 'orange' | 'red';
}

export function StatsCard({ title, value, icon: Icon, trend, color = 'purple' }: StatsCardProps) {
  const colorClasses = {
    purple: 'bg-hospital-purple/10 text-hospital-purple',
    teal: 'bg-teal-500/10 text-teal-600',
    blue: 'bg-blue-500/10 text-blue-600',
    green: 'bg-success-500/10 text-success-600',
    orange: 'bg-warning-500/10 text-warning-600',
    red: 'bg-error-500/10 text-error-600',
  };

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100 hover:shadow-glass transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {trend && (
            <p className={`text-sm font-medium ${trend.isPositive ? 'text-success-600' : 'text-error-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
