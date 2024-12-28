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
        Schema::create('churches', function (Blueprint $table) {
            $table->id();
            $table->string('state');
            $table->string('city');
            $table->string('name_line_1');
            $table->string('name_line_2');
            $table->string('region');
            $table->string('address_line_1');
            $table->string('address_line_2');
            $table->string('contact_first_name');
            $table->string('contact_last_name');
            $table->string('phone');
            $table->string('youtube');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('churches');
    }
};
