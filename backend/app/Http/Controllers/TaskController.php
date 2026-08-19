<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tasks;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    // جلب المهام المخصصة للموظف الحالي
   public function index(Request $request)
{
    $user = $request->user();
    
    // جلب التاسكات مباشرة بدون عمل Join مع جدول المستخدمين
    $tasks = Tasks::where('assigned_to', $user->user_id)
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json($tasks);
}

public function store(Request $request)
{
    $request->validate([
        'title'       => 'required|string|max:255',
        'description' => 'nullable|string',
        'due_date'    => 'required|date|after_or_equal:today',
        'assigned_to' => 'required|exists:users,user_id'
    ]);

    $task = Tasks::create([
        'title'       => $request->title,
        'description' => $request->description,
        'due_date'    => $request->due_date,
        'assigned_to' => $request->assigned_to,
        'created_by'  => $request->user()->user_id
    ]);

    DB::table('alerts')->insert([
        'user_id'    => $task->assigned_to,
        'alert_type' => 'task_assigned',
        'content'    => 'New task assigned: ' . $task->title,
        'created_at' => now(),
        'is_read'    => 0,
        'read_at'    => null,
    ]);

    return response()->json([
        'message' => 'Task created successfully'
    ], 201);
}

public function supervisorTasks(Request $request)
{
    $user = $request->user();
    $query = Tasks::join('users', 'tasks.assigned_to', '=', 'users.user_id');

    // HR Managers and Admins can see all tasks. Supervisors only see their department's tasks.
    if ($user->role !== 'admin' && $user->role !== 'HR_manager') {
        $query->where('users.department_id', $user->department_id);
    }

    $tasks = $query->where('users.role', 'employee')
        ->where('users.user_id', '!=', $user->user_id)
        ->select(
            'tasks.task_id',
            'tasks.title',
            'tasks.description',
            'tasks.status',
            'tasks.due_date',
            'tasks.assigned_to',
            'tasks.created_by',
            'users.first_name',
            'users.last_name'
        )
        ->orderBy('tasks.created_at', 'desc')
        ->get();

    return response()->json($tasks);
}

    // جلب تفاصيل مهمة واحدة مع حماية الخصوصية
    public function show($id)
    {
        $user = Auth::user();
        $task = Tasks::findOrFail($id);

        // حماية: مسموح فقط للمسؤول عن المهمة أو منشئها برؤيتها
        if ($task->assigned_to != $user->user_id && $task->created_by != $user->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($task);
    }

    // تعديل الـ status مع حماية
public function update(Request $request, $id)
{
    $task = Tasks::findOrFail($id);
    $user = $request->user();

    // السماح للـ supervisor أو صاحب المهمة
    $isSupervisor = $user->role === 'supervisor';

    if (!$isSupervisor && $task->assigned_to != $user->user_id) {
        return response()->json([
            'message' => 'Unauthorized'
        ], 403);
    }

    // تحويل progress => in_progress
    $status = match ($request->status) {
        'progress' => 'in_progress',
        default => $request->status,
    };

    // تحديث القيمة داخل الـ request
    $request->merge([
        'status' => $status
    ]);

    $request->validate([
        'status' => 'required|in:pending,in_progress,completed'
    ]);

    $task->update([
        'status' => $request->status
    ]);

    // Alert عند اكتمال المهمة
    if ($request->status === 'completed') {

        DB::table('alerts')->insert([
            'user_id'    => $task->created_by,
            'alert_type' => 'task_completed',
            'content'    => 'Task "' . $task->title . '" has been completed.',
            'created_at' => now(),
            'is_read'    => 0,
            'read_at'    => null,
        ]);
    }

    return response()->json([
        'message' => 'Status updated successfully',
        'task' => $task
    ]);
}



    // حذف مهمة (للمشرف فقط)
    public function destroy($id)
{
    $task = Tasks::findOrFail($id);
    $user = request()->user();

    $isSupervisor = $user->role === 'supervisor';

    // supervisor يقدر يمسح أي task في قسمه
    if (!$isSupervisor && $task->created_by != $user->user_id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $task->delete();

    return response()->json(['message' => 'Task deleted successfully']);
}
}