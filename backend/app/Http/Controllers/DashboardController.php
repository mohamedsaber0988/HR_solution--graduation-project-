<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Tasks;




class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $today = Carbon::today();
        $month = $request->query('month', Carbon::now()->month);
        $year  = $request->query('year', Carbon::now()->year);
        $now   = Carbon::now();

        // ==========================================
        // 1. Basic Stats (Total, Present, On Leave)
        // ==========================================
        $totalEmployees = User::count();

        $presentToday = Attendance::whereDate('date', $today)
            ->whereIn('status', ['present', 'late'])
            ->count();

        $onLeaveToday = Attendance::whereDate('date', $today)
            ->where('status', 'leave')
            ->count();

        // ============================================================
        // 2. Supervisor Pending Leaves (Detailed List for HR)
        // ============================================================
        // هنا قمنا باستبدال الـ Count بـ Join كامل لجلب بيانات المشرفين وأقسامهم
        $pendingSupervisorLeaves = LeaveRequest::join('users', 'leave_requests.user_id', '=', 'users.user_id')
            ->join('departments', 'users.department_id', '=', 'departments.dep_id')
            ->where('users.role', 'supervisor')
            ->where('leave_requests.status', 'pending')
            ->select(
                'leave_requests.*',
                'users.first_name',
                'users.last_name',
                'departments.dep_name'
            )
            ->get();

        // ==========================================
        // 3. Performance Distribution Logic
        // ==========================================
        $users = User::withCount([
            'tasks as completed_tasks_count' => function ($query) use ($month, $year) {
                $query->whereMonth('due_date', $month)
                      ->whereYear('due_date', $year)
                      ->where('status', 'completed');
            },

            
            'tasks as required_tasks_count' => function ($query) use ($month, $year, $now) {
                $query->whereMonth('due_date', $month)
                      ->whereYear('due_date', $year)
                      ->where(function ($q) use ($now) {
                          $q->where('status', 'completed')
                            ->orWhere('due_date', '<', $now);
                      });
            },

            
            'attendances as total_attendance_count' => function ($query) use ($month, $year) {
                $query->whereMonth('date', $month)
                      ->whereYear('date', $year);
            },

           
            'attendances as present_days_count' => function ($query) use ($month, $year) {
                $query->whereMonth('date', $month)
                      ->whereYear('date', $year)
                      ->whereIn('status', ['present', 'late']);
            },
        ])->get();

        $distribution = [
            'excellent' => 0,
            'good' => 0,
            'average' => 0,
            'needs_improvement' => 0,
        ];

        foreach ($users as $user) {
            
            $taskScore = $user->required_tasks_count > 0
                ? ($user->completed_tasks_count / $user->required_tasks_count) * 100
                : 100;

            
            $attendanceScore = $user->total_attendance_count > 0
                ? ($user->present_days_count / $user->total_attendance_count) * 100
                : 0;

           
            $finalScore = ($taskScore + $attendanceScore) / 2;

            
            $rating = $this->getRatingLabel($finalScore);

            $distribution[$rating]++;
        }

        // =========================
        // 4. Final JSON Response
        // =========================
        return response()->json([
            'status' => 'success',
            'data' => [
                'total_employees' => $totalEmployees,
                'present_today' => $presentToday,
                'on_leave_today' => $onLeaveToday,
                
                'pending_supervisor_leaves' => $pendingSupervisorLeaves, 
                'performance_distribution' => $distribution,
            ]
        ]);
    }


    private function getRatingLabel($score)
    {
        if ($score >= 90) return 'excellent';
        if ($score >= 80) return 'good';
        if ($score >= 60) return 'average';
        return 'needs_improvement';
    }


