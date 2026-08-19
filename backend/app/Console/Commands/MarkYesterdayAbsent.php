<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Attendance;
use Carbon\Carbon;

class MarkYesterdayAbsent extends Command
{
    // الاسم اللي هنشغل بيه الأمر
    protected $signature = 'attendance:mark-absent';
    protected $description = 'تسجيل الموظفين الذين لم يحضروا بالأمس كغائبين';

public function handle()
{
    $yesterday = Carbon::yesterday();

    // منع التسجيل في أيام الإجازات (الجمعة والسبت)
    if ($yesterday->isFriday() || $yesterday->isSaturday()) {
        $this->info('اليوم إجازة نهاية الأسبوع، لم يتم تسجيل غياب.');
        return;
    }

    // جلب "كل" المستخدمين بدون أي شروط
    $allUsers = User::all(); 

    foreach ($allUsers as $user) {
        // التأكد إن ملوش سجل حضور أو إجازة في اليوم ده
        $exists = Attendance::where('user_id', $user->user_id)
                            ->whereDate('date', $yesterday)
                            ->exists();

        if (!$exists) {
            Attendance::create([
                'user_id' => $user->user_id,
                'date'    => $yesterday,
                'status'  => 'absent',
            ]);
        }
    }

    $this->info('تم فحص وتسجيل غياب جميع المستخدمين ليوم أمس.');
}
}