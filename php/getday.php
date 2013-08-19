<?php
$date = date($_GET["date"]);
$rows = $_GET["rows"];
$m = $_GET["max"];
$clusts = $_GET["clusts"];
$lo = 1;
$hi = 70000;
switch($rows)
{
	case 1:
		$lo = 1;
		$hi = 70000;
		break;
	case 2:
		$lo = 70001;
		$hi = 140000;
		break;
	case 3:
		$lo = 140001;
		$hi = 210000;
		break;
	case 4:
		$lo = 210001;
		$hi = 280000;
		break;
	case 5:
		$lo = 280001;
		$hi = 350000;
		break;
	case 6:
		$lo = 350001;
		$hi = 420000;
		break;
	case 7:
		$lo = 420001;
		$hi = 490000;
		break;
	case 8:
		$lo = 490001;
		$hi = 560000;
		break;
	case 9:
		$lo = 560001;
		$hi = 630000;
		break;
	default:
		$lo = 1;
		$hi = 70000;
}
//build pg query from date
if ($date <= date("2011-12-18") && $date >= date("2011-12-05"))
{
	$week_id = 0;
	$day = (int)($date[8] . $date[9]);
}
else if ($date <= date("2012-01-01") && $date > date("2011-12-18"))
{
	$week_id = 1;
	$day = (int)($date[8] . $date[9]);
}
else if ($date <= date("2012-01-15") && $date > date("2012-01-01"))
{
	$week_id = 2;
	$day = (int)($date[8] . $date[9]);
}
else if ($date <= date("2012-01-29") && $date > date("2012-01-15"))
{
	$week_id = 3;
	$day = (int)($date[8] . $date[9]);
}
else if ($date <= date("2012-02-12") && $date > date("2012-01-29"))
{
	$week_id = 4;
	$day = (int)($date[8] . $date[9]);
}
else if ($date <= date("2012-02-26") && $date > date("2012-02-12"))
{
	$week_id = 5;
	$day = (int)($date[8] . $date[9]);
}
else if ($date <= date("2012-03-11") && $date > date("2012-02-26"))
{
	$week_id = 6;
	$day = (int)($date[8] . $date[9]);
}
else if ($date <= date("2012-03-25") && $date > date("2012-03-11"))
{
	$week_id = 7;
	$day = (int)($date[8] . $date[9]);
}
else if ($date <= date("2012-04-08") && $date > date("2012-03-25"))
{
	$week_id = 8;
	$day = (int)($date[8] . $date[9]);
}
else if ($date <= date("2012-04-22") && $date > date("2012-04-08"))
{
	$week_id = 9;
	$day = (int)($date[8] . $date[9]);
} 
else if ($date <= date("2011-12-05") || $date >= date("2012-04-23"))
{
	$week_id = 0;
	$day = 5;
}
$dbh = pg_connect("host=localhost dbname=D4D user=postgres");
if (!$dbh) {
     die("Error in connection: " . pg_last_error());
 } else {

$len = count(explode(',', $clusts));
if ($len != 4) {
	$query = "create temp table tmp0 as (select * from  sa_week". $week_id ." where clust in (" . $clusts . ") and date(connection_datetime)='" . $date . "'); alter table tmp0 add column new_id serial PRIMARY KEY; select * from tmp0 where new_id >= " .$lo . " and new_id <= " . $hi . ";";
} else {
    $query = "select user_id, connection_datetime, longitude, latitude, clust from sa_week" . $week_id . " where date(connection_datetime) = '" . $date . "' and pid >= " . $lo . " and pid <= " . min($hi,$m) . " and clust in (" . $clusts . ") order by connection_datetime;";
}
	 $res = pg_query($dbh, $query);
	 $utable = array('users'=> array());
	 while($row = pg_fetch_assoc($res)){
		array_push($utable['users'], array("userid"=> $row['user_id'],
				   "datetime" => $row['connection_datetime'],
				   "cluster" => $row['clust'],
				   "coords" => array($row['longitude'],
				   $row['latitude'])));
	 }
	 echo json_encode($utable); 
     pg_free_result($res);
     pg_close($dbh);
 }
?>
