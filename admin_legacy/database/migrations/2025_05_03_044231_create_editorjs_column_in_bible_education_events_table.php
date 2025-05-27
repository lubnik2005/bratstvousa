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
        Schema::table('bible_education_events', function (Blueprint $table) {
            $table->jsonb('use_editorjs')->nullable();
            $table->jsonb('editorjs')->nullable();
        });
        Schema::table('childrens_events', function (Blueprint $table) {
            $table->jsonb('use_editorjs')->nullable();
            $table->jsonb('editorjs')->nullable();
        });
        Schema::table('family_events', function (Blueprint $table) {
            $table->jsonb('use_editorjs')->nullable();
            $table->jsonb('editorjs')->nullable();
        });
        Schema::table('general_events', function (Blueprint $table) {
            $table->jsonb('use_editorjs')->nullable();
            $table->jsonb('editorjs')->nullable();
        });
        Schema::table('gospel_events', function (Blueprint $table) {
            $table->jsonb('use_editorjs')->nullable();
            $table->jsonb('editorjs')->nullable();
        });

        Schema::table('music_events', function (Blueprint $table) {
            $table->jsonb('use_editorjs')->nullable();
            $table->jsonb('editorjs')->nullable();
        });
        Schema::table('youth_events', function (Blueprint $table) {
            $table->jsonb('use_editorjs')->nullable();
            $table->jsonb('editorjs')->nullable();
        });


        Schema::table('bible_education_news_articles', function (Blueprint $table) {
            $table->jsonb('use_editorjs')->nullable();
            $table->jsonb('editorjs')->nullable();
        });
        Schema::table('childrens_news_articles', function (Blueprint $table) {
            $table->jsonb('use_editorjs')->nullable();
            $table->jsonb('editorjs')->nullable();
        });
        Schema::table('family_news_articles', function (Blueprint $table) {
            $table->jsonb('use_editorjs')->nullable();
            $table->jsonb('editorjs')->nullable();
        });
        Schema::table('news_articles', function (Blueprint $table) {
            $table->jsonb('use_editorjs')->nullable();
            $table->jsonb('editorjs')->nullable();
        });
        Schema::table('music_news_articles', function (Blueprint $table) {
            $table->jsonb('use_editorjs')->nullable();
            $table->jsonb('editorjs')->nullable();
        });
        Schema::table('youth_news_articles', function (Blueprint $table) {
            $table->jsonb('use_editorjs')->nullable();
            $table->jsonb('editorjs')->nullable();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::table('bible_education_events', function (Blueprint $table) {
            $table->dropColumn('use_editorjs');
            $table->dropColumn('editorjs');
        });
        Schema::table('childrens_events', function (Blueprint $table) {
            $table->dropColumn('use_editorjs');
            $table->dropColumn('editorjs');
        });
        Schema::table('family_events', function (Blueprint $table) {
            $table->dropColumn('use_editorjs');
            $table->dropColumn('editorjs');
        });
        Schema::table('general_events', function (Blueprint $table) {
            $table->dropColumn('use_editorjs');
            $table->dropColumn('editorjs');
        });
        Schema::table('gospel_events', function (Blueprint $table) {
            $table->dropColumn('use_editorjs');
            $table->dropColumn('editorjs');
        });

        Schema::table('music_events', function (Blueprint $table) {
            $table->dropColumn('use_editorjs');
            $table->dropColumn('editorjs');
        });
        Schema::table('youth_events', function (Blueprint $table) {
            $table->dropColumn('use_editorjs');
            $table->dropColumn('editorjs');
        });



        Schema::table('bible_education_news_articles', function (Blueprint $table) {
            $table->dropColumn('use_editorjs');
            $table->dropColumn('editorjs');
        });
        Schema::table('childrens_news_articles', function (Blueprint $table) {
            $table->dropColumn('use_editorjs');
            $table->dropColumn('editorjs');
        });
        Schema::table('family_news_articles', function (Blueprint $table) {
            $table->dropColumn('use_editorjs');
            $table->dropColumn('editorjs');
        });
        Schema::table('general_news_articles', function (Blueprint $table) {
            $table->dropColumn('use_editorjs');
            $table->dropColumn('editorjs');
        });
        Schema::table('gospel_news_articles', function (Blueprint $table) {
            $table->dropColumn('use_editorjs');
            $table->dropColumn('editorjs');
        });

        Schema::table('music_news_articles', function (Blueprint $table) {
            $table->dropColumn('use_editorjs');
            $table->dropColumn('editorjs');
        });
        Schema::table('youth_news_articles', function (Blueprint $table) {
            $table->dropColumn('use_editorjs');
            $table->dropColumn('editorjs');
        });


    }
};

