<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Applications extends Model
{
    use HasFactory;

    
    protected $table = 'applications';

   
    protected $primaryKey = 'application_id';

    
    protected $fillable = [
        'applicant_id', 
        'vacancy_id',   
        'cv_file',      
    ];

    public function applicant()
    {
        // افترضت أن جدول المستخدمين هو 'users' والمفتاح فيه 'user_id'
        return $this->belongsTo(User::class, 'applicant_id', 'user_id');
    }

    public function vacancy()
    {
        return $this->belongsTo(JobVacancy::class, 'vacancy_id', 'vacancy_id');
    }

    public function getCvUrlAttribute()
    {
        return $this->cv_file ? asset('storage/' . $this->cv_file) : null;
    }
}