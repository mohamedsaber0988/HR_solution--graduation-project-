<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\LeaveBalance;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class ManageUserController extends Controller
{
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'     => 'required|string|max:255',
            'last_name'      => 'required|string|max:255',
            'email'          => 'required|email|unique:users,email',
            'password'       => 'required|min:6',
            'role'           => 'required|string',
            'base_salary'    => 'nullable|numeric|min:0', // إضافة min:0 للأمان
            'phone'          => 'nullable|string',
            'job_title'      => 'nullable|string',
            'department_id'  => 'nullable|integer',
            'supervisor_id'  => 'nullable|integer',
        ]);

        return DB::transaction(function () use ($validated) {
            $user = User::create([
                'first_name'     => $validated['first_name'],
                'last_name'      => $validated['last_name'],
                'email'          => $validated['email'],
                'password'       => Hash::make($validated['password']),
                'role'           => $validated['role'],
                'base_salary'    => $validated['base_salary'] ?? 0,
                'phone'          => $validated['phone'],
                'job_title'      => $validated['job_title'],
                'department_id'  => $validated['department_id'],
                'supervisor_id'  => $validated['supervisor_id'] ?? null,
            ]);

            LeaveBalance::create([
                'user_id' => $user->user_id,
                'year'    => date('Y'),
                'annual'  => 21,
                'sick'    => 10,
                'casual'  => 5
            ]);

            return response()->json([
                'message' => 'User created successfully',
                'user' => $user
            ], 201);
        });
    }

    
    public function allUsers(Request $request)
    {
        $users = User::leftJoin('departments', 'users.department_id', '=', 'departments.dep_id')
            ->select(
                'users.user_id',
                'users.first_name',
                'users.last_name',
                'users.email',
                'users.phone',
                'users.role',
                'users.job_title',
                'users.base_salary',
                'users.department_id', 
                'departments.dep_name as department_name',
                'users.supervisor_id'
            )
            ->orderBy('users.user_id', 'desc')
            ->get();

        return response()->json([
            'data' => $users
        ]);
    }

    
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'first_name'     => 'sometimes|string|max:255',
            'last_name'      => 'sometimes|string|max:255',
            'email'          => 'sometimes|email|unique:users,email,' . $user->user_id . ',user_id',
            'password'       => 'nullable|string|min:6', 
            'phone'          => 'sometimes|string', 
            'role'           => 'sometimes|string',
            'base_salary'    => 'sometimes|numeric|min:0',
            'job_title'      => 'sometimes|string',
            'department_id'  => 'nullable|integer',
            'supervisor_id'  => 'nullable|integer'
        ]);

        
        $user->fill($request->except(['password']));

        
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

   
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        
        LeaveBalance::where('user_id', $user->user_id)->delete();
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function teamMembers(Request $request)
{
    $user = $request->user();
    $today = Carbon::today()->toDateString();
    $isHR = ($user->role === 'admin' || $user->role === 'HR_manager');

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
            'users.email',
            'users.phone',
            'users.job_title',
            'departments.dep_name',
            'attendance.status'
        )
        ->select(
            'users.user_id',
            'users.first_name',
            'users.last_name',
            'users.email',
            'users.phone',
            'users.job_title',
            'departments.dep_name',

            // ✅ attendance
            DB::raw("COALESCE(attendance.status, 'absent') as attendance_status"),

            // ✅ tasks count
            DB::raw("SUM(CASE WHEN tasks.status = 'pending' THEN 1 ELSE 0 END) as pending_tasks"),
            DB::raw("SUM(CASE WHEN tasks.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks")
        )
        ->get();

    return response()->json([
        'data' => $members
    ]);

}

}



