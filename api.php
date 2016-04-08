<?php
	require_once("Rest.inc.php");

	class API extends REST {

		public $data = "";

        /**
         * @var SQLite3 $db
         */
        private $db = NULL;

		public function __construct(){
			parent::__construct();
            $this->dbConnect();	 //Conecto a la base de datos
		}

		/*
		 *  Database connection
		*/
		private function dbConnect(){

            $db = new SQLite3('movies.db');
            //Creo la base de datos
            $db->exec('CREATE TABLE IF NOT EXISTS movies (id VARCHAR(9) NOT NULL, title VARCHAR(50) NOT NULL, genre VARCHAR(25) NOT NULL, year SMALLINT, rating DECIMAL(3,1), PRIMARY KEY(id))');

            //Inserto algunas peliculas
            /*
            $db->exec('INSERT INTO movies (id, title, genre, year, rating) VALUES ("tt0075148","Rocky","drama",1976,8.1)');
            $db->exec('INSERT INTO movies (id, title, genre, year, rating) VALUES ("tt0079817","Rocky II","drama",1979,7.2)');
            $db->exec('INSERT INTO movies (id, title, genre, year, rating) VALUES ("tt0084602","Rocky III","drama",1982,6.7)');
            $db->exec('INSERT INTO movies (id, title, genre, year, rating) VALUES ("tt0089927","Rocky IV","drama",1985,6.7)');
            $db->exec('INSERT INTO movies (id, title, genre, year, rating) VALUES ("tt0100507","Rocky V","drama",1990,5.1)');
            */
			$this->db = $db;
		}

		/*
		 * Metodo Publico de acceso a la API
		 * Se llama automaticamente basandose en el query string
		 *
		 */
		public function processApi(){
			return $func = $this->movies();
			$func = strtolower(trim(str_replace("/","", $_SERVER['PATH_INFO'])));
			if((int)method_exists($this,$func) > 0)
				$this->$func();
			else
				$this->response('',404); // Método noexiste

		}


		/*
		 *	Simple login API
		 *  Login must be POST method
		 *  email : <USER EMAIL>
		 *  pwd : <USER PASSWORD>
		 */

		private function saveMovie()
        {
            // Cross validation
            if ($this->get_request_method() != "POST") {
                $this->response('', 406);
            }

            $id = isset($this->_request['id']) ? $this->_request['id'] : Null;
            $title = isset($this->_request['title']) ? $this->_request['title'] : Null;
            $genre = isset($this->_request['genre']) ? $this->_request['genre'] : Null;
            $year = isset($this->_request['year']) ? $this->_request['year'] : Null;
            $rating = isset($this->_request['rating']) ? $this->_request['rating'] : Null;

            //Valido campos
            try {
                if (empty($id)) {
                    throw new \Exception("Invalid id");
                }
                if (empty($title)) {
                    throw new \Exception("Invalid title");
                }
                if (empty($genre)) {
                    throw new \Exception("Invalid genre");
                }
                if (empty($year)) {
                    throw new \Exception("Invalid year");
                }
                if (empty($rating)) {
                    throw new \Exception("Invalid rating");
                }

            } catch (\Exception $ex) {
                $error = array('status' => "Failed", "msg" => $ex->getMessage());
                $this->response($this->json($error), 400);
            }
            // Input validations

            //Me fijo si ya existe en la Base de Datos
            $result = $this->db->query("SELECT id FROM movies where id='$id'");
            if ($movie = $result->fetchArray(SQLITE3_ASSOC)) {
                //Existe. La actualizo
                $this->db->exec("UPDATE movies SET title = '$title', genre='$genre', year=$year, rating=$rating WHERE id='$id'");
            } else {
                //No existe. La guardo
                $this->db->exec("INSERT INTO movies (id, title, genre, year, rating) VALUES ('$id', '$title', '$genre', $year, $rating)");
            }
                // If success everythig is good send header as "OK" and user details
            $result = array('status' => 'Ok');
            $this->response($this->json($result), 200);
		}

		private function movies(){
			if($this->get_request_method() == "GET"){
                $this->listMovies();
			} elseif($this->get_request_method() == "POST"){
                $this->saveMovie();
            } else {
                $this->response('',406);
            }

		}

        private function listMovies() {
            // Cross validation
            if($this->get_request_method() != "GET"){
                $this->response('',406);
            }
            $term = isset($this->_request['term']) ? $this->_request['term'] : Null;

            //$this->db->exec('INSERT INTO movies (id, title, genre, year, rating) VALUES ("tt0075148","Rocky","drama",1976,8.1)');
            if (isset($term)) {
                $result = $this->db->query("SELECT id, title, genre, year, rating FROM movies where id='$term' OR title LIKE '%$term%'" );
            } else {
                $result = $this->db->query('SELECT id, title, genre, year, rating FROM movies');
            }
            $movies = array();

            while($movie = $result->fetchArray(SQLITE3_ASSOC)){
                $movies[] = $movie;
            }

            if(count($movies)) {
                // Devuelvo 200 Ok y listado de peliculas en formato JSON
                $this->response($this->json($movies), 200);
            } else {
                $this->response('',204);	// Devuelvo estado "204 - No Content"
            }

        }

		/*
		 *	Encode array into JSON
		*/
		private function json($data){
			if(is_array($data)){
				return json_encode($data);
			}
		}
	}

	// Initiiate Library

    $api = new API;
	$peliculas = $api->processApi();
?>