public function WebHRDashboard(Request $request)
{
    $today = Carbon::today();
    
    
    $lastMonth = Carbon::now()->subMonth();
    $month = $request->query('month', $lastMonth->month);
    $year  = $request->query('year', $lastMonth->year);

    // ==========================================
    // 1. Basic Stats (عامة لكل الشركة)
    // ==========================================
    $totalEmployees = User::count();

    $presentToday = Attendance::whereDate('date', $today)
        ->whereIn('status', ['present', 'late'])
        ->count();

    $onLeaveToday = Attendance::whereDate('date', $today)
        ->where('status', 'leave')
        ->count();

    // ==========================================
    // 2. Pending Supervisor Leaves (طلبات إجازات المشرفين)
    // ==========================================
    $pendingSupervisorLeaves = LeaveRequest::join('users', 'leave_requests.user_id', '=', 'users.user_id')
        ->join('departments', 'users.department_id', '=', 'departments.dep_id')
        ->where('users.role', 'supervisor')
        ->where('leave_requests.status', 'pending')
        ->select(
            'leave_requests.*',
            'users.first_name',
            'users.last_name',
            'departments.dep_name'
        )
        ->get();

    // ==========================================
    // 3. Users Performance Data (للموظفين فقط)
    // ==========================================
    $users = User::with('department')
        ->where('role', 'employee') 
        ->withCount([
            
            'tasks as completed_tasks_count' => function ($query) use ($month, $year) {
                $query->whereMonth('due_date', $month)
                      ->whereYear('due_date', $year)
                      ->where('status', 'completed');
            },
            
            'tasks as required_tasks_count' => function ($query) use ($month, $year) {
                $query->whereMonth('due_date', $month)
                      ->whereYear('due_date', $year);
            },
            
            'attendances as total_attendance_count' => function ($query) use ($month, $year) {
                $query->whereMonth('date', $month)
                      ->whereYear('date', $year);
            },
            
            'attendances as present_days_count' => function ($query) use ($month, $year) {
                $query->whereMonth('date', $month)
                      ->whereYear('date', $year)
                      ->whereIn('status', ['present', 'late']);
            },
        ])->get();

    // ==========================================
    // 4. Distribution + Detailed Performance
    // ==========================================
    $distribution = [
        'excellent' => 0,
        'good' => 0,
        'average' => 0,
        'needs_improvement' => 0,
    ];

    $performances = $users->map(function ($user) use (&$distribution) {

        $taskScore = $user->required_tasks_count > 0
            ? ($user->completed_tasks_count / $user->required_tasks_count) * 100
            : 100; 

        $attendanceScore = $user->total_attendance_count > 0
            ? ($user->present_days_count / $user->total_attendance_count) * 100
            : 0;

        $finalScore = ($taskScore + $attendanceScore) / 2;
        $rating = $this->getRatingLabel($finalScore);

        if (isset($distribution[$rating])) {
            $distribution[$rating]++;
        }

        return [
            'user_id' => $user->user_id,
            'name' => $user->first_name . ' ' . $user->last_name,
            'department_name' => $user->department->dep_name ?? 'N/A',

            'stats' => [
                'completed_tasks' => (int)$user->completed_tasks_count,
                'overdue_tasks'   => max(0, $user->required_tasks_count - $user->completed_tasks_count),
                'present_days'    => (int)$user->present_days_count,
                'absent_days'     => max(0, $user->total_attendance_count - $user->present_days_count),
            ],

            'scores' => [
                'task_performance' => round($taskScore, 1) . '%',
                'attendance_performance' => round($attendanceScore, 1) . '%',
                'final_score' => round($finalScore, 1),
            ],

            'rating' => $rating
        ];
    });

    // ==========================================
    // 5. Final Response
    // ==========================================
    return response()->json([
        'status' => 'success',
        'month'  => (int)$month,
        'year'   => (int)$year,

        'data' => [
            'stats' => [
                'total_employees' => $totalEmployees,
                'present_today' => $presentToday,
                'on_leave_today' => $onLeaveToday,
            ],

            'pending_supervisor_leaves' => $pendingSupervisorLeaves,

            'performance_distribution' => $distribution,

            'performance_details' => $performances,
        ]
    ]);
}


