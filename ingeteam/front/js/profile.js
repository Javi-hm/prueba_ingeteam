var task_id_delete = '';
var task_id_edit = '';
var json_tasks = '';

$(document ).ready(function() {

    get_user();
    get_user_tasks()

    //Formulario de cambio de contraseña
    $('#close-form-password').on('click', function(){
        clear_form_change_password();
        $('.overlay-password').css('display', 'none');
    });
    $('#edit-password').on('click', function(){
        $('.overlay-password').css('display', 'flex');
    });
    //Cerramos formulario de cambio de conrtaseña si se pincha fuera
    $('.overlay-password').on('click', function(){
        clear_form_change_password();
        $('.overlay-password').css('display', 'none');
    });
    $('.form-password').on('click' ,function(e){
        e.stopPropagation();
    });

    //Formulario añadir tarea
    $('#close-form-task').on('click', function(){
        clear_form_add_task();
        $('.overlay-task').css('display', 'none');
    });
    $('#add-task').on('click', function(){
        $('.overlay-task').css('display', 'flex');
    });
    //Cerramos formulario de añadir tarea si se pincha fuera
    $('.overlay-task').on('click', function(){
        clear_form_add_task();
        $('.overlay-task').css('display', 'none');
    });
    $('.form-task').on('click' ,function(e){
        e.stopPropagation();
    });

    $('#submit-form-user-data').on('click', function(){
        update_user();
    });
    $("#form-user-data").keypress(function(e) {
        if(e.which == 13 && !$('textarea').is(':focus')) {
            update_user();
        }
    });

    //Formulario cambio de contraseña
    $('#old-password').on('blur', function(){
        validate_old_password();
    });
    $('#new-password-repeat').on('keyup', function(){
        validate_new_password();
    });
    $('#submit-change-password').on('click', function(){
        if(validate_form_change_password()){
            update_password();
        }
    });
    $("#form-change-password").keypress(function(e) {
        if(e.which == 13) {
            if(validate_form_change_password()){
                update_password();
            }
        }
    });

    //Formulario añadir tarea
    $('#task-name').on('blur', function(){
        validate_task_name();
    });
    $('#task-description').on('blur', function(){
        validate_task_description();
    });

    $('#submit-add-task').on('click', function(){
        if(validate_form_add_task()){
            add_task();
        }
    });
    $("#form-add-task").keypress(function(e) {
        if(e.which == 13) {
            if(validate_form_add_task() && !$('textarea').is(':focus')){
                add_task();
            }
        }
    });


    //Editar tarea
    $('#close-form-edit-task').on('click', function(){
        $('.overlay-edit-task').css('display', 'none');
        clear_form_edit_task();
    });
    $('.overlay-edit-task').on('click', function(){
        $('.overlay-edit-task').css('display', 'none');
        clear_form_edit_task();
    });
    $('.form-edit-task').on('click' ,function(e){
        e.stopPropagation();
    });
    
    $('#edit-task-name').on('blur', function(){
        validate_edit_task_name();
    });
    $('#edit-task-description').on('blur', function(){
        validate_edit_task_description();
    });
    $('#submit-edit-task').on('click', function(){
        if(validate_form_edit_task()){
            edit_task();
        }
    });
    $("#form-edit-task").keypress(function(e) {
        if(e.which == 13) {
            if(validate_form_edit_task() && !$('textarea').is(':focus')){
                edit_task();
            }
        }
    });
    


    //Eliminar tarea
    $('#confirm-delete-cancel').on('click', function(){
        $('.overlay-delete').css('display', 'none');
    });
    $('.overlay-delete').on('click', function(){
        $('.overlay-delete').css('display', 'none');
    });
    $('.confirm-delete').on('click' ,function(e){
        e.stopPropagation();
    });

    $('#confirm-delete-ok').on('click', function(){
        delete_task();
    });
    
});

