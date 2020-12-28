$(document ).ready(function() {

    //Para focus en los input/textarea
    $(".form-field").each(function(index) {
        $(this).on('click', function(){
            $(this).find('input').focus();
            $(this).find('textarea').focus();
        });
    });

    //Para focus en los input/textarea
    $(".user-data-label-value").each(function(index) {
        $(this).on('click', function(){
            $(this).find('input').focus();
            $(this).find('textarea').focus();
        });
    });

    //Para cerrar las notificaciones
    $('.notification').on('click', function(){
        $(this).css('display', 'none')
    });

});