<?php require_once('api.php'); ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
    <title>Nueva Pelicula</title>
    <!-- Bootstrap -->
    <link rel="stylesheet" type="text/css" href="static/css/bootstrap.min.css">
    <link rel="stylesheet" href="static/css/styles.css">
    <script type="text/javascript" src="static/js/jquery-1.12.0.min.js"></script>
    <script type="text/javascript" src="static/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="static/js/bootstrap-rating.min.js"></script>
    <script type="text/javascript" src="static/js/jquery.bsAlerts.min.js"></script>
    <script src="static/js/buscar_peliculas.js" charset="utf-8"></script>
    <!-- <script src="static/js/puntuar_peliculas.js" charset="utf-8"></script> -->
</head>
<body>
    <section  class="container-fluid">
        <nav class="navbar navbar-default navbar-fixed-top">
            <div class="container-fluid">
                <!-- Brand and toggle get grouped for better mobile display -->
                <div class="navbar-header">
                    <a class="navbar-brand" href="#">Comparar Puntuaciones</a>
                    <ul class="nav navbar-nav">
                        <li>
                            <a href="/">Listado general</a>
                        </li>
                        <li><a href="/save_movie.html"> Nueva pelicula </a></li>
                    </ul>
                </div>
            </div><!-- /.container-fluid -->
        </nav>
    </section>
    <section class="container-fluid">
        <div data-alerts="alerts"></div>
    </section>
    <section class="container-fluid list-wrapper">
        <?php
                if(isset($_GET['id'])){

                    echo '<p>'.$_GET['id'].'</p>';
                }
        ?>
    </section>
</body>
</html>
