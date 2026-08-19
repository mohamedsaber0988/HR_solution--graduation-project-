<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LeaveRequest;
use App\Models\Alerts; 
use App\Models\LeaveBalance;
use App\Models\Attendance;
use App\Models\AttendanceSetting;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class LeaveController extends Controller
{
    
    public function store(Request $request)
    {
        $request->validate([
            'leave_type' => 'required|string',
            'reason' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'sick_pdf' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048'
        ]);

        $user = $request->user();
        $days = Carbon::parse($request->start_date)->diffInDays(Carbon::parse($request->end_date)) + 1;

        
        $balance = LeaveBalance::where('user_id', $user->user_id)
            ->where('year', Carbon::parse($request->start_date)->year)
            ->first();

        if (!$balance || !isset($balance->{$request->leave_type}) || $balance->{$request->leave_type} < $days) {
            return response()->json(['message' => 'Insufficient leave balance'], 400);
        }

        return DB::transaction(function () use ($request, $user, $days, $balance) {
            $status = 'pending';

            if ($user->role === 'HR_manager' or $user->role === 'admin') {
                $status = 'approved';
                
                $this->executeApprovalActions($user->user_id, strtolower($request->leave_type), $days, $request->start_date, $request->end_date);
            }

            $sickPdfPath = null;
            if ($request->hasFile('sick_pdf')) {
                $file = $request->file('sick_pdf');
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('uploads/sick_leaves'), $filename);
                $sickPdfPath = 'uploads/sick_leaves/' . $filename;
            }

            $leave = LeaveRequest::create([
                'user_id' => $user->user_id,
                'leave_type' => $request->leave_type,
                'reason' => $request->reason,
                'status' => $status,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'sick_pdf' => $sickPdfPath,
            ]);

            return response()->json([
                'message' => $status === 'approved' ? 'Leave approved automatically' : 'Leave request submitted',
                'data' => $leave
            ]);
        });
    }

   
    public function supervisorLeaves(Request $request)
    {
        $user = $request->user();
        $query = LeaveRequest::join('users', 'leave_requests.user_id', '=', 'users.user_id');

        
        if ($user->role !== 'admin' && $user->role !== 'HR_manager') {
            $query->where('users.department_id', $user->department_id);
        }

        $status = $request->query('status'); 

        if ($status) {
            $query->where('leave_requests.status', $status);
        }

        $leaves = $query->where('users.role', 'employee')
            ->select(
                'leave_requests.leave_id as id',
                'leave_requests.leave_type',
                'leave_requests.start_date',
                'leave_requests.end_date',
                'leave_requests.reason',
                'leave_requests.status',
                'leave_requests.sick_pdf',
                'users.first_name',
                'users.last_name'
            )
            ->get();

        return response()->json(['success' => true, 'data' => $leaves]);
    }

    
public function hrManagerLeaves(Request $request)
{
    $status = $request->query('status');

    $query = LeaveRequest::join('users', 'leave_requests.user_id', '=', 'users.user_id')
        ->join('departments', 'users.department_id', '=', 'departments.dep_id')
        ->whereIn('users.role', ['supervisor']);

    if ($status) {
        $query->where('leave_requests.status', $status);
    }

    $leaves = $query->select(
            'leave_requests.leave_id as id', 
            'leave_requests.leave_type',
            'leave_requests.start_date',
            'leave_requests.end_date',
            'leave_requests.reason',
            'leave_requests.status',
            'leave_requests.sick_pdf',
            'users.first_name',
            'users.last_name',
            'departments.dep_name'
        )
        ->orderBy('leave_requests.created_at', 'desc') 
        ->get();

    return response()->json(['success' => true, 'data' => $leaves]);
}

    
    public function approve($id)
    {
        return DB::transaction(function () use ($id) {
            $leave = LeaveRequest::find($id);

            if (!$leave || $leave->status === 'approved') {
                return response()->json(['message' => 'Request not found or already approved'], 404);
            }

            $days = Carbon::parse($leave->start_date)->diffInDays(Carbon::parse($leave->end_date)) + 1;

            
            $this->executeApprovalActions($leave->user_id, strtolower($leave->leave_type), $days, $leave->start_date, $leave->end_date);

            $leave->status = 'approved';
            $leave->save();

            return response()->json(['message' => 'Leave approved successfully']);
        });
    }

    
    public function reject($id)
    {
        $leave = LeaveRequest::find($id);
        if (!$leave) return response()->json(['message' => 'Request not found'], 404);

        $leave->status = 'rejected';
        $leave->save();

        Alerts::create([
            'user_id' => $leave->user_id,
            'alert_type' => 'leave_rejected',
            'content' => 'Your leave request has been rejected'
        ]);

        return response()->json(['message' => 'Leave rejected']);
    }

   
    public function leaveHistory(Request $request)
    {
        $user = $request->user();
        $currentYear = Carbon::now()->year;

        $leaves = LeaveRequest::where('user_id', $user->user_id)
            ->orderBy('start_date', 'desc')
            ->get()
            ->map(function ($leave) {
                return [
                    'id' => $leave->id,
                    'leave_type' => $leave->leave_type,
                    'status' => $leave->status,
                    'start_date' => $leave->start_date,
                    'end_date' => $leave->end_date,
                    'sick_pdf' => $leave->sick_pdf,
                    'duration' => Carbon::parse($leave->start_date)->diffInDays(Carbon::parse($leave->end_date)) + 1
                ];
            });

        $balance = LeaveBalance::where('user_id', $user->user_id)
            ->where('year', $currentYear)
            ->first();

        return response()->json([
            'leave_balance' => [
                'annual' => $balance->annual ?? 0,
                'sick'   => $balance->sick ?? 0,
                'casual' => $balance->casual ?? 0
            ],
            'leave_history' => $leaves
        ]);
    }

    
    private function executeApprovalActions($userId, $type, $days, $start, $end)
    {
        $startDate = Carbon::parse($start);
        $endDate = Carbon::parse($end);

        
        $balance = LeaveBalance::where('user_id', $userId)
            ->where('year', $startDate->year)
            ->first();
            
        if ($balance) {
            $column = strtolower($type);
            $balance->{$column} -= $days;
            $balance->save();
        }

        
        Alerts::create([
            'user_id' => $userId,
            'alert_type' => 'leave_approved',
            'content' => 'Your leave request from ' . $start . ' has been approved'
        ]);

        
        $setting = AttendanceSetting::first();
        $settingId = $setting ? $setting->setting_id : null;

        
        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            Attendance::updateOrCreate(
                ['user_id' => $userId, 'date' => $date->format('Y-m-d')],
                [
                    'setting_id' => $settingId,
                    'status' => 'leave', 
                    'time_in' => null, 
                    'time_out' => null
                ]
            );
        }
    }
}