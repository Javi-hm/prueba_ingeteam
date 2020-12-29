$(document ).ready(function() {

    //  Ver/ocultar login y sign up
    $('.text-sign-up span').on('click', function(){
        $('.form-login').css('display', 'none');
        clear_form_login();
        $('.form-sign-up').css('display', 'block');
    });
    $('.text-login span').on('click', function(){
        $('.form-sign-up').css('display', 'none');
        clear_form_sign_up();
        $('.form-login').css('display', 'block');
    });
    
    //Eventos de perdida de foco para validar campos
    $('#login-email').on('blur', function(){
        validate_login_field_email();
    });
    $('#sign-up-username').on('blur', function(){
        validate_sign_up_field_username();
    });
    $('#sign-up-email').on('blur', function(){
        validate_sign_up_field_email();
    });
    $('#sign-up-description').on('blur', function(){
        validate_sign_up_field_description();
    });
    $('#sign-up-address').on('blur', function(){
        validate_sign_up_field_address();
    });
    $('#sign-up-cp').on('blur', function(){
        validate_sign_up_field_cp();
    });
    $('#sign-up-password').on('blur', function(){
        validate_sign_up_field_password();
    });
    $('#sign-up-password-repeat').on('keyup', function(){
        validate_sign_up_field_password();
    });
    
    //Validamos el formulario de login y si es correcto realizamos la peticion
    $('#submit-login').on('click', function(){
        if(validate_form_login()){
            login();
        }
    });
    $("#form-login").keypress(function(e) {
        if(e.which == 13) {
            if(validate_form_login()){
                login();
            }
        }
    });
    
    //Validamos el formulario de registro y si es correcto realizamos la peticion
    $('#submit-sign-up').on('click', function(){
        if(validate_form_sign_up()){
            sign_up();
        }
    });
    $("#form-sign-up").keypress(function(e) {
        if(e.which == 13) {
            if(validate_form_sign_up() && !$('textarea').is(':focus')){
                sign_up();
            }
        }
     });

});

/*  Formulario de login  */
var email_login = false;
//Validamos campo email
function validate_login_field_email(){
    var email = $('#login-email').val();
    if(re_email(email)){
        $('#error-login-email').html('&nbsp;');
        email_login = true;
    }else{
        $('#error-login-email').text('Formato de email incorrecto.');
        email_login = false;
    }
}
//Validamos que los datos del formulario de login cumplen los requisitos
function validate_form_login(){
    validate_login_field_email();
    return email_login;
}
//Mandamos la petición de login al back
function login(){
    var form_data = new FormData(document.getElementById('form-login'));
    form_data = form_data_to_obj(form_data);
    $.ajax({
        type: "POST",
        url: "/ingeteam/backend/models/model_user.php?function=login",
        data: form_data,
        success: function(res){
            var json = JSON.parse(res);
            if(json.result){
                $('.login-error').css('display', 'none');
                location.href="/perfil";
            }else{
                $('.login-error').css('display', 'block');
                setTimeout(function(){
                    $('.login-error').css('display', 'none');
                }, 3000);
            }
        },
        error: function(error){
            console.log(error);
        }
    }); 
}


