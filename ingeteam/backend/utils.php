<?php

/*  Expresiones Regulares   */

//Funcion que comprueba si una cadena de texto contiene solo letras
function re_only_letters($text){
    $re = '/^[a-z]+$/i'; //Solo letras minusculas y mayusculas
    return preg_match($re, $text);
}

//Funcion que comprueba si un email es valido
function re_email($text){
    $re = '/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i';
    return preg_match($re, $text);
}

//Funcion que comprueba si un codigo postal es valido
function re_cp($text){
    $re = '/^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/';
    return preg_match($re, $text);
}

//Funcion que comprueba si la contraseña tiene minimo 8 caracteres, maximo 128, una minuscula y una mayuscula
function re_password_secure($text){
    $re = '/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,128}$/';
    return preg_match($re, $text);
}

/*  Fin Expresiones Regulares   */

?>