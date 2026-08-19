<?php

namespace App\Services;

use Smalot\PdfParser\Parser;
use Gemini;

class AICVService
{
    public function analyzeCV($cvPath, $jobDescription)
    {
        try {
            // 1. تحديد المسار
            $fullPath = storage_path('app/public/' . $cvPath);
            if (!file_exists($fullPath)) return "Error: File not found";

            // 2. استخراج النص
            $parser = new Parser();
            $pdf = $parser->parseFile($fullPath);
            $cvText = $pdf->getText();

            if (empty(trim($cvText))) return "Error: PDF text is empty";

            // 3. الاتصال بـ Gemini
            $apiKey = env('GEMINI_API_KEY');
            $client = Gemini::client($apiKey);
            
            $prompt = "Compare this Resume with the Job Description. 
            JD: $jobDescription
            Resume: $cvText
            Return ONLY a numeric score from 0 to 100.";

            // التعديل السحري: اخترنا موديل من اللستة اللي ظهرتلك
            $result = $client->generativeModel('gemini-3.1-flash-lite-preview')->generateContent($prompt);
            $responseText = $result->text();

            // تنظيف النتيجة
            $score = preg_replace('/[^0-9]/', '', $responseText);
            
            return is_numeric($score) ? (int)$score : 0;

        } catch (\Exception $e) {
            return "Exception: " . $e->getMessage();
        }
    }
}