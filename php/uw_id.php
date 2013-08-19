<?php
$user =$_GET["user"];
$week =1 + $_GET["week"];

$dbh = pg_connect("host=localhost dbname=D4D user=postgres");
if (!$dbh) {
     die("Error in connection: " . pg_last_error());
 } else {
     $query = "select * from week" . $week . " where user_id = " . $user .";";
     $res = pg_query($dbh, $query);

	 $geojson = array('type' => 'FeatureCollection', 'features' => array() );
 
	 $coords = array();
	 while($row = pg_fetch_assoc($res)){
		array_push($coords, array($row['longitude'], $row['latitude']));
	 }

	 $feature = array(
		'type' => 'Feature',
		'geometry' => array(
			'type' => 'LineString',
			'coordinates' => $coords
			)
		);
	 array_push($geojson['features'], $feature);
	 
	 echo json_encode($geojson); 
     pg_free_result($res);
     pg_close($dbh);
 }

?>
