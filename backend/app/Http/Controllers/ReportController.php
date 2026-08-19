<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Attendance;
use App\Models\Payroll;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log; // أضفنا هذا للـ Debugging

class ReportController extends Controller
{
    public function attendanceReport(Request $request)
    {
        // --- START DEBUGGING ---
        Log::info('--- Attendance Report Request Received ---');
        Log::info('All Inputs:', $request->all());
        // --- END DEBUGGING ---

        $month = (int) ($request->month ?? Carbon::now()->month);
        $year = (int) ($request->year ?? Carbon::now()->year);
        $empId = $request->input('employee_id');

        $users = User::query()
            ->when(!empty($empId), function ($q) use ($empId) {
                Log::info("Filtering Attendance by Employee ID: $empId");
                // تأكد أن العمود اسمه user_id في جدول الـ users
                return $q->where('user_id', $empId);
            })
            ->withCount([
                'attendances as present_days' => function ($q) use ($month, $year) {
                    $q->whereMonth('date', $month)->whereYear('date', $year)->where('status', 'present');
                },
                'attendances as late_days' => function ($q) use ($month, $year) {
                    $q->whereMonth('date', $month)->whereYear('date', $year)->where('status', 'late');
                },
                'attendances as absent_days' => function ($q) use ($month, $year) {
                    $q->whereMonth('date', $month)->whereYear('date', $year)->where('status', 'absent');
                },
                'attendances as leave_days' => function ($q) use ($month, $year) {
                    $q->whereMonth('date', $month)->whereYear('date', $year)->where('status', 'leave');
                }
            ])
            ->withSum(['attendances as total_overtime' => function ($q) use ($month, $year) {
                $q->whereMonth('date', $month)->whereYear('date', $year);
            }], 'overtime_minutes') 
            ->get();

        Log::info('Users Found Count: ' . $users->count());

        $report = $users->map(function ($user) {
            return [
                'employee_id' => $user->user_id,
                'employee_name' => $user->first_name . ' ' . $user->last_name,
                'attendance' => [
                    'present_days' => $user->present_days,
                    'late_days'    => $user->late_days,
                    'leave_days'   => $user->leave_days,
                    'absent_days'  => $user->absent_days,
                    'overtime_hours' => round(($user->total_overtime ?? 0) / 60, 1),
                ]
            ];
        });

        return response()->json([
            'status' => 'success',
            'debug_received_params' => $request->all(), // عشان تشوفها في الـ Browser Network
            'month'  => $month,
            'year'   => $year,
            'data'   => $report
        ]);
    }

public function payrollReport(Request $request)
{
    $empId = $request->input('employee_id');

    // 1. جلب البيانات بدون التقيد بشهر أو سنة محددة
    // الاعتماد كلياً على سجلات جدول payroll
    $payrolls = Payroll::with(['user:user_id,first_name,last_name'])
        ->when(!empty($empId), function ($q) use ($empId) {
            return $q->where('user_id', $empId);
        })
        ->orderBy('year', 'desc') // ترتيب من الأحدث للأقدم
        ->orderBy('month', 'desc')
        ->get();

    // 2. معالجة البيانات لإرجاع المطلوب فقط مع بيانات الوقت
    $report = $payrolls->map(function ($payroll) {
        return [
            'id'         => $payroll->user_id,
            'name'       => optional($payroll->user)->first_name . ' ' . optional($payroll->user)->last_name,
            'net_salary' => $payroll->net_salary,
            'month'      => (int) $payroll->month, // الشهر الخاص بالركورد
            'year'       => (int) $payroll->year,  // السنة الخاصة بالركورد
        ];
    });

    return response()->json([
        'status' => 'success',
        'total_records' => $payrolls->count(),
        'data'   => $report
    ]);
}

}