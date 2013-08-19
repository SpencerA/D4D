<?php

$cl = $_GET["cl"];

$dbh = pg_connect("host=localhost dbname=D4D user=postgres");
if (!$dbh) {
     die("Error in connection: " . pg_last_error());
 } else {
     $query = "select * from antenna_def_cluster where clust = " . $cl . ";";
	 $res = pg_query($dbh, $query);
	 $ants = array('ants'=> array());
	 while($row = pg_fetch_assoc($res)){
		array_push($ants['ants'], array("ant_id"=>$row['antenna_id'],
						   "coords"=>array($row['longitude'],$row['latitude']),
						   "cluster"=>$row['clust']));
	 }
	 echo json_encode($ants); 
     pg_free_result($res);
     pg_close($dbh);
 }
?>
