<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\AttendanceSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;


class AttendanceController extends Controller
{
    public function scan(Request $request)
{
    $request->validate([
        'token' => 'required',
        'lat' => 'required|numeric',
        'lng' => 'required|numeric'
    ]);

    $token = $request->token;

    if (!Cache::has('qr_token_' . $token)) {
        return response()->json([
            'message' => 'Invalid or expired QR'
        ], 401);
    }

    $user = $request->user();
    $today = now()->toDateString();
    $now = Carbon::now();

    // =========================
    // GET SETTINGS
    // =========================
    $setting = AttendanceSetting::first(); 

    // =========================
    // LOCATION CHECK
    // =========================
    $distance = $this->calculateDistance(
        $request->lat,
        $request->lng,
        $setting->base_latitude,
        $setting->base_longitude
    );

    if ($distance > $setting->allowed_radius_meters) {
        return response()->json([
            'message' => 'You are خارج نطاق الشركة'
        ], 403);
    }

    $attendance = Attendance::where('user_id', $user->user_id)
        ->where('date', $today)
        ->first();

    // =========================
    // CHECK IN
    // =========================
    if (!$attendance) {

        $officialStart = Carbon::parse($setting->work_start_time);
        $grace = $setting->late_grace_minutes;

        $lateMinutes = 0;

        if ($now->gt($officialStart->copy()->addMinutes($grace))) {
            $lateMinutes = $officialStart->diffInMinutes($now);
        }

        $attendance = Attendance::create([
            'user_id' => $user->user_id,
            'setting_id' => $setting->setting_id,
            'date' => $today,
            'time_in' => $now->toTimeString(),
            'status' => $lateMinutes > 0 ? 'late' : 'present',
            'late_minutes' => $lateMinutes,
            'early_leave_minutes' => 0,
            'overtime_minutes' => 0
        ]);

        

        return response()->json([
            'message' => 'Checked In',
            'data' => $attendance
        ]);
    }

    // =========================
    // CHECK OUT
    // =========================
    if (!$attendance->time_out) {

        $officialEnd = Carbon::parse($setting->work_end_time);

        $earlyLeave = 0;
        $overtime = 0;

        if ($now->lt($officialEnd)) {
            $earlyLeave = $now->diffInMinutes($officialEnd);
        }

        if ($now->gt($officialEnd)) {
            $overtime = $officialEnd->diffInMinutes($now);
        }

        $attendance->update([
            'time_out' => $now->toTimeString(),
            'early_leave_minutes' => $earlyLeave,
            'overtime_minutes' => $overtime
        ]);

        

        return response()->json([
            'message' => 'Checked Out',
            'data' => $attendance
        ]);
    }

    return response()->json([
        'message' => 'Attendance already completed'
    ], 400);
}

private function calculateDistance($lat1, $lon1, $lat2, $lon2)
{
    $earthRadius = 6371000; // meters

    $dLat = deg2rad($lat2 - $lat1);
    $dLon = deg2rad($lon2 - $lon1);

    $a = sin($dLat / 2) * sin($dLat / 2) +
        cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
        sin($dLon / 2) * sin($dLon / 2);

    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

    return $earthRadius * $c;
}

   public function history(Request $request)
{
    $user = $request->user();

    
    $start = Carbon::now()->subMonth()->startOfMonth()->format('Y-m-d');
    $end = Carbon::now()->subMonth()->endOfMonth()->format('Y-m-d');

    
    $attendanceData = Attendance::where('user_id', $user->user_id)
        ->whereBetween('date', [$start, $end])
        ->orderBy('date', 'desc')
        ->get();

    $records = $attendanceData->map(function ($item) {
        return [
            'date'     => $item->date,
            'day'      => Carbon::parse($item->date)->format('l'),
            'in_time'  => $item->time_in,
            'out_time' => $item->time_out,
            'status'   => strtolower($item->status),
        ];
    });

    return response()->json([
        'records' => $records,
        'summary' => [
            'present_days' => $attendanceData->where('status', 'present')->count(),
            'absent_days'  => $attendanceData->where('status', 'absent')->count(),
            'leave_days'   => $attendanceData->where('status', 'leave')->count(),
            'late_days'    => $attendanceData->where('status', 'late')->count(),
        ]
    ]);
}

public function Current_history(Request $request)
{
    $user = $request->user();

    $start = Carbon::now()->startOfMonth()->format('Y-m-d');
    $end = Carbon::now()->endOfMonth()->format('Y-m-d');

    
    $attendanceData = Attendance::where('user_id', $user->user_id)
        ->whereBetween('date', [$start, $end])
        ->orderBy('date', 'desc')
        ->get();

    $records = $attendanceData->map(function ($item) {
        return [
            'date'     => $item->date,
            'day'      => Carbon::parse($item->date)->format('l'),
            'in_time'  => $item->time_in, 
            'out_time' => $item->time_out, 
            'status'   => strtolower($item->status),
        ];
    });

    return response()->json([
        'records' => $records,
        'summary' => [
            'present_days' => $attendanceData->where('status', 'present')->count(),
            'absent_days'  => $attendanceData->where('status', 'absent')->count(),
            'leave_days'   => $attendanceData->where('status', 'leave')->count(),
        ]
    ]);
} 


public function getTodayStatus(Request $request)
{
    $user = $request->user();
    $today = now()->toDateString();

    
    $attendance = Attendance::where('user_id', $user->user_id)
        ->where('date', $today)
        ->first();

    if (!$attendance) {
        return response()->json([
            'status' => 'not_checked_in',
            'check_in' => '--:--',
            'check_out' => '--:--',
            'label' => 'Absent / Not Started'
        ]);
    }

    return response()->json([
        'status' => $attendance->status, 
        'check_in' => $attendance->time_in ? Carbon::parse($attendance->time_in)->format('h:i A') : '--:--',
        'check_out' => $attendance->time_out ? Carbon::parse($attendance->time_out)->format('h:i A') : '--:--',
        'label' => $attendance->time_out ? 'Work Completed' : 'Checked In'
    ]);
}
}