<?php

use Illuminate\Support\Facades\Route;

// Все маршруты будут обрабатываться через Vue Router
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
