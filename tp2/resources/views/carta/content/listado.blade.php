<div id="content-listado">
    <div class="row list-wrapper">
        @foreach ($cartas as $carta)
            <div class="col-md-3 item">
                <a href="{{ URL::to('carta/' . $carta->id ) }}">
                    @if (isset($carta->thumbnail))
                        <div class="crop">
                            <img class="thumb-cartas" src="{{ $carta->thumbnail }}" alt="">
                        </div>
                    @else
                        <img class="img-responsive" src="http://placehold.it/700x400" alt="" />
                    @endif
                </a>
                <div class="nombre-carta">
                    <div class="item-footer">
                        {{ $carta->nombre }}
                        <div class="item-footer-options">
                            @if(! $carta->publica)
                                <span title="carta privada" class="glyphicon glyphicon-lock carta-privada"></span>
                            @endif
                            <button type="button" name="button"  class="btn btn-xs btn-menu-responsive">
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
@include('carta.modals.modal-mail', ['carta' => $carta])
@include('carta.modals.modal-menu-responsive', ['carta' => $carta])
