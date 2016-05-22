<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddingAuthorFieldCartas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cartas', function (Blueprint $table) {
            $table->integer('autor_id')->unsigned()->nullable();
            $table->foreign('autor_id')
                      ->references('id')->on('users')
                      ->onDelete('cascade');
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
            $table->dropColumn(['autor_id']);
        });
    }
}
