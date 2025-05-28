<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('music_news_articles', function (Blueprint $table) {
            $table->string('title');
            $table->string('slug')->nullable();
            $table->unsignedInteger('author_id')->nullable();
            $table->string('description')->nullable();
            $table->string('region')->nullable();
            $table->text('content')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('featured_image')->nullable();
            $table->date('date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('music_news_articles', function (Blueprint $table) {
            $table->dropColumn([
                'title',
                'slug',
                'author_id',
                'description',
                'region',
                'content',
                'thumbnail',
                'featured_image',
                'start_at',
                'end_at',
            ]);
        });
    }
};
