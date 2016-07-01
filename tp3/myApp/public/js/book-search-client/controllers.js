angular.module('bookSearchClient')
.controller('IndexController', IndexController)
.controller('SearchBookController', SearchBookController)
.controller('ShowBookController', ShowBookController)
.controller('SaveBookController', SaveBookController)
.controller('RateBookController', RateBookController);

function IndexController($scope, $http) {
    $http.get('/books/collection')
        .success(function(data, status, headers, config) {
            $scope.books = data.books;
        });
}

function SaveBookController($scope, $http, $location) {
    $scope.form = {};
    $scope.saveBook = function (id) {
        console.log('llame a guardar', id);
        $http.post('/books/save/'+id, $scope.form)
            .success(function(data) {
                $location.path('/');
            });
    };
}

function ShowBookController($scope, $http) {
    $scope.showBook = function(){
        var id = this.resultado.id; 
        $http.get('/books/show/' + id)
            .then(fill_book_data, function(error){
                console.log("error!", error.responseText);
            });

    }

    function fill_book_data(result){
        //console.log(JSON.stringify(result.data.book, null, 2));
        var book = result.data.book;
        var $title = $('#modal-info-libro .modal-title .titulo');
        var modal_body_selector = '#modal-info-libro .modal-body ';
        $title.empty().append("<em>"+book.title+"</em>");
        $(modal_body_selector+'.thumb').prop('src', book.imageLinks.medium);
        $(modal_body_selector+'.descripcion').empty().append(book.description);
        var values = [book.subtitle, book.authors, book.categories, book.pageCount, 
                    book.publishedDate, book.publisher, book.industryIdentifiers[1].identifier, 
                    book.language, book.infoLink, book.preview_link];
        var field_names = ['Subtitulo: ', 'Autor/es: ', 'Categorías: ', 'Páginas: ',
                        'Año de publicación: ', 'Editorial: ', 'ISBN: ','Lenguaje: ', 
                        'Más información: ', 'Preview: '];
        $(modal_body_selector+'.info tbody').empty();
        $.each(values, function(i){
            if (values[i]){    
                var link = '<a href="'+values[i]+'">Haz click aquí</a>';
                var valor = String(values[i]).includes('http') ? link : values[i];
                var markup_data = '<tr><td><strong>'+field_names[i]+'</strong></td><td>'+valor+'</td></tr>';
                $(modal_body_selector+'.info tbody').append(markup_data);
            }
        });
        var markup_compra = '';
        $('.compra').empty();
        if(book.saleInfo.retailPrice){
            var url = 'https://play.google.com/store/books/details?id='+book.id+
                '&amp;rdid=book-'+book.id+'&amp;rdot=1&amp;source=gbs_atb&amp;pcampaignid=books_booksearch_atb';
            markup_compra = '<div class="precio">'+
                            '<span class="precio-background precio-background-modal">'+
                                '<p class="precio-vta text-center">$'+book.saleInfo.retailPrice.amount+'</p>'+
                            '</span>'+
                            '<a class="btn btn-success" href="'+url+'">'+
                                '<span class="glyphicon glyphicon-shopping-cart"></span> Comprar'+
                            '</a></div><br><br>';
        }else{
            markup_compra = '<h4 class="precio text-center"> No disponible </h4><br><br>';
        }
        $('.compra').append(markup_compra);
        $('#modal-info-libro ').modal('show');
    }

}

function SearchBookController($scope, $http) {
    $scope.form = {};
    $scope.resultados = [];
    $scope.es_busqueda = false;
    $scope.form.search_term = $('#hidden_search_term').val();
    $scope.sendForm = function () {
        $scope.buscando = true;
        $http.post('/books/search', $scope.form)
            .then(function(result) {
                $scope.es_busqueda = true;
                $scope.buscando = false;
                $scope.resultados = result.data.resultados;
                $scope.resultados_db = result.data.resultados_db;
                $scope.resultados.forEach(function (result, i) {
                    var filtrado = $scope.resultados_db.filter(function (result_db) {
                        return result_db.book_id === result.id;
                    });
                    if (filtrado[0]){
                        result.rate_pos = filtrado[0].rate_pos;
                        result.rate_neg = filtrado[0].rate_neg;
                        result.rate_later = filtrado[0].rate_later; 
                    }else {
                        result.rate_pos = 0;
                        result.rate_neg = 0;
                        result.rate_later = 0;
                    }
                    console.log(result);
                });
                //Ordeno por votos positivos
                $scope.resultados.sort(function(a, b){
                    return (b.rate_pos - a.rate_pos);
                });
            }, function(){
                $scope.buscando = false;
                console.log('SearchBookController: hubo un error');
            });
    };
    if ($scope.form.search_term.length > 0 )
        $scope.sendForm();
}

function RateBookController($scope, $http) {
    $scope.rate = function (type, book_id) {
        var url; 
        if(type === 'positive'){
            $scope.pos += 1;
            url = '/books/vote/like/';
            console.log('rate_pos', book_id);            
        }else{
            if (type === 'negative'){
                console.log('rate_neg', book_id);
                $scope.neg += 1;
                url = '/books/vote/dislike/';
            }else{
                console.log('rate_later', book_id);
                $scope.later += 1;
                url = '/books/vote/later/';
            }
        }
        $http.post(url+ book_id)
        .then(function(result) {
            console.log('result ', result);
        }, function(){
            console.log('error');
        })
    }
}