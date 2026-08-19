<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Http\Controllers\PayrollController;
use Carbon\Carbon;

class ProcessMonthlyPayroll extends Command
{
    protected $signature = 'payroll:process-all';
    protected $description = 'حساب وإصدار رواتب الشهر الماضي لجميع الموظفين أوتوماتيكياً';

    public function handle()
    {
        // التصحيح هنا: نستخدم subMonth() للحصول على تاريخ الشهر الماضي
        $lastMonthDate = Carbon::now()->subMonth(); 
        
        // الوصول للقيم كخصائص (Properties) بحروف صغيرة
        $month = $lastMonthDate->month; 
        $year = $lastMonthDate->year;

        $this->info("جاري بدء حساب رواتب شهر $month لسنة $year...");

        $payrollController = new PayrollController();
        $users = User::all();

        if ($users->isEmpty()) {
            $this->error("لا يوجد موظفين في قاعدة البيانات.");
            return;
        }

        foreach ($users as $user) {
            $this->info("يتم الآن معالجة: " . $user->first_name);
            $payrollController->calculateAndSavePayroll($user, $month, $year);
        }

        $this->info("✅ تم إصدار جميع الرواتب بنجاح لشهر $month.");
    }
}