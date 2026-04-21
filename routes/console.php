<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('app:clear-online')->everyMinute()->runInBackground();
Schedule::command('app:collect-room-stats')->everyTenSeconds()->runInBackground();
Schedule::command('app:collect-room-stats')->everyTenSeconds()->runInBackground();
Schedule::command('app:clear-expired-event')->everyThirtyMinutes()->runInBackground();
