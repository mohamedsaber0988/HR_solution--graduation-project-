<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $table = 'departments'; // اسم الجدول

    protected $primaryKey = 'dep_id'; // المفتاح الأساسي

    public $timestamps = false; // لو مش عايز created_at, updated_at

    protected $fillable = [
        'dep_name',
        'description',
    ];

    // لو عايز تعرف الـ users في كل قسم
    public function users()
    {
        return $this->hasMany(User::class, 'department_id', 'dep_id');
    }
}