export default function StatCard({ title, value, currency, change, isPositive, icon: Icon, subtitle }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-600 mb-2">{title}</h3>
          <div className="text-2xl font-bold mb-1">
            {value} {currency}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {change}
            </span>
            {subtitle && <span className="text-gray-500 text-sm">{subtitle}</span>}
          </div>
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="text-primary text-xl" />
        </div>
      </div>
    </div>
  );
} 