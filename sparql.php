<?php
require_once( "sparql/sparqllib.php" );
//endurl for sparql server (this is th http link the server is listening on)
$end_url = "http://localhost:3030/ds";
//connecting to database
$db = sparql_connect($end_url);

if( !$db ) {echo 0;exit; }
sparql_ns( "foaf","http://xmlns.com/foaf/0.1/" );
$search_text = $_GET['search'];
//writting query
$sparql = "SELECT ?subject ?predicate ?object
WHERE {
  ?subject ?predicate ?object
}
LIMIT 25";
$result = sparql_query( $sparql ); 
if( !$result ) { echo 0; exit; }

$fields = sparql_field_array( $result );
//printing results as table
print "<div><center>Number of rows: ".sparql_num_rows( $result )." results.</center></div>";
print "<table class='example_table'>";
print "<tr>";
foreach( $fields as $field )
{
	print "<th>$field</th>";
}
print "</tr>";
while( $row = sparql_fetch_array( $result ) )
{
	print "<tr>";
	foreach( $fields as $field )
	{
		print "<td>$row[$field]</td>";
	}
	print "</tr>";
}
print "</table>";


