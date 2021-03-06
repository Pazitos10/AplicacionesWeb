<!-- resources/views/layouts/app.blade.php -->

<!DOCTYPE html>
<html lang="es">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <title>Aplicaciones Web - TP 2</title>
        <link rel="stylesheet" href="{{ URL::asset('static/css/fonts.css') }}" media="screen" charset="utf-8">
        <link rel="stylesheet" href="{{ URL::asset('static/css/bootstrap.min.css') }}">
        <link rel="stylesheet" href="{{ URL::asset('static/css/styles.css') }}">
        <link rel="stylesheet" href="{{ URL::asset('static/css/switch.css') }}">
        <script src="{{ URL::asset('static/js/jquery-1.12.3.min.js') }}"></script>
        <script src="{{ URL::asset('static/js/bootstrap.min.js')}}"></script>
        <script src="{{ URL::asset('static/js/html2canvas.js')}}"></script>
        <script type="text/javascript" src="{{ URL::asset('static/js/plantillas.js')}}"></script>
        <script type="text/javascript" src="{{ URL::asset('static/js/editor.js')}}"></script>
    </head>

    <body>
        <section class="container-fluid">
            <nav class="navbar navbar-inverse navbar-fixed-top">
                <div class="container-fluid">
                    <!-- Brand and toggle get grouped for better mobile display -->
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <a class="navbar-brand nav-style nav-logo" href="{{ URL::to('/') }}">Mis Plantillas</a>
                    </div>

                    <!-- Collect the nav links, forms, and other content for toggling -->
                    <div class="collapse navbar-collapse" id="navbar-collapse">
                        @if (!Auth::guest())
                        <ul class="nav navbar-nav">
                            <li class="dropdown">
                              <a href="#" class="dropdown-toggle nav-style" data-toggle="dropdown" role="button" aria-expanded="false">Plantillas <span class="caret"></span></a>
                              <ul class="dropdown-menu" role="menu">
                                <li><a href="{{ URL::to('plantilla') }}">Listado</a></li>
                                <li><a href="{{ URL::to('plantilla/create') }}">Crear</a></li>
                                  <!-- <li><a href="#">Modificar</a></li> -->
                                  <!-- <li class="divider"></li> -->
                                  <!-- <li><a href="#">Eliminar</a></li>-->
                                </ul>
                              </li>
                              <li class="dropdown">
                                <a href="#" class="dropdown-toggle nav-style" data-toggle="dropdown" role="button" aria-expanded="false">Cartas <span class="caret"></span></a>
                                <ul class="dropdown-menu" role="menu">
                                  <li><a href="{{ URL::to('carta') }}">Mis cartas</a></li>
                                  <li><a href="{{ URL::to('carta/create') }}">Crear</a></li>
                                  <li class="divider"></li>
                                  <li><a href="{{ URL::to('carta/publicas') }}">Cartas públicas</a></li>
                                  <!-- <li><a href="#">Modificar</a></li>
                                  <li class="divider"></li>
                                  <li><a href="#">Eliminar</a></li> -->
                                </ul>
                              </li>
                          </ul>
                        @endif
                          <!-- Right Side Of Navbar -->
                        <ul class="nav navbar-nav navbar-right">
                            <!-- Authentication Links -->
                            @if (Auth::guest())
                                <li><a href="{{ url('login') }}">Iniciar sesión</a></li>
                                <li><a href="{{ url('register') }}">Registrarme</a></li>
                            @else
                                <li class="dropdown">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                                        {{ Auth::user()->name }} <span class="caret"></span>
                                    </a>

                                    <ul class="dropdown-menu" role="menu">
                                        <li><a href="{{ url('logout') }}"><i class="fa fa-btn fa-sign-out"></i>Cerrar sesión</a></li>
                                    </ul>
                                </li>
                            @endif
                        </ul>
                    </div><!-- /.navbar-collapse -->
                </div><!-- /.container-fluid -->
            </nav>
        </section>
        <section id="content">
            <div class="container">
                <div class="row">
                    @yield('content')
                </div>
            </div>
        </section>
    </body>
</html>
