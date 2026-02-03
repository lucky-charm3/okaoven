import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { BarChart3, TrendingUp, History, DollarSign } from 'lucide-react';

const Reports = () => {
  const [data, setData] = useState({ sales: [], totalRevenue: 0, totalProfit: 0 });

  useEffect(() => {
    fetchReport();
  }, []);

   const fetchReport = async () => {
    try {
        const res = await axios.get('/sales/report');
        setData(res.data || { sales: [], totalRevenue: 0, totalProfit: 0 });
    } catch (err) {
        console.error("Report Fetch Failed");
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-10">Financial <span className="text-lemon">Performance</span></h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <ReportCard label="Net Revenue" val={`Tshs${data.totalRevenue.toFixed(2)}`} icon={<TrendingUp />} />
        <ReportCard label="Net Profit" val={`Tshs${data.totalProfit.toFixed(2)}`} icon={<DollarSign />} color="text-lemon" />
        <ReportCard label="Transactions" val={data.sales.length} icon={<History />} />
      </div>

      {/* Sales History Table */}
      <div className="bg-navy-muted rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
        <h3 className="text-xl font-black uppercase mb-8 flex items-center gap-3">
            <BarChart3 className="text-lemon"/> Audit Log
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5">
              <tr>
                <th className="pb-6">Date/Time</th>
                <th className="pb-6">Total Bill</th>
                <th className="pb-6 text-lemon">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data?.sales?.map((sale) => (
                <tr key={sale.id} className="hover:bg-white/5 transition-all">
                  <td className="py-6 font-bold text-sm">
                    {new Date(sale.timestamp).toLocaleDateString()} <br/>
                    <span className="text-[10px] text-gray-500">{new Date(sale.timestamp).toLocaleTimeString()}</span>
                  </td>
                  <td className="py-6 font-black text-off-white">Tshs{sale.totalAmount.toFixed(2)}</td>
                  <td className="py-6 font-black text-lemon">+ Tshs{sale.totalProfit.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.sales.length === 0 && (
            <div className="py-20 text-center text-gray-500 font-bold italic">No sales data recorded yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const ReportCard = ({ label, val, icon, color }) => (
  <div className="bg-navy-muted p-8 rounded-[2rem] border border-white/5 relative overflow-hidden shadow-xl">
    <div className="absolute top-0 right-0 p-6 opacity-10 text-off-white">{icon}</div>
    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{label}</p>
    <h3 className={`text-4xl font-black ${color || 'text-off-white'}`}>{val}</h3>
  </div>
);

export default Reports;