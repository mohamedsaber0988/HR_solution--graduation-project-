<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceSetting extends Model
{
    protected $primaryKey = 'setting_id';

    protected $fillable = [
        'name',
        'base_latitude',
        'base_longitude',
        'work_start_time',
        'work_end_time',
        'required_working_hours',
        'allowed_radius_meters',
        'late_grace_minutes'
    ];

    public $timestamps = false;

    // =========================
    // Relations
    // =========================

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'setting_id', 'setting_id');
    }
}