<?php

use Bratstvo\CampCheckIn\Http\Controllers\CheckInController;
use Illuminate\Support\Facades\Route;

Route::get('/lookup', [CheckInController::class, 'lookup']);
Route::post('/registrations/{registration}/perform', [CheckInController::class, 'perform']);
