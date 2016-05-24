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
                <!-- <div class="btn-group categorias">
                    <a href="#" title="Queja" class="btn btn-warning btn-xs disabled">Queja</a>
                    <a href="#" title="Pública" class="btn btn-info btn-xs disabled">Pública</a>
                </div> -->
                <div class="btn-group btn-item-options">
                    <a href="#" title="Ver" class=""><span class="glyphicon glyphicon-eye-open btn-on-item"></span></a>
                    <a href="#" title="Eliminar" class=""><span class="glyphicon glyphicon-remove btn-on-item icon-remove"></span></a>
                </div>
                <h4 class="nombre-plantilla">
                    {{ $plantilla->nombre }}
                </h4>
            </div>
        @endforeach
    </div>
    <!-- /.row -->
</div>
