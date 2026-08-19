<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveBalance extends Model
{
    use HasFactory;

    protected $table = 'leave_balances';

    // خلي الأعمدة اللي هنعمل لها mass assignment
    protected $fillable = [
        'user_id',
        'year',
        'annual',
        'sick',
        'casual',
    ];
    public $timestamps = false;
}