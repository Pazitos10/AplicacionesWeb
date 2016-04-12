<?php
//Conecto a la base
$db = new SQLite3('../movies.db');

$id = isset($_GET['id']) ? $_GET['id'] : Null;

$rating = json_decode("{}");
if (!empty($id)) {
    $result = $db->query("SELECT rating FROM movies WHERE id = '$id'");
    if ($movie = $result->fetchArray(SQLITE3_ASSOC)){
        $rating = array("rating"=>$movie['rating'], 'min'=>0, 'max'=>5, 'type'=>'float');
    }
}
echo json_encode($rating);

