<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCartas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cartas', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre');
            $table->text('cuerpo');
            $table->integer('plantilla_id')->unsigned();
            $table->foreign('plantilla_id')
                      ->references('id')->on('plantillas')
                      ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('cartas');
    }
}
