<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ManageUserController;
use App\Http\Controllers\AlertController;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\PerformanceController;
use App\Http\Controllers\JobVacancyController;
use App\Http\Controllers\ApplicationsController;
use App\Http\Controllers\AIProcessingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\AttendanceSettingController;
use App\Http\Controllers\ReportController;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/profile', [AuthController::class, 'profile']);
    
    Route::post('/logout', [AuthController::class, 'logout']);

});


    

Route::middleware('auth:sanctum')->group(function () {

    //add user (admin only)
    Route::post('/add-users', [ManageUserController::class, 'store']);
    // get all users (admin only)   
    Route::get('/admin/users', [ManageUserController::class, 'allUsers']);
    Route::get('/admin/employees', [ManageUserController::class, 'allUsers']);
    Route::post('/admin/employees', [ManageUserController::class, 'store']);

    Route::get('/team/members', [ManageUserController::class, 'teamMembers']);
    // update user (admin only)
    Route::put('/update-users/{id}', [ManageUserController::class, 'update']);
    // delete user (admin only)
    Route::delete('/delete-users/{id}', [ManageUserController::class, 'destroy']);

    Route::get('/team/members', [ManageUserController::class, 'teamMembers']);

});

// routes/api.php
Route::post('/departments', [DepartmentController::class, 'store']);
Route::get('/departments', [DepartmentController::class, 'index']);
Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);

Route::middleware('auth:sanctum')->group(function () {

    // Generate QR
    Route::get('/qrcode', function () {

        $token = Str::random(32);

        Cache::put('qr_token_' . $token, true, now()->addHours(24));

        return response(
            QrCode::size(300)->generate($token),
            200,
            ['Content-Type' => 'image/svg+xml']
        );
    });

    // Scan QR
    Route::post('/scan', [AttendanceController::class, 'scan']);

});

Route::put('/attendance-settings', [AttendanceSettingController::class, 'update']);
Route::get('/attendance-settings', [AttendanceSettingController::class, 'index']);


Route::middleware('auth:sanctum')->group(function () {

    Route::post('/leave-request', [LeaveController::class, 'store']);

});

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/supervisor/leave-requests', [LeaveController::class, 'supervisorLeaves']);

    Route::get('/hr/leave-requests', [LeaveController::class, 'hrManagerLeaves']);

    Route::put('/leave/{id}/approve', [LeaveController::class, 'approve']);

    Route::put('/leave/{id}/reject', [LeaveController::class, 'reject']);

});


Route::middleware('auth:sanctum')->group(function () {

    // get alerts
    Route::get('/alerts', [AlertController::class, 'index']);

    // SSE stream
    Route::get('/alerts/stream', [AlertController::class, 'stream']);

    // mark as read
    Route::post('/alerts/{id}/read', [AlertController::class, 'markAsRead']);

    // optional: unread count endpoint (backup)
    Route::get('/alerts/unread-count', function (Request $request) {
        return response()->json([
            'count' => \App\Models\alerts::where('user_id', $request->user()->user_id)
                ->where('is_read', false)
                ->count()
        ]);
    });
});

Route::middleware('auth:sanctum')->get('/attendance-history', [AttendanceController::class, 'history']);
Route::middleware('auth:sanctum')->get('/current-attendance-history', [AttendanceController::class, 'Current_history']);

Route::middleware('auth:sanctum')->group(function () {
Route::get('/attendance/today-status', [AttendanceController::class, 'getTodayStatus']);
});

Route::middleware('auth:sanctum')->get('/leave-history', [LeaveController::class, 'leaveHistory']);

Route::middleware('auth:sanctum')->group(function () {

    // جلب المهام الخاصة بالموظف الحالي
    Route::get('/my-tasks', [TaskController::class, 'index']);

    // جلب كل المهام اللي السوبرفايزر أنشأها
    Route::get('/tasks/supervisor', [TaskController::class, 'supervisorTasks']);

    // إنشاء مهمة جديدة
    Route::post('/tasks', [TaskController::class, 'store']);

    // جلب تفاصيل مهمة معينة
    Route::get('/tasks/{id}', [TaskController::class, 'show']);

    // تعديل الـ status فقط
    Route::patch('/tasks/{id}', [TaskController::class, 'update']);

    // حذف مهمة
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
});



Route::middleware('auth:sanctum')->group(function () {

    Route::get('/my-payslip', [PayrollController::class, 'getLatestPayslip']);
    
    /**
     * --- روت المدير (Admin Panel / Testing) ---
     * لو المدير عايز يضغط زرار "يولد" الرواتب لشهر معين يدوياً بدل الـ Schedule.
     * بتبعت في الـ Body: {"month": 3, "year": 2026}
     */
    //Route::post('/admin/payroll/generate', [PayrollController::class, 'generateMonthlyPayroll']);

});




Route::middleware(['auth:sanctum'])->group(function () {
    
    Route::get('/performance', [PerformanceController::class, 'index']);

});



Route::middleware('auth:sanctum')->group(function () {

    Route::get('/vacancies', [JobVacancyController::class, 'index']);  
    Route::post('/create-vacancy', [JobVacancyController::class, 'store']);  
    Route::get('/vacancy/{id}', [JobVacancyController::class, 'show']); 
    Route::delete('/delete-vacancy/{id}', [JobVacancyController::class, 'destroy']);

    Route::get('/vacancies/{id}/applications', [JobVacancyController::class, 'getVacancyApplications']);

    Route::get('/vacancies/{id}/ai-filter', [AIProcessingController::class, 'getAIFilteredApplications']);

});



Route::get('/openjobs', [ApplicationsController::class, 'openJobs']);
Route::get('/public-vacancy/{id}', [ApplicationsController::class, 'show']);
Route::post('/apply', [ApplicationsController::class, 'apply']);

Route::middleware('auth:sanctum')->get('/dashboard', [DashboardController::class, 'index']);

Route::middleware('auth:sanctum')->get('/web-hr-dashboard', [DashboardController::class, 'WebHRDashboard']);
Route::middleware('auth:sanctum')->get('/web-supervisor-dashboard', [DashboardController::class, 'WebSupervisorDashboard']);

Route::middleware('auth:sanctum')->group(function () {

    // Attendance Report JSON
    Route::get('/reports/attendance', [
        ReportController::class,
        'attendanceReport'
    ]);

    // Payroll Report JSON
    Route::get('/reports/payroll', [
        ReportController::class,
        'payrollReport'
    ]);


});