/*  Formulario de registro  */
var username_sign_up    = false;
var email_sign_up       = false;
var description_sign_up = false;
var address_sign_up     = false;
var cp_sign_up          = false;
var password_sign_up    = false;
//Validamos campo usuario
function validate_sign_up_field_username(){
    var username = $('#sign-up-username').val();
    if(username != ''){
        if(re_only_letters(username)){
            $('#error-sign-up-username').html('&nbsp;');
            username_sign_up = true;
        }else{
            $('#error-sign-up-username').text('Este campo solo admite letras.');
            username_sign_up = false;
        }
    }else{
        $('#error-sign-up-username').text('Campo obligatorio.');
        username_sign_up = false;
    }
}
//Validamos campo email
function validate_sign_up_field_email(){
    var email = $('#sign-up-email').val();
    if(email != ''){
        if(re_email(email)){
            $.ajax({
                type: "GET",
                url: "/ingeteam/backend/models/model_user.php?function=user-exists&email="+email,
                success: function(res){
                    var json = JSON.parse(res);
                    if(json.result){
                        $('#error-sign-up-email').text(json.info);
                        email_sign_up = false;
                    }else{
                        $('#error-sign-up-email').html('&nbsp;');
                        email_sign_up = true;
                    }
                },
                error: function(error){
                    console.log(error);
                }
            });
            
        }else{
            $('#error-sign-up-email').text('Formato de email incorrecto.');
            email_sign_up = false;
        }
    }else{
        $('#error-sign-up-email').text('Campo obligatorio.');
        email_sign_up = false;
    }
}
//Validamos campo descripcion
function validate_sign_up_field_description(){
    var description = $('#sign-up-description').val();
    if(description != ''){
        $('#error-sign-up-description').html('&nbsp;');
        description_sign_up = true;
    }else{
        $('#error-sign-up-description').text('Campo obligatorio.');
        description_sign_up = false;
    }
}
//Validamos campo descripcion
function validate_sign_up_field_address(){
    var address = $('#sign-up-address').val();
    if(address != ''){
        $('#error-sign-up-address').html('&nbsp;');
        address_sign_up = true;
    }else{
        $('#error-sign-up-address').text('Campo obligatorio.');
        address_sign_up = false;
    }
}
//Validamos campo cp
function validate_sign_up_field_cp(){
    var cp = $('#sign-up-cp').val();
    if(cp != ''){
        if(re_cp(cp)){
            $('#error-sign-up-cp').html('&nbsp;');
            cp_sign_up = true;
        }else{
            $('#error-sign-up-cp').text('Formato incorrecto (5 dígitos).');
            cp_sign_up = false;
        }
    }else{
        $('#error-sign-up-cp').text('Campo obligatorio.');
        cp_sign_up = false;
    }
}
//Validamos campo contraseña
function validate_sign_up_field_password(){
    var password = $('#sign-up-password').val();
    var rpassword = $('#sign-up-password-repeat').val();
    if(password != ''){
        if(password == rpassword){
            if(re_password_secure(password)){
                $('#error-sign-up-password').html('&nbsp;');
                password_sign_up = true;
            }else{
                $('#error-sign-up-password').text('(8-128 caracteres, 1 minúscula, 1 mayúscula)');
                password_sign_up = false;
            }
        }else{
            $('#error-sign-up-password').text('Las contraseñas no coinciden.');
            password_sign_up = false;
        }
    }else{
        $('#error-sign-up-password').text('Campo obligatorio.');
        password_sign_up = false;
    }
}
//Validamos que los datos del formulario de registro cumplen los requisitos
function validate_form_sign_up(){
    validate_sign_up_field_username();
    validate_sign_up_field_email();
    validate_sign_up_field_description();
    validate_sign_up_field_address();
    validate_sign_up_field_cp();
    validate_sign_up_field_password();
    return username_sign_up && email_sign_up && description_sign_up && address_sign_up && cp_sign_up && password_sign_up;
}

//Mandamos la petición de registro al back
function sign_up(){
    var form_data = new FormData(document.getElementById('form-sign-up'));
    form_data = form_data_to_obj(form_data);
    $.ajax({
        type: "POST",
        url: "/ingeteam/backend/models/model_user.php?function=sign-up",
        data: form_data,
        success: function(res){
            var json = JSON.parse(res);
            if(json.result){
                $('.sign-up-error').css('display', 'none');
                location.href="/perfil";
            }else{
                $('.sign-up-error').css('display', 'block');
                setTimeout(function(){
                    $('.sign-up-error').css('display', 'none');
                }, 3000);
            }
        },
        error: function(error){
            console.log(error);
        }
    }); 
}

function clear_form_login(){
    $('#login-email').val('');
    $('#login-password').val('');
    $('#error-login-email').html('&nbsp;');
    $('.login-error').css('display', 'none');
}

function clear_form_sign_up(){
    $('#sign-up-username').val('');
    $('#sign-up-email').val('');
    $('#sign-up-description').val('');
    $('#sign-up-address').val('');
    $('#sign-up-cp').val('');
    $('#sign-up-password').val('');
    $('#sign-up-password-repeat').val('');
    $('#error-sign-up-username').html('&nbsp;');
    $('#error-sign-up-email').html('&nbsp;');
    $('#error-sign-up-description').html('&nbsp;');
    $('#error-sign-up-address').html('&nbsp;');
    $('#error-sign-up-cp').html('&nbsp;');
    $('#error-sign-up-password').html('&nbsp;');
}