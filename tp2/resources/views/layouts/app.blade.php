<!-- resources/views/layouts/app.blade.php -->

<!DOCTYPE html>
<html lang="es">
    <head>
        <title>Aplicaciones Web - TP 2</title>

        <!-- CSS And JavaScript -->

        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
    </head>

    <body>
        <div class="container">
            <nav class="navbar navbar-inverse">
                <div class="navbar-header">
                    <a class="navbar-brand" href="{{ URL::to('plantilla') }}">Plantillas</a>
                </div>
                <ul class="nav navbar-nav">
                    <li><a href="{{ URL::to('plantilla') }}">Ver todas las Plantillas</a></li>
                    <li><a href="{{ URL::to('plantilla/create') }}">Crear nueva Plantilla</a>
                </ul>
            </nav>
        </div>

        @yield('content')
    </body>
</html>
