<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Small key/value table on the plumbing (local SQLite) connection used by the
 * zeffy:sync command to persist its incremental watermark
 * (max Zeffy payment "created" unix seconds seen).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('plumbing')->create('zeffy_kv', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->text('value')->nullable();
            $table->timestamp('updated_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::connection('plumbing')->dropIfExists('zeffy_kv');
    }
};
