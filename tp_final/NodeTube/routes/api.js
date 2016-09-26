var express = require('express');
var router = express.Router();

/*Todas las rutas retornan los resultados en formato json*/

router.get('/videos', function (req, res) {
  //TODO: Retornar la coleccion de videos publicos
  res.send('videos!');
});

router.get('/accounts', function (req, res) {
  //TODO: Retornar la coleccion de usuarios registrados (solo usernames por ahora)
  res.send('videos!');
});

module.exports = router;