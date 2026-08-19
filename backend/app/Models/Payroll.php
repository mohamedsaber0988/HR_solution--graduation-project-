<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    use HasFactory;

    // اسم الجدول في قاعدة البيانات
    protected $table = 'payroll';

    // تحديد المفتاح الأساسي لأن اسمه غير افتراضي
    protected $primaryKey = 'Payroll_id';

    public $timestamps = false;

    // الحقول المسموح بتعديلها وإضافتها (Mass Assignment)
    protected $fillable = [
        'user_id',
        'month',
        'year',
        'overtime',
        'deductions',
        'net_salary',
    ];

    /**
     * تحويل القيم لبيانات منطقية (Casting)
     * ده بيخلي الـ Laravel يتعامل مع الأرقام كـ Floats/Decimals تلقائياً
     */
    protected $casts = [
        'month'      => 'integer',
        'year'       => 'integer',
        'overtime'   => 'decimal:2',
        'deductions' => 'decimal:2',
        'net_salary' => 'decimal:2',
    ];

    public function user()
    {
        // بنربط بـ user_id كـ Foreign Key
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}