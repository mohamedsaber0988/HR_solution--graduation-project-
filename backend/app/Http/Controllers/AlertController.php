<?php

namespace App\Http\Controllers;

use App\Models\alerts;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AlertController extends Controller
{
    // =========================
    // GET ALL ALERTS
    // =========================
    public function index(Request $request)
    {
        $user = $request->user();

        $alerts = alerts::where('user_id', $user->user_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($alerts);
    }

    // =========================
    // SSE STREAM (UNREAD COUNT)
    // =========================
    public function stream(Request $request)
    {
        $user = $request->user();

        $response = new StreamedResponse(function () use ($user) {

            $lastCount = null;
            $start = time();
            $timeout = 600; // 10 minutes

            while (true) {

                // ⛔ stop after timeout
                if (time() - $start > $timeout) {
                    break;
                }

                // =========================
                // COUNT UNREAD
                // =========================
                $currentCount = alerts::where('user_id', $user->user_id)
                    ->where('is_read', false)
                    ->count();

                // =========================
                // SEND ONLY IF CHANGED
                // =========================
                if ($currentCount !== $lastCount) {

                    echo "event: unread_count_update\n";
                    echo "data: " . json_encode([
                        'unread_count' => $currentCount
                    ]) . "\n\n";

                    $lastCount = $currentCount;
                }

                @ob_flush();
                flush();

                sleep(5);
            }
        });

        // =========================
        // HEADERS FOR SSE
        // =========================
        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set('Connection', 'keep-alive');
        $response->headers->set('X-Accel-Buffering', 'no');

        return $response;
    }

    // =========================
    // MARK AS READ
    // =========================
    public function markAsRead($id, Request $request)
    {
        $user = $request->user();

        $alert = alerts::where('alert_id', $id)
            ->where('user_id', $user->user_id)
            ->first();

        if (!$alert) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }

        $alert->update([
            'is_read' => true,
            'read_at' => now()
        ]);

        return response()->json([
            'message' => 'Marked as read'
        ]);
    }
}