<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddingFields2cartaModel extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cartas', function (Blueprint $table) {
            $table->boolean('publica')->default(false);
            $table->json('placeholders')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cartas', function (Blueprint $table) {
            $table->dropColumn(['placeholders', 'publica']);
        });
    }
}
