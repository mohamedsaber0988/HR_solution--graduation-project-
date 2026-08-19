<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class alerts extends Model
{
    protected $table = 'alerts';

    protected $primaryKey = 'alert_id';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'alert_type',
        'content',
        'created_at',
        'is_read',
        'read_at'

    ];
}