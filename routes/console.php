<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('app:clear-online')->everyMinute();
Schedule::command('app:clear-expired-event')->everyFifteenMinutes();
