<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Attendance;
use App\Models\Payroll;
use Carbon\Carbon;

class PayrollController extends Controller
{
    /**
     * عرض آخر Payslip للموظف (Mobile App)
     */
    public function getLatestPayslip(Request $request)
{
    $user = $request->user();

    $payroll = Payroll::where('user_id', $user->user_id)
        ->orderBy('year', 'desc')
        ->orderBy('month', 'desc')
        ->first();

    if (!$payroll) {
        return response()->json(['message' => 'لا يوجد مرتبات مسجلة'], 404);
    }

    return response()->json([
        'status' => 'success',
        'data' => [
            'payroll_id'   => $payroll->Payroll_id,
            'month_name'   => \Carbon\Carbon::create()->month($payroll->month)->translatedFormat('F'),
            'year'         => $payroll->year,
            'financials' => [
                'base_salary' => number_format($user->base_salary, 2), // التسمية الصح
                'overtime'    => number_format($payroll->overtime, 2),
                'deductions'  => number_format($payroll->deductions, 2),
                'net_total'   => number_format($payroll->net_salary, 2),
            ],
            'generated_at' => Carbon::parse($payroll->created_at)->format('Y-m-d')
        ]
    ]);
}


    public function calculateAndSavePayroll($user, $month, $year)
    {
        $basicSalary = $user->base_salary ?? 0;
        $dayRate     = $basicSalary / 30;
        $hourRate    = $dayRate / 8;
        $minuteRate  = $hourRate / 60;
        
        $overtimeMultiplier = 1.5;

        // حساب الخصومات والإضافي
        $absentDays = Attendance::where('user_id', $user->user_id)
            ->whereMonth('date', $month)->whereYear('date', $year)
            ->where('status', 'absent')->count();
            
        $totalLateMinutes = Attendance::where('user_id', $user->user_id)
            ->whereMonth('date', $month)->whereYear('date', $year)
            ->sum('late_minutes');

        $totalOvertimeMinutes = Attendance::where('user_id', $user->user_id)
            ->whereMonth('date', $month)->whereYear('date', $year)
            ->sum('overtime_minutes');

        $deductions = ($absentDays * $dayRate) + ($totalLateMinutes * $minuteRate);
        $overtimeEarnings = ($totalOvertimeMinutes * $minuteRate) * $overtimeMultiplier;
        $netSalary = ($basicSalary + $overtimeEarnings) - $deductions;

        return Payroll::updateOrCreate(
            ['user_id' => $user->user_id, 'month' => $month, 'year' => $year],
            [
                'overtime'    => round($overtimeEarnings, 2),
                'deductions'  => round($deductions, 2),
                'net_salary'  => round($netSalary, 2),
            ]
        );
    }
}