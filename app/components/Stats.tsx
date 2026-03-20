import React from 'react';

const Stats = () => {
  const stats = [
    { label: 'Zebrane Środki', value: '42,500,000 PLN' },
    { label: 'Zakończone Projekty', value: '12,400+' },
    { label: 'Wspierający', value: '850,000+' },
    { label: 'Wypłacone Środki', value: '98%' },
  ];

  return (
    <div className="relative z-10 -mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl">
        {stats.map((stat, index) => (
          <div key={index} className="bg-black/40 p-8 text-center hover:bg-white/5 transition-colors group">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 group-hover:text-blue-400 transition-colors">
              {stat.label}
            </p>
            <p className="text-3xl font-black text-white tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