//Obtenemos el usuario logueado
function get_user(){
    $.ajax({
        type: "GET",
        url: "/ingeteam/backend/models/model_user.php?function=get-user",
        success: function(res){
            var json = JSON.parse(res);
            if(json.result){
                $('#dropdown-user').html('<i class="fas fa-user"></i>&nbsp; '+json[0].username+' &nbsp;<i class="fas fa-chevron-down"></i>');
                $('#user-data-email').val(json[0].email);
                $('#user-data-username').val(json[0].username);
                $('#user-data-description').val(json[0].description);
                $('#user-data-cp').val(json[0].cp);
                $('#user-data-address').val(json[0].address);
            }else{
                location.href="/";
            }
        },
        error: function(error){
            console.log(error);
        }
    }); 
}

//Formulario de actualizacion de los datos del usuario
function update_user(){
    var form_data = new FormData(document.getElementById('form-user-data'));
    form_data = form_data_to_obj(form_data);
    $.ajax({
        type: "POST",
        url: "/ingeteam/backend/models/model_user.php?function=update-user",
        data: form_data,
        success: function(res){
            var json = JSON.parse(res);
            var notification_class = '';
            if(json.result){
                notification_class = 'notification-ok';
            }else{
                notification_class = 'notification-error';
            }
            $('.notification p').text(json.info);
            $('.notification p').addClass(notification_class);
            $('.notification').css('display', 'flex');
            get_user();
            setTimeout(function(){
                $('.notification p').text('');
                $('.notification p').removeClass(notification_class);
                $('.notification').css('display', 'none');
            }, 2500);
        },
        error: function(error){
            console.log(error);
        }
    }); 
}

var old_password = false;
var new_password = false;

function validate_form_change_password(){
    validate_old_password();
    validate_new_password();
    return old_password && new_password;
}
//Validamos campo contraseña vieja del formulario de cambio de contraseña
function validate_old_password(){
    var password = $('#old-password').val();
    if(password != ''){
        $('#error-old-password').html('&nbsp;');
        old_password = true;
    }else{
        $('#error-old-password').text('Campo obligatorio.');
        old_password = false;
    }

}
//Validamos campo nueva contraseña del formulario de cambio de contraseña
function validate_new_password(){
    var password = $('#new-password').val();
    var rpassword = $('#new-password-repeat').val();
    if(password != ''){
        if(password == rpassword){
            if(re_password_secure(password)){
                $('#error-new-password').html('&nbsp;');
                new_password = true;
            }else{
                $('#error-new-password').text('(8-128 caracteres, 1 minúscula, 1 mayúscula)');
                new_password = false;
            }
        }else{
            $('#error-new-password').text('Las contraseñas no coinciden.');
            new_password = false;
        }
    }else{
        $('#error-new-password').text('Campo obligatorio.');
        new_password = false;
    }
}

function update_password(){
    var form_data = new FormData(document.getElementById('form-change-password'));
    form_data = form_data_to_obj(form_data);
    $('.overlay-password').css('display', 'none');
    $.ajax({
        type: "POST",
        url: "/ingeteam/backend/models/model_user.php?function=update-user-password",
        data: form_data,
        success: function(res){
            var json = JSON.parse(res);
            var notification_class = '';
            if(json.result){
                notification_class = 'notification-ok';
            }else{
                notification_class = 'notification-error';
            }
            clear_form_change_password();
            $('.notification p').text(json.info);
            $('.notification p').addClass(notification_class);
            $('.notification').css('display', 'flex');
            setTimeout(function(){
                $('.notification p').text('');
                $('.notification p').removeClass(notification_class);
                $('.notification').css('display', 'none');
            }, 2500);
        },
        error: function(error){
            console.log(error);
        }
    });
}

function clear_form_change_password(){
    $('#old-password').val('');
    $('#new-password').val('');
    $('#new-password-repeat').val('');
    $('#error-old-password').html('&nbsp;');
    $('#error-new-password').html('&nbsp;');
}



//Formulario añadir tarea
var task_name_ = false;
var task_description_ = false;

