<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json([
    'status' => 'ok',
    'service' => 'hris-api',
    'timestamp' => now()->toIso8601String(),
]));

Route::get('/health/live', fn () => response()->json([
    'status' => 'ok',
    'service' => 'hris-api',
    'timestamp' => now()->toIso8601String(),
]));

Route::get('/health/ready', function () {
    try {
        DB::select('SELECT 1');

        Cache::store('redis')->put(
            'health:ready',
            'ok',
            now()->addSeconds(30),
        );

        return response()->json([
            'status' => 'ok',
            'service' => 'hris-api',
            'dependencies' => [
                'database' => 'ok',
                'cache' => 'ok',
            ],
            'timestamp' => now()->toIso8601String(),
        ]);
    } catch (\Throwable $exception) {
        Log::warning('Readiness check failed', [
            'exception' => $exception::class,
        ]);

        return response()->json([
            'status' => 'unavailable',
            'service' => 'hris-api',
            'timestamp' => now()->toIso8601String(),
        ], 503);
    }
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
