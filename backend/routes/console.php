<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Console\Commands\MarkYesterdayAbsent;
use App\Console\Commands\ProcessMonthlyPayroll;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('attendance:mark-absent')->monthlyOn(1, '00:05');

Schedule::command('payroll:process-all')->dailyAt('1:00');