    <div class="modal fade" id="modalMenuResponsive" tabindex="-1" role="dialog" aria-labelledby="myModalMenuResponsive">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title custom-header custom-header-sm text-center" id="myModalMenuResponsive">Opciones</h4>
                </div>
                <div class="modal-body" style="overflow:hidden">
                    <div class="col-xs-12">
                        <div class="list-group" id="actions-menu">
                            @include('carta.actions.actions-modal')
                        </div>
                    </div>
                </div>
            </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
