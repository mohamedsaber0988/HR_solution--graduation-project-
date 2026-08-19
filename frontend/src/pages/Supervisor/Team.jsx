import React, { useState, useEffect, useMemo } from 'react'
import { Users, Search, Briefcase, Phone, Activity } from 'lucide-react'
import { api } from '../../api/api'

const SupervisorEmployees = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    try {
      setLoading(true)
      const res = await api.get('/team/members')

      if (Array.isArray(res)) {
        setEmployees(res)
      } else if (Array.isArray(res.data)) {
        setEmployees(res.data)
      } else if (Array.isArray(res.data?.data)) {
        setEmployees(res.data.data)
      } else {
        setEmployees([])
      }
    } catch (err) {
      console.error("Error fetching team:", err)
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return employees
    const term = searchTerm.toLowerCase()
    return employees.filter(emp =>
      `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(term) ||
      (emp.email && emp.email.toLowerCase().includes(term)) ||
      (emp.job_title && emp.job_title.toLowerCase().includes(term)) ||
      (emp.dep_name && emp.dep_name.toLowerCase().includes(term))
    )
  }, [employees, searchTerm])

  const getStatusBadge = (status) => {
    const styles = {
      present: 'bg-green-100 text-green-700 border-green-200',
      late:    'bg-yellow-100 text-yellow-700 border-yellow-200',
      leave:   'bg-orange-100 text-orange-700 border-orange-200',
      absent:  'bg-red-100 text-red-700 border-red-200',
    }
    return styles[status] || 'bg-gray-100 text-gray-600 border-gray-200'
  }

  /* ── Stats ── */
  const presentCount = employees.filter(e => e.attendance_status === 'present').length
  const lateCount    = employees.filter(e => e.attendance_status === 'late').length
  const leaveCount   = employees.filter(e => e.attendance_status === 'leave').length
  const absentCount  = employees.filter(e => !['present','late','leave'].includes(e.attendance_status)).length

  /* ── Skeleton Rows ── */
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
        </td>
      ))}
    </tr>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Team Directory</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your team members and their performance</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, role…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white/80 shadow-sm
                       placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
                       transition-all duration-200"
          />
        </div>
      </div>

      {/* ── Quick Stats ── */}
      {!loading && employees.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Present', count: presentCount, color: 'bg-green-500', bg: 'bg-green-50' },
            { label: 'Late',    count: lateCount,    color: 'bg-yellow-500', bg: 'bg-yellow-50' },
            { label: 'On Leave', count: leaveCount,  color: 'bg-orange-500', bg: 'bg-orange-50' },
            { label: 'Absent',  count: absentCount,  color: 'bg-red-500', bg: 'bg-red-50' },
          ].map(stat => (
            <div key={stat.label}
              className={`${stat.bg} rounded-xl px-4 py-3 flex items-center gap-3 border border-white/60 shadow-sm`}>
              <div className={`w-2.5 h-2.5 rounded-full ${stat.color}`} />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                <p className="text-xl font-bold text-gray-800">{stat.count}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Table ── */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
        {loading ? (
          <table className="min-w-full text-left font-sans">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Job / Dept</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tasks</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
            </tbody>
          </table>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-16 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              {searchTerm ? 'No team members match your search.' : 'No team members found.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left font-sans">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Job / Dept</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Tasks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredEmployees.map(emp => (
                  <tr key={emp.user_id} className="hover:bg-blue-50/30 transition-colors">

                    {/* ID */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold">
                        #{emp.user_id}
                      </span>
                    </td>

                    {/* Name + Email */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{emp.first_name} {emp.last_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{emp.email}</p>
                    </td>

                    {/* Job / Dept */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <div>
                          <p className="font-medium text-gray-700 text-sm">{emp.job_title || 'N/A'}</p>
                          <p className="text-xs text-blue-500 font-medium">{emp.dep_name}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {emp.phone || '—'}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadge(emp.attendance_status)}`}>
                        {emp.attendance_status || 'N/A'}
                      </span>
                    </td>

                    {/* Tasks */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-blue-500" />
                          <span className="text-gray-600">
                            <span className="font-semibold text-gray-800">{emp.pending_tasks}</span> pending
                          </span>
                        </div>
                        <div className="w-px h-4 bg-gray-200" />
                        <span className="text-gray-600">
                          <span className="font-semibold text-emerald-600">{emp.in_progress_tasks}</span> active
                        </span>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Footer Summary ── */}
      {!loading && employees.length > 0 && (
        <div className="flex items-center justify-between text-xs text-gray-400 px-1">
          <span>Showing {filteredEmployees.length} of {employees.length} team members</span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live data
          </span>
        </div>
      )}

    </div>
  )
}

export default SupervisorEmployees