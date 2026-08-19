<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tasks extends Model
{
    use HasFactory;

    protected $table = 'tasks'; // لو اسم الجدول مختلف ممكن تعدل هنا

    protected $primaryKey = 'task_id';

   public $timestamps = false; // لو عندك created_at و updated_at

    protected $fillable = [
        'title',
        'description',
        'due_date',
        'status',
        'assigned_to',
        'created_by',
        'created_at',
    ];

    // علاقة المهمة بالموظف اللي اتكلف بيه
    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to', 'user_id');
    }

    // علاقة المهمة باللي أنشأها (السوبرفايزر)
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by', 'user_id');
    }
}