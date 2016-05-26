<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddingPublicFieldsCartas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cartas', function ($table) {
            $table->text('thumbnail_publico')->nullable();
            $table->text('cuerpo_publico')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cartas', function ($table) {
            $table->dropColumn(['thumbnail_publico', 'cuerpo_publico']);
        });
    }
}
