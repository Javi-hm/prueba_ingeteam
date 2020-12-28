$(document ).ready(function() {
    draw_navbar();
});

//Pintamos la barra de navegacion
function draw_navbar(){
    var navbar_html = '';
    
    $.ajax({
        type: "GET",
        url: "/ingeteam/backend/models/model_user.php?function=get-username",
        success: function(res){
            var json = JSON.parse(res);
            var username = 'Usuario';
            if(json.result){
                username = json[0].username;
            }
            navbar_html += '<nav class="horizontal-navbar"><a href="/perfil"><img src="/ingeteam/front/img/ingeteam-logo.png" alt="Logo Ingeteam"></a><p><span id="dropdown-user"><i class="fas fa-user"></i>&nbsp; '+username+' &nbsp;<i class="fas fa-chevron-down"></i></span></p></nav><nav class="vertical-navbar"><p class="vertical-navbar-title">Mi cuenta <span id="close-vertical-navbar"><i class="fas fa-times"></i></span></p><hr><a href="/perfil"><p><i class="fas fa-user"></i> Perfil</p></a><p id="logout"><i class="fas fa-sign-out-alt"></i> Cerrar sesión</p></nav><div class="end-horizontal-navbar"></div>';
            $('header').html(navbar_html);
            navbar_control();
        },
        error: function(error){
            console.log(error);
        }
    });

}

//Cerramos la sesion
function logout(){
    $.ajax({
        type: "GET",
        url: "/ingeteam/backend/models/model_user.php?function=logout",
        success: function(res){
            var json = JSON.parse(res);
            if(json.result){
                location.href="/";
            }
        },
        error: function(error){
            console.log(error);
        }
    }); 
}

function navbar_control(){
    $('#dropdown-user').on('click', function(){
        $('.vertical-navbar').addClass('show-vertical-navbar');
    });
    $('#close-vertical-navbar').on('click', function(){
        $('.vertical-navbar').removeClass('show-vertical-navbar');
    });
    //Para que se cierra el menu vertical cuando pincho fuera
    $(document).on('click', function(){
        $('.vertical-navbar').removeClass('show-vertical-navbar');
    });

    $('.vertical-navbar, #dropdown-user').click(function(e){
        e.stopPropagation();
    });

    $('#logout').on('click', function(){
        logout();
    });
}