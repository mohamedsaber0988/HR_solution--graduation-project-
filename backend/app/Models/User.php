<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;
    protected $table = 'users';
    protected $primaryKey = 'user_id';
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'emp_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'password',
        'role',
        'job_title',
        'base_salary',
        'department_id',
        'supervisor_id',
        'remember_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    // داخل ملف app/Models/User.php

/**
 * علاقة الموظف بالمهام (Tasks)
 * لاحظ هنا استدعينا الموديل باسمه اللي عندك Tasks
 */
public function tasks()
{
    // 'user_id' هو المفتاح الخارجي في جدول الـ tasks
    return $this->hasMany(\App\Models\Tasks::class, 'assigned_to', 'user_id');
}

/**
 * علاقة الموظف بالحضور (Attendances)
 * تأكد إن الموديل ده اسمه Attendance أو Attendances حسب ما سميته
 */
public function attendances()
{
    return $this->hasMany(\App\Models\Attendance::class, 'user_id', 'user_id');
}

public function department()
{
    // Assuming 'department_id' is the foreign key in users table
    return $this->belongsTo(Department::class, 'department_id');
}
}