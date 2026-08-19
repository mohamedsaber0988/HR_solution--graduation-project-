<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Applications;
use App\Models\JobVacancy;

class ApplicationsController extends Controller
{

public function openJobs()
{
    $jobs = JobVacancy::latest()->get();

    return response()->json($jobs);
}

    public function apply(Request $request)
{
    $request->validate([
        'vacancy_id' => 'required|exists:job_vacancies,vacancy_id',
        'cv' => 'required|mimes:pdf|max:2048', // ملف PDF لا يزيد عن 2 ميجا
    ]);

    // رفع الملف وتخزينه في مجلد cvs جوه الـ public storage
    $path = $request->file('cv')->store('cvs', 'public');

    // حفظ البيانات في الجدول
    $application = Applications::create([
        //'applicant_id' => $request->user()->user_id, // الـ ID بتاع اليوزر اللي عامل login
        'vacancy_id'   => $request->vacancy_id,
        'cv_file'      => $path,
    ]);

    return response()->json(['message' => 'Applied successfully', 'data' => $application]);
}




    public function show($id)
    {
        $job = JobVacancy::find($id);

        if (!$job) {
            return response()->json([
                'message' => 'Job not found'
            ], 404);
        }

        return response()->json([
            'vacancy_id' => $job->vacancy_id,
            'title'      => $job->title,
            'description'=> $job->description,
            'location'   => $job->location ?? 'Not specified',
            'type'       => $job->type ?? 'Full Time',
            'created_at' => $job->created_at
        ]);
    }

}
