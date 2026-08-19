<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Department;

class DepartmentController extends Controller
{
    // =========================
    // ADD DEPARTMENT
    // =========================
    public function store(Request $request)
    {
        $request->validate([
            'dep_name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $department = Department::create([
            'dep_name' => $request->dep_name,
            'description' => $request->description
        ]);

        return response()->json([
            'message' => 'Department created successfully',
            'data' => $department
        ], 201);
    }

    // =========================
    // GET ALL DEPARTMENTS
    // =========================
    public function index()
    {
        $departments = Department::select('dep_id', 'dep_name', 'description')->get();

        return response()->json([
        'data' => $departments
        ]);
    }

public function destroy($id)
{
    $department = Department::find($id);

    if (!$department) {
        return response()->json([
            'message' => 'Department not found'
        ], 404);
    }

    $department->delete();

    return response()->json([
        'message' => 'Department deleted successfully'
    ]);
}
}