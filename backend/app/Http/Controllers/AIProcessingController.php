<?php

namespace App\Http\Controllers;

use App\Models\Applications;
use App\Models\JobVacancy;
use App\Services\AICVService;
use Illuminate\Http\Request;

class AIProcessingController extends Controller
{
    public function getAIFilteredApplications($vacancy_id, AICVService $aiService)
    {
        $vacancy = JobVacancy::findOrFail($vacancy_id);
        $applications = Applications::where('vacancy_id', $vacancy_id)->get();

        $finalCandidates = [];
        $debugInfo = [];

        foreach ($applications as $app) {
            $result = $aiService->analyzeCV($app->cv_file, $vacancy->description);

            if (is_numeric($result)) {
                $score = (int) $result;

                
                if ($score >= 50) {
                    $finalCandidates[] = [
                        'application_id' => $app->application_id,
                        'ai_score'       => $score,
                        'cv_url'         => asset('storage/' . $app->cv_file),
                        'applied_at'     => $app->created_at->format('Y-m-d'),
                    ];
                }
            } else {
                $debugInfo[] = [
                    'id' => $app->application_id,
                    'error' => $result
                ];
            }
        }

        
        usort($finalCandidates, fn($a, $b) => $b['ai_score'] <=> $a['ai_score']);

        return response()->json([
            'vacancy'     => $vacancy->title,
            'total_found' => count($finalCandidates),
            'candidates'  => $finalCandidates,
            'errors'      => $debugInfo
        ]);
    }
}