<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $table = 'attendance';

    protected $fillable = [
        'user_id',
        'setting_id',
        'date',
        'time_in',
        'time_out',
        'status',
        'late_minutes',
        'early_leave_minutes',
        'overtime_minutes'
    ];

    public $timestamps = false; // لو مفيش created_at / updated_at

    // =========================
    // Relations
    // =========================

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function setting()
    {
        return $this->belongsTo(AttendanceSetting::class, 'setting_id', 'setting_id');
    }
}