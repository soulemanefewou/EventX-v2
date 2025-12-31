export const MetricBadge = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-xl border border-emerald-100/50 shadow-sm">
    <div className="p-1.5 bg-emerald-100/50 rounded-lg">
      <Icon className="w-3.5 h-3.5 text-emerald-600" />
    </div>
    <span className="text-xs font-medium text-gray-500">{label}</span>
    <span className="text-sm font-bold text-gray-900">{value}</span>
  </div>
);