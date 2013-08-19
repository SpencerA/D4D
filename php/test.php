<?php
$dbh = pg_connect("host=localhost dbname=D4D user=postgres");
if (!$dbh) {
     die("Error in connection: " . pg_last_error());
 } else {
     $query = "select * from d3_rail limit 5;";
	 $res = pg_query($dbh, $query);
	 $utable = array('users'=> array());
	 
	 while($row = pg_fetch_assoc($res)){
		array_push($utable['users'], array("userid"=> $row['user_id'],
				   "datetime" => $row['connection_datetime'],
				   "coords" => array($row['longitude'],
				   $row['latitude'])));
	 }
	 echo json_encode($utable); 
     pg_free_result($res);
     pg_close($dbh);
 }
?>
