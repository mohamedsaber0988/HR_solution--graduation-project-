<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
        'role' => $user->role
                ]
        ]);
    }

     public function profile(Request $request)
    {
        // التحقق من أن المستخدم مسجل دخول
        $user = $request->user();

        // تحميل علاقة القسم (Department) إذا كانت موجودة
        $user->load('department');

        return response()->json([
            'status' => 'success',
            'data' => [
                'id'         => $user->user_id,
                'name'       => $user->first_name . ' ' . $user->last_name,
                'job_title'  => $user->job_title ?? 'N/A',
                'department' => $user->department->dep_name ?? 'N/A',
                'email'      => $user->email,
                'phone'      => $user->phone ?? 'N/A',
                'role'       => $user->role, // مهم للموبايل عشان يعرف يظهر أيه ويخفي أيه
            ]
        ]);
    }

    // دالة تسجيل الخروج (إضافة إضافية مفيدة هنا)
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully'
        ]);
    }
}
