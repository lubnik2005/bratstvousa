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
        Schema::create('youth_news_articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('region');
            $table->string('slug')->nullable();
            $table->unsignedInteger('author_id')->nullable();
            $table->string('description')->nullable();
            $table->text('content')->nullable();
            $table->text('thumbnail')->nullable();
            $table->string('date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('youth_news_articles');
    }
};
