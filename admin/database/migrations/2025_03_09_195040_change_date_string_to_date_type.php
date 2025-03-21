<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Convert `date` column from string to date using PostgreSQL's USING clause
        DB::statement('ALTER TABLE childrens_news_articles ALTER COLUMN "date" TYPE DATE USING "date"::DATE;');
        DB::statement('ALTER TABLE youth_news_articles ALTER COLUMN "date" TYPE DATE USING "date"::DATE;');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Convert `date` column back to string
        DB::statement('ALTER TABLE childrens_news_articles ALTER COLUMN "date" TYPE VARCHAR(255) USING "date"::TEXT;');
        DB::statement('ALTER TABLE youth_news_articles ALTER COLUMN "date" TYPE VARCHAR(255) USING "date"::TEXT;');
    }
};
