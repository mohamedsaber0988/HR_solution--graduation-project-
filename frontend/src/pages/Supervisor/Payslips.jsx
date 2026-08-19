import React, { useState, useEffect } from 'react';
import { Wallet, Banknote, Clock, MinusCircle } from 'lucide-react';
import { api } from '../../api/api';

const SupervisorPayslips = () => {
  const [payslipData, setPayslipData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayslips = async () => {
      try {
        const res = await api.get('/my-payslip');
        if (res && res.status === 'success' && res.data) {
          const latest = res.data;

          const parseAmount = (str) =>
            parseFloat(str.replace(/,/g, '').replace('EGP ', ''));

          setPayslipData({
            basicSalary: parseAmount(latest.financials.base_salary),
            netSalary: parseAmount(latest.financials.net_total),
            totalDeductions: parseAmount(latest.financials.deductions),
            overtime: parseAmount(latest.financials.overtime),
          });
        }
      } catch (error) {
        console.error('Failed to fetch payslips:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayslips();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Loading payslip details...
      </div>
    );
  }

  if (!payslipData) {
    return (
      <div className="text-center mt-20 text-gray-500">
        No payslip data found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900">Payslip</h1>
    <p className="text-gray-500 mt-1 pl-1">Check your balance</p>
  </div>

  {}
  <div className="bg-emerald-50 p-8 rounded-3xl shadow-lg border border-emerald-300 flex flex-col items-center justify-center text-center md:col-span-3">
    <Banknote className="w-10 h-10 text-emerald-600 mb-4" />
    <p className="text-sm text-emerald-700 font-medium mb-1">Net Salary</p>
    <p className="text-4xl font-extrabold text-emerald-800">
      EGP {payslipData.netSalary.toFixed(2)}
    </p>
  </div>

  {}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    <div className="pro-card flex flex-col justify-between">
      <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-6">
        <Wallet className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-400 font-medium mb-1">Basic Salary</p>
        <p className="text-2xl font-bold text-blue-600">
          EGP {payslipData.basicSalary.toFixed(2)}
        </p>
      </div>
    </div>

    <div className="pro-card flex flex-col justify-between">
      <div className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-xl flex items-center justify-center mb-6">
        <Clock className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-400 font-medium mb-1">Overtime</p>
        <p className="text-2xl font-bold text-yellow-500">
          EGP {payslipData.overtime.toFixed(2)}
        </p>
      </div>
    </div>

    {}
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 md:col-span-2 flex items-center justify-between mt-2">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center shrink-0">
          <MinusCircle className="w-6 h-6" />
        </div>
        <span className="font-bold text-gray-800 text-lg">Total Deductions</span>
      </div>
      <span className="font-bold text-red-500 text-lg">
        - EGP {payslipData.totalDeductions.toFixed(2)}
      </span>
    </div>
  </div>
  {}
<div className="pro-card mt-6">

  <h2 className="text-lg font-bold text-gray-800 mb-5">
    How Your Salary is Calculated
  </h2>

  <div className="space-y-4">

    {}
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 font-bold">
        1
      </div>
      <div>
        <p className="font-semibold text-gray-700">Deductions</p>
        <p className="text-sm text-gray-500">
          Calculated based on absence and late minutes.
        </p>
        <div className="mt-2 bg-gray-50 px-3 py-2 rounded-lg text-sm font-mono text-gray-700">
          (Absent Days × Daily Rate) + (Late Minutes × Minute Rate)
        </div>
      </div>
    </div>

    {}
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-50 text-yellow-600 font-bold">
        2
      </div>
      <div>
        <p className="font-semibold text-gray-700">Overtime Earnings</p>
        <p className="text-sm text-gray-500">
          Extra income calculated from additional working hours.
        </p>
        <div className="mt-2 bg-gray-50 px-3 py-2 rounded-lg text-sm font-mono text-gray-700">
          (Overtime Minutes × Minute Rate) × Multiplier
        </div>
      </div>
    </div>

    {}
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-bold">
        3
      </div>
      <div>
        <p className="font-semibold text-gray-700">Net Salary</p>
        <p className="text-sm text-gray-500">
          Final salary after adding overtime and subtracting deductions.
        </p>
        <div className="mt-2 bg-emerald-50 px-3 py-2 rounded-lg text-sm font-mono text-emerald-700 font-semibold">
          (Base Salary + Overtime) − Deductions
        </div>
      </div>
    </div>

  </div>
</div>
{}
<div className="pro-card mt-6">

  <h2 className="text-lg font-bold text-gray-800 mb-5">
    Additional Calculation Info
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

    {}
    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
      <p className="text-sm text-blue-700 font-semibold mb-2">
        Daily Rate
      </p>
      <p className="text-xs text-blue-600 mb-2">
        How much you earn per working day
      </p>
      <div className="bg-white px-3 py-2 rounded-lg text-sm font-mono text-blue-700">
        Base Salary ÷ 30
      </div>
    </div>

    {}
    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
      <p className="text-sm text-purple-700 font-semibold mb-2">
        Minute Rate
      </p>
      <p className="text-xs text-purple-600 mb-2">
        How much each minute of work is worth
      </p>
      <div className="bg-white px-3 py-2 rounded-lg text-sm font-mono text-purple-700">
        Daily Rate ÷ required working hours ÷ 60
      </div>
    </div>

    {}
    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
      <p className="text-sm text-emerald-700 font-semibold mb-2">
        Overtime Multiplier
      </p>
      <p className="text-xs text-emerald-600 mb-2">
        Extra reward factor for overtime
      </p>
      <div className="bg-white px-3 py-2 rounded-lg text-sm font-mono text-emerald-700 font-bold">
        1.5 ×
      </div>
    </div>

  </div>

</div>
</div>


  );
};

export default SupervisorPayslips;
