<?php
$TO = "jean-yves.schonseck@univ-lille3.fr";

//$h  = "From: " . $TO;

//$message = "";

//while (list($key, $val) = each($_POST)) {
//  $message .= "$key : $val\n";
//}

mail($TO,"[Cité-langage]".$_POST["nom"].$_POST["title"], $_POST["comments"], "From:".$_POST["email"]."\r\n" .
     "Reply-To:".$_POST["email"] );

Header("Location: ../home.html");

?>