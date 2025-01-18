<?php

use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Убираем префикс api, так как он уже добавляется в RouteServiceProvider
Route::apiResource('projects', ProjectController::class);
Route::apiResource('tasks', TaskController::class); 