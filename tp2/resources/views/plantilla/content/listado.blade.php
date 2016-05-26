<!-- plantilla/content/listado.blade.php  -->
<div id="content-listado">
    <div class="row list-wrapper">
        @foreach ($plantillas as $plantilla)
            <div class="col-md-3 item">
                <a href="{{ URL::to('plantilla/' . $plantilla->id . '/edit') }}">
                    @if (isset($plantilla->thumbnail))
                        <img class="img-responsive thumb" src="{{ $plantilla->thumbnail }}" alt="">
                    @else
                        <img class="img-responsive" src="http://placehold.it/700x400" alt="" />
                    @endif
                </a>

                <div class="nombre-plantilla">
                    <div class="item-footer">
                        {{ $plantilla->nombre }}
                        <div class="item-footer-options">
                            <button type="button" name="button"  class="btn btn-xs btn-menu-responsive" data-id="{{$plantilla->id}}">
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
