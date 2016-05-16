@extends('layouts.app')
@section('content')

<div class="col-lg-10 col-lg-offset-1">
    <div class="list-wrapper">
        <div class="col-lg-12 col-xs-12">
            @yield('dynamic-content')
        </div>
    </div>

    <hr>
    <footer>
        <div class="row">
            <div class="col-lg-12 text-center">
                <p>Copyright &copy; 2016 - Iglesias Matias - Pazos Bruno</p>
            </div>
        </div>
        <!-- /.row -->
    </footer>
</div>
<script type="text/javascript" src="{{ URL::asset('static/js/main.js') }}"></script>

@endsection