function validate_form_add_task(){
    validate_task_name();
    validate_task_description();
    return task_name_ && task_description_;
}

function validate_task_name(){
    var task_name = $('#task-name').val();
    if(task_name != ''){
        $('#error-task-name').html('&nbsp;');
        task_name_ = true;
    }else{
        $('#error-task-name').text('Campo obligatorio.');
        task_name_ = false;
    }
}

function validate_task_description(){
    var task_description = $('#task-description').val();
    if(task_description != ''){
        $('#error-task-description').html('&nbsp;');
        task_description_ = true;
    }else{
        $('#error-task-description').text('Campo obligatorio.');
        task_description_ = false;
    }
}

function add_task(){
    var form_data = new FormData(document.getElementById('form-add-task'));
    form_data = form_data_to_obj(form_data);
    $('.overlay-task').css('display', 'none');
    $.ajax({
        type: "POST",
        url: "/ingeteam/backend/models/model_task.php?function=add-task",
        data: form_data,
        success: function(res){
            var json = JSON.parse(res);
            var notification_class = '';
            if(json.result){
                notification_class = 'notification-ok';
            }else{
                notification_class = 'notification-error';
            }
            clear_form_add_task();
            get_user_tasks();
            $('.notification p').text(json.info);
            $('.notification p').addClass(notification_class);
            $('.notification').css('display', 'flex');
            setTimeout(function(){
                $('.notification p').text('');
                $('.notification p').removeClass(notification_class);
                $('.notification').css('display', 'none');
            }, 2500);
        },
        error: function(error){
            console.log(error);
        }
    });
}

function clear_form_add_task(){
    $('#task-name').val('');
    $('#task-description').val('');
    $('#error-task-name').html('&nbsp;');
    $('#error-task-description').html('&nbsp;');
}

//Obtenemos las tareas del usuario
function get_user_tasks(){
    $.ajax({
        type: "GET",
        url: "/ingeteam/backend/models/model_task.php?function=get-user-tasks",
        success: function(res){
            var json = JSON.parse(res);
            json_tasks = json;
            if(json.length>0){
                var task_waiting = '<div class="task-column"><p class="task-title">En espera</p>';
                var task_in_process = '<div class="task-column"><p class="task-title">En proceso</p>';
                var task_finished = '<div class="task-column"><p class="task-title">Finalizada</p>';
                for(var i=0; i<json.length; i++){
                    switch(json[i].task_state){
                        case 'waiting':
                            task_waiting += '<div class="task-waiting"><p class="task-name">'+json[i].task_name+'<span title="Eliminar tarea" class="task-operation delete-waiting" id="'+json[i].task_id+'"><i class="fas fa-trash"></i></span><span title="Editar tarea" class="task-operation edit-waiting" id="'+json[i].task_id+'"><i class="fas fa-edit"></i></span><span title="Pasar a en proceso" class="task-operation state-waiting" id="'+json[i].task_id+'"><i class="fas fa-angle-double-right"></i></span></p><p class="task-desciption">'+json[i].task_description+'</p> </div>';
                            break;
                        case 'in_process':
                            task_in_process += '<div class="task-in-process"><p class="task-name">'+json[i].task_name+' <span title="Eliminar tarea" class="task-operation delete-in-process" id="'+json[i].task_id+'"><i class="fas fa-trash"></i></span><span title="Editar tarea" class="task-operation edit-in-process" id="'+json[i].task_id+'"><i class="fas fa-edit"></i></span><span title="Pasar a finalizada" class="task-operation state-in-process" id="'+json[i].task_id+'"><i class="fas fa-angle-double-right"></i></span></p><p class="task-desciption">'+json[i].task_description+'</p> </div>';
                            break;
                        case 'finished':
                            task_finished += '<div class="task-finished"><p class="task-name">'+json[i].task_name+' <span title="Eliminar tarea" class="task-operation delete-finished" id="'+json[i].task_id+'"><i class="fas fa-trash"></i></span><span title="Editar tarea" class="task-operation edit-finished" id="'+json[i].task_id+'"><i class="fas fa-edit"></i></span></p><p class="task-desciption">'+json[i].task_description+'</p> </div>';
                            break;
                    }
                }
                task_waiting += '</div>';
                task_in_process += '</div>';
                task_finished += '</div>';
                $('#user-tasks').html(task_waiting+task_in_process+task_finished);
                control_buttons_tasks();
            }else{
                $('#user-tasks').html('<p class="no-tasks">No hay tareas creadas.</p>');
            }
        },
        error: function(error){
            console.log(error);
        }
    }); 
}

