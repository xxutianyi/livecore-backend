<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('app:clear-online')->everyMinute();
Schedule::command('app:clear-expired-event')->everyFifteenMinutes();

Schedule::command('app:collect-room-stats')->everyTenSeconds();
Schedule::command('app:collect-room-stats')->everyTenSeconds();
