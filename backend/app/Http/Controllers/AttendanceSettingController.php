<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AttendanceSetting;
class AttendanceSettingController extends Controller
{
    public function update(Request $request)
{
    // validation
    $request->validate([
        'base_latitude' => 'required',
        'base_longitude' => 'required',
        'work_start_time' => 'required',
        'work_end_time' => 'required',
        'required_working_hours' => 'required|numeric',
        'allowed_radius_meters' => 'required|numeric',
        'late_grace_minutes' => 'required|numeric',
    ]);

    // نجيب record ثابت
    $setting = AttendanceSetting::where('setting_id', 1)->first();

    // لو مش موجود (أول مرة)
    if (!$setting) {
        $setting = AttendanceSetting::create([
            'setting_id' => 1, // تثبيت
            ...$request->all()
        ]);
    } else {
        // update
        $setting->update($request->all());
    }

    return response()->json([
        'message' => 'Settings updated successfully',
        'data' => $setting
    ]);
}

public function index()
{
    $setting = AttendanceSetting::where('setting_id', 1)->first();

    // لو مش موجود (أول مرة)
    if (!$setting) {
        return response()->json([
            'data' => null,
            'message' => 'No settings found yet'
        ]);
    }

    return response()->json([
        'data' => $setting
    ]);
}
}
