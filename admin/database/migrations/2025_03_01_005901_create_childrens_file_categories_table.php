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
        Schema::create('childrens_file_categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->nullable();
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->integer('level')->nullable();
            $table->timestamps();
        });
        Schema::create('childrens_file_childrens_file_category', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('childrens_file_id')->nullable();
            $table->unsignedInteger('childrens_file_category_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('childrens_file_categories');
        Schema::dropIfExists('childrens_file_childrens_file_category');
    }
};