function control_buttons_tasks(){
    $(".state-waiting, .state-in-process").each(function(index) {
        $(this).on('click', function(){
            var task_id = $(this).attr('id');
            $.ajax({
                type: "GET",
                url: "/ingeteam/backend/models/model_task.php?function=update-task-state&task_id="+task_id,
                success: function(res){
                    var json = JSON.parse(res);
                    if(json.result){
                        get_user_tasks();
                    }
                },
                error: function(error){
                    console.log(error);
                }
            }); 
        });
    });
    $(".edit-waiting, .edit-in-process, .edit-finished").each(function(index) {
        $(this).on('click', function(){
            task_id_edit = $(this).attr('id');
            for(var i=0; i<json_tasks.length; i++){
                if(json_tasks[i].task_id == task_id_edit){
                    $('#edit-task-name').val(json_tasks[i].task_name);
                    $('#edit-task-state').val(json_tasks[i].task_state);
                    $('#edit-task-description').val(json_tasks[i].task_description);
                }
            }
            $('.overlay-edit-task').css('display', 'flex');
        });
    });
    $(".delete-waiting, .delete-in-process, .delete-finished").each(function(index) {
        $(this).on('click', function(){
            task_id_delete = $(this).attr('id');
            $('.overlay-delete').css('display', 'flex');
        });
    });
}

function delete_task(){
    $('.overlay-delete').css('display', 'none');
    $.ajax({
        type: "GET",
        url: "/ingeteam/backend/models/model_task.php?function=delete-task&task_id="+task_id_delete,
        success: function(res){
            var json = JSON.parse(res);
            if(json.result){
                get_user_tasks();
            }
        },
        error: function(error){
            console.log(error);
        }
    });
}


//Formulario editar tarea
var task_edit_name_ = false;
var task_edit_description_ = false;

function validate_form_edit_task(){
    validate_edit_task_name();
    validate_edit_task_description();
    return task_edit_name_ && task_edit_description_;
}

function validate_edit_task_name(){
    var task_name = $('#edit-task-name').val();
    if(task_name != ''){
        $('#error-edit-task-name').html('&nbsp;');
        task_edit_name_ = true;
    }else{
        $('#error-edit-task-name').text('Campo obligatorio.');
        task_edit_name_ = false;
    }
}

function validate_edit_task_description(){
    var task_description = $('#edit-task-description').val();
    if(task_description != ''){
        $('#error-edit-task-description').html('&nbsp;');
        task_edit_description_ = true;
    }else{
        $('#error-edit-task-description').text('Campo obligatorio.');
        task_edit_description_ = false;
    }
}

function edit_task(){
    var form_data = new FormData(document.getElementById('form-edit-task'));
    form_data = form_data_to_obj(form_data);
    $('.overlay-edit-task').css('display', 'none');
    $.ajax({
        type: "POST",
        url: "/ingeteam/backend/models/model_task.php?function=edit-task&task_id="+task_id_edit,
        data: form_data,
        success: function(res){
            var json = JSON.parse(res);
            if(json.result){
                get_user_tasks();
            }
        },
        error: function(error){
            console.log(error);
        }
    });
}

function clear_form_edit_task(){
    $('#error-edit-task-description').html('&nbsp;');
    $('#error-edit-task-name').html('&nbsp;');
}