import { TrendingDown, TrendingUp } from "lucide-react";

export const StatCard = ({ title, value, icon: Icon, change, color = 'emerald', subtext }) => {
  const themes = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', iconBg: 'bg-emerald-500', trend: 'text-emerald-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', iconBg: 'bg-blue-500', trend: 'text-blue-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', iconBg: 'bg-purple-500', trend: 'text-purple-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', iconBg: 'bg-amber-500', trend: 'text-amber-600' },
  };
  const theme = themes[color];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1 pb-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${theme.iconBg} shadow-lg shadow-${color}-500/20 group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div>
        {change && (
          <div className={`flex items-center gap-1.5 text-xs font-medium ${change > 0 ? 'text-emerald-600' : 'text-rose-600'} mb-1`}>
            {change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(change)}% vs mois dernier</span>
          </div>
        )}
        <p className="text-xs text-gray-400">{subtext}</p>
      </div>
    </div>
  );
};