public function WebSupervisorDashboard(Request $request)
    {
        $user = $request->user();
        $today = Carbon::today()->toDateString();
        $isHR = ($user->role === 'admin' || $user->role === 'HR_manager');

        // ==========================================
        // 1. TEAM MEMBERS + ATTENDANCE + TASKS COUNT
        // ==========================================
        $membersQuery = User::join('departments', 'users.department_id', '=', 'departments.dep_id')
            ->leftJoin('attendance', function ($join) use ($today) {
                $join->on('users.user_id', '=', 'attendance.user_id')
                     ->whereDate('attendance.date', $today);
            })
            ->leftJoin('tasks', 'users.user_id', '=', 'tasks.assigned_to');

        if (!$isHR) {
            $membersQuery->where('users.department_id', $user->department_id);
        }

        $members = $membersQuery->where('users.role', 'employee')
            ->groupBy(
                'users.user_id',
                'users.first_name',
                'users.last_name',
                'users.job_title',
                'departments.dep_name',
                'attendance.status'
            )
            ->select(
                'users.user_id',
                'users.first_name',
                'users.last_name',
                'users.job_title',
                'departments.dep_name',
                DB::raw("COALESCE(attendance.status, 'absent') as attendance_status"),
                DB::raw("SUM(CASE WHEN tasks.status = 'pending' THEN 1 ELSE 0 END) as pending_tasks"),
                DB::raw("SUM(CASE WHEN tasks.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks"),
                DB::raw("SUM(CASE WHEN tasks.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks")
            )
            ->get();

        // ==========================================
        // 2. STATS
        // ==========================================
        $teamSize = $members->count();

        $leavesQuery = LeaveRequest::join('users', 'leave_requests.user_id', '=', 'users.user_id');
        if (!$isHR) {
            $leavesQuery->where('users.department_id', $user->department_id);
        }
        $pendingLeavesCount = $leavesQuery->where('users.role', 'employee')
            ->where('leave_requests.status', 'pending')
            ->count();

        $tasksQuery = Tasks::join('users', 'tasks.assigned_to', '=', 'users.user_id');
        if (!$isHR) {
            $tasksQuery->where('users.department_id', $user->department_id);
        }
        $activeTasksCount = $tasksQuery->whereIn('tasks.status', ['pending', 'in_progress'])
            ->count();

        // ==========================================
        // 3. TASK CHART
        // ==========================================
        $taskStatsQuery = Tasks::join('users', 'tasks.assigned_to', '=', 'users.user_id');
        if (!$isHR) {
            $taskStatsQuery->where('users.department_id', $user->department_id);
        }
        $taskStats = $taskStatsQuery->select(
                DB::raw("SUM(CASE WHEN tasks.status = 'completed' THEN 1 ELSE 0 END) as completed"),
                DB::raw("SUM(CASE WHEN tasks.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress"),
                DB::raw("SUM(CASE WHEN tasks.status = 'pending' THEN 1 ELSE 0 END) as pending")
            )
            ->first();

        $taskChart = [
            ['name' => 'Completed', 'value' => (int)$taskStats->completed],
            ['name' => 'In Progress', 'value' => (int)$taskStats->in_progress],
            ['name' => 'Pending', 'value' => (int)$taskStats->pending],
        ];

        // ==========================================
        // 4. RECENT LEAVES
        // ==========================================
        $recentLeavesQuery = LeaveRequest::join('users', 'leave_requests.user_id', '=', 'users.user_id');
        if (!$isHR) {
            $recentLeavesQuery->where('users.department_id', $user->department_id);
        }
        $recentLeaves = $recentLeavesQuery->where('users.role', 'employee')
            ->select(
                'leave_requests.leave_id',
                'leave_requests.leave_type',
                'leave_requests.start_date',
                'leave_requests.status',
                'users.first_name',
                'users.last_name'
            )
            ->latest('leave_requests.created_at')
            ->limit(5)
            ->get();

        // ==========================================
        // FINAL RESPONSE
        // ==========================================
        return response()->json([
            'stats' => [
                'team_size' => $teamSize,
                'pending_leaves' => $pendingLeavesCount,
                'active_tasks' => $activeTasksCount,
            ],
            'task_chart' => $taskChart,
            'recent_leaves' => $recentLeaves->map(function ($leave) {
                return [
                    'leave_id' => $leave->leave_id,
                    'first_name' => $leave->first_name,
                    'last_name' => $leave->last_name,
                    'leave_type' => $leave->leave_type,
                    'start_date' => $leave->start_date,
                    'status' => $leave->status,
                ];
            }),
            'team_members' => $members->map(function ($emp) {
                return [
                    'user_id' => $emp->user_id,
                    'first_name' => $emp->first_name,
                    'last_name' => $emp->last_name,
                    'job_title' => $emp->job_title,
                    'attendance_status' => $emp->attendance_status,
                ];
            }),
        ]);
    }

}
