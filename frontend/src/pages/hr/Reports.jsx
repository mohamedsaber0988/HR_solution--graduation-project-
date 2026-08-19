import React, { useRef, useState, useEffect } from 'react';
import { Download, FileText, Users, CreditCard, Calendar, Filter, Loader2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { api } from '../../api/api';

const Reports = () => {
    const pdfRef = useRef();
    const [reportType, setReportType] = useState('salary'); 
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchReportData = async () => {
        setLoading(true);
        try {
            let endpoint = '/admin/users';
            if (reportType === 'attendance') endpoint = `/reports/attendance?month=${month}&year=${year}`;

            const response = await api.get(endpoint);
            
            if (reportType === 'salary') {
                setData(response.data || response);
            } else {
                setData(response.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch report data:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, [reportType, month, year]);

    const handleDownloadPDF = () => {
        const element = pdfRef.current;
        const opt = {
            margin:       10,
            filename:     `${reportType}_report_${month}_${year}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };
        html2pdf().from(element).set(opt).save();
    };

    const renderTable = (isForPdf = false) => {
        if (reportType === 'salary') {
            return (
                <table className={`w-full text-left border-collapse ${isForPdf ? 'border border-gray-300' : ''}`}>
                    <thead>
                        <tr className={`${isForPdf ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-500'} text-xs font-bold uppercase`}>
                            <th className="p-4">ID</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Base Salary</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} className={`border-b ${isForPdf && i % 2 === 0 ? 'bg-gray-50' : ''}`}>
                                <td className="p-4">{row.user_id}</td>
                                <td className="p-4">{row.first_name} {row.last_name}</td>
                                <td className="p-4 font-bold text-blue-600">EGP {(row.base_salary || 0).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        if (reportType === 'attendance') {
            return (
                <table className={`w-full text-left border-collapse ${isForPdf ? 'border border-gray-300' : ''}`}>
                    <thead>
                        <tr className={`${isForPdf ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-500'} text-xs font-bold uppercase`}>
                            <th className="p-4">Name</th>
                            <th className="p-4 text-center">Present</th>
                            <th className="p-4 text-center">Late</th>
                            <th className="p-4 text-center">Absent</th>
                            <th className="p-4 text-center">Leave</th>
                            <th className="p-4 text-right">Overtime (Hrs)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} className={`border-b ${isForPdf && i % 2 === 0 ? 'bg-gray-50' : ''}`}>
                                <td className="p-4">{row.employee_name || `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'Unknown'}</td>
                                <td className="p-4 text-center text-green-600 font-bold">{row.attendance?.present_days || 0}</td>
                                <td className="p-4 text-center text-yellow-600">{row.attendance?.late_days || 0}</td>
                                <td className="p-4 text-center text-red-600">{row.attendance?.absent_days || 0}</td>
                                <td className="p-4 text-center text-blue-600">{row.attendance?.leave_days || 0}</td>
                                <td className="p-4 text-right font-mono">{row.attendance?.overtime_hours || 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <FileText className="text-blue-600" size={32} />
                        Report Center
                    </h1>
                    <p className="text-slate-500 font-medium">Generate and export detailed organizational insights.</p>
                </div>
                <button 
                    onClick={handleDownloadPDF}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
                >
                    <Download size={20} />
                    Export PDF
                </button>
            </div>

            {}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                    <button 
                        onClick={() => setReportType('salary')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${reportType === 'salary' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Salary Certificate
                    </button>
                    <button 
                        onClick={() => setReportType('attendance')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${reportType === 'attendance' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Attendance
                    </button>
                </div>

                {reportType !== 'salary' && (
                    <div className="flex items-center gap-3 ml-auto">
                        <select 
                            className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                        >
                            {[...Array(12)].map((_, i) => (
                                <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('en', {month: 'long'})}</option>
                            ))}
                        </select>
                        <select 
                            className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        >
                            <option value="2026">2026</option>
                            <option value="2025">2025</option>
                        </select>
                    </div>
                )}
            </div>

            {}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 text-slate-400">
                        <Loader2 className="animate-spin mb-4" size={48} />
                        <p className="font-bold uppercase tracking-widest text-[10px]">Generating Report Data...</p>
                    </div>
                ) : data.length === 0 ? (
                    <div className="py-40 text-center text-slate-400">
                        <p className="font-bold italic">No data found for the selected period.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        {renderTable()}
                    </div>
                )}
            </div>

            {}
            <div style={{ position: 'absolute', top: '-20000px', left: '-20000px' }}>
                <div ref={pdfRef} className="bg-white p-10 w-[1200px] font-sans">
                    <div className="flex justify-between items-start mb-10 border-b pb-8">
                        <div>
                            <h1 className="text-4xl font-black text-blue-600 mb-2 uppercase tracking-tighter">Managly Org.</h1>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Internal Resource Planning System</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold text-slate-800 uppercase">{reportType} Report</h2>
                            <p className="text-slate-500 font-medium">{new Date(year, month-1).toLocaleString('en', {month: 'long'})} {year}</p>
                        </div>
                    </div>
                    {renderTable(true)}
                    <div className="mt-10 pt-8 border-t text-slate-400 text-[10px] flex justify-between uppercase font-bold tracking-widest">
                        <span>Generated by HR Admin on {new Date().toLocaleDateString()}</span>
                        <span>CONFIDENTIAL - INTERNAL USE ONLY</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;