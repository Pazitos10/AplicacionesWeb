<div id="content-listado">
    <div class="row list-wrapper">
        @foreach ($cartas as $carta)
            <div class="col-md-3 item">
                @if (isset($carta->thumbnail))
                    <div class="crop">
                        @if(Request::path() == 'carta/publicas')
                            <img class="thumb-cartas" src="{{ $carta->thumbnail_publico }}" alt="">
                        @else
                            <img class="thumb-cartas" src="{{ $carta->thumbnail }}" alt="">
                        @endif
                    </div>
                @else
                    <img class="img-responsive" src="http://placehold.it/700x400" alt="" />
                @endif
                <div class="nombre-carta">
                    <div class="item-footer">
                        {{ $carta->nombre }}
                        <div class="item-footer-options">
                            @if(! $carta->publica)
                                <span title="carta privada" class="glyphicon glyphicon-lock carta-privada"></span>
                            @endif
                            <button type="button" name="button"  class="btn btn-xs btn-menu-responsive" data-id="{{$carta->id}}">
                                <span class="glyphicon glyphicon-menu-hamburger"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
    <!-- /.row -->
</div>
