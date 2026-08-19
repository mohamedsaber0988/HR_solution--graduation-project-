<?php

namespace App\Http\Controllers;

use App\Models\JobVacancy;
use Illuminate\Http\Request;
use App\Models\Applications;

class JobVacancyController extends Controller
{
    // =========================
    // INDEX (عرض كل الوظايف)
    // =========================
    public function index()
    {
        $vacancies = JobVacancy::orderBy('vacancy_id', 'desc')->get();

        return response()->json([
            'data' => $vacancies
        ]);
    }

    // =========================
    // STORE (إضافة وظيفة)
    // =========================
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string'
        ]);

        $vacancy = JobVacancy::create([
            'title' => $request->title,
            'description' => $request->description,
            'created_by' => $request->user()->user_id
        ]);

        return response()->json([
            'message' => 'Vacancy created successfully',
            'data' => $vacancy
        ], 201);
    }

    // =========================
    // SHOW (وظيفة واحدة)
    // =========================
    public function show($id)
    {
        $vacancy = JobVacancy::find($id);

        if (!$vacancy) {
            return response()->json([
                'message' => 'Vacancy not found'
            ], 404);
        }

        return response()->json([
            'data' => $vacancy
        ]);
    }

    // =========================
    // DELETE (حذف وظيفة)
    // =========================
    public function destroy(Request $request, $id)
    {
        $vacancy = JobVacancy::find($id);

        if (!$vacancy) {
            return response()->json([
                'message' => 'Vacancy not found'
            ], 404);
        }

        // optional: تأكد إن اللي عملها هو اللي يمسحها
        if ($vacancy->created_by != $request->user()->user_id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $vacancy->delete();

        return response()->json([
            'message' => 'Vacancy deleted successfully'
        ]);
    }
    public function getVacancyApplications($vacancy_id)
{
    // بنجيب البيانات من غير علاقة الـ applicant
    $applications = Applications::where('vacancy_id', $vacancy_id)->get();

    $data = $applications->map(function ($app) {
        return [
            'application_id' => $app->application_id,
            'cv_url'         => asset('storage/' . $app->cv_file),
            'applied_at'     => $app->created_at->format('Y-m-d H:i'),
        ];
    });

    return response()->json($data);
}
}