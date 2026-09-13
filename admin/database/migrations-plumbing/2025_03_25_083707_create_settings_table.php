<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table): void {
            $table->id();

            $table->string('group');
            $table->string('name');
            $table->boolean('locked')->default(false);
            $table->json('payload');

            $table->timestamps();

            $table->unique(['group', 'name']);
        });

        // Seed the setting rows that the App\Settings\* classes require.
        // Spatie\LaravelSettings throws MissingSettings if a declared
        // property has no backing row, which 500s every authenticated
        // Nova page. Values are empty defaults; edit them in the Nova UI.
        $now = now();
        $defaults = [
            // App\Settings\PageContentSettings (group: general)
            ['group' => 'general', 'name' => 'short_introduction_content', 'payload' => json_encode('')],
            // App\Settings\DonationSettings (group: general)
            ['group' => 'general', 'name' => 'donation_url', 'payload' => json_encode('')],
            ['group' => 'general', 'name' => 'donation_tokenuid', 'payload' => json_encode('')],
        ];

        foreach ($defaults as $row) {
            $exists = DB::table('settings')
                ->where('group', $row['group'])
                ->where('name', $row['name'])
                ->exists();

            if (! $exists) {
                DB::table('settings')->insert([
                    'group' => $row['group'],
                    'name' => $row['name'],
                    'locked' => false,
                    'payload' => $row['payload'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
