<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::rename('music_news_events', 'music_news_articles');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::rename('music_news_articles', 'music_news_events');
    }
};
