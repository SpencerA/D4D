<?php
$date = date($_GET["date"]);
$clusts = $_GET["clusts"];
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
     $query = "select distinct user_id from md_week" . $week_id . " where date(connection_datetime) = '" . $date ."' and clust in (". $clusts . ");";
	 $res = pg_query($dbh, $query);
	 $utable = array('rands'=> array());
	 while($row = pg_fetch_assoc($res)){
        array_push($utable['rands'], intval($row['user_id']));
     }
	 
	 echo json_encode($utable); 
     pg_free_result($res);
     pg_close($dbh);
 }
?>
