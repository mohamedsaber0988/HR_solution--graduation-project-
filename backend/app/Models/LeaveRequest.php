<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    protected $table = 'leave_requests';

    protected $primaryKey = 'leave_id';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'leave_type',
        'reason',
        'status',
        'start_date',
        'end_date',
        'sick_pdf'
    ];
}