<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobVacancy extends Model
{
    protected $table = 'job_vacancies';

    protected $primaryKey = 'vacancy_id';

    public $timestamps = false;
    
    protected $fillable = [
        'title',
        'description',
        'created_by'
    ];
}
