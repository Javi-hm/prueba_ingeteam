//En este documento se implementaran funciones que se pueden reutilizar por toda la web

/*  Expresiones Regulares   */

//Funcion que comprueba si una cadena de texto contiene solo letras
function re_only_letters(text){
    var re = /^[a-z]+$/i; //Solo letras minusculas y mayusculas
    return re.test(text);
}

//Funcion que comprueba si un email es valido
function re_email(text){
    var re = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    return re.test(text);
}

//Funcion que comprueba si un codigo postal es valido
function re_cp(text){
    var re = /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/;
    return re.test(text);
}

//Funcion que comprueba si la contraseña tiene minimo 8 caracteres, maximo 128, una minuscula y una mayuscula
function re_password_secure(text){
    var re = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,128}$/;
    return re.test(text);
}


/*  Fin Expresiones Regulares   */

//Funcion que convierte un form_data en un objeto (Para las peticiones ajax)
function form_data_to_obj(form_data){
    var obj = {};
    for(var pair of form_data.entries()) {
        obj[pair[0]] = pair[1];
    }
    return obj;
}