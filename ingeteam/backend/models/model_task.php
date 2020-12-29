<?php

include '../utils.php';

$task = new Task();
switch($_GET['function']){
    case 'add-task':
        $task->add_task();
        break;
    case 'get-user-tasks':
        $task->get_user_tasks();
        break;
    case 'update-task-state':
        $task->update_task_state();
        break;
    case 'edit-task':
        $task->edit_task();
        break;
    case 'delete-task':
        $task->delete_task();
        break;   
         
}

class Task{

    private $db;
    
    function  __construct(){
        include '../../database/conecction_db.php';
        $db = new db();
        $this->db = $db->connectDB();
    }

    //Funcion que añade una tarea en la base de datos
    public function add_task(){
        try{
            session_start();
            $result = array();

            $user_id            = ((isset($_SESSION['user']))?$_SESSION['user']:'');
            $task_name          = strip_tags(((isset($_POST['name']))?$_POST['name']:''));
            $task_description   = strip_tags(((isset($_POST['description']))?$_POST['description']:''));

            if($task_name != '' && $task_description != ''){
                $query = $this->db->prepare('INSERT INTO tasks (task_id, user_id, task_date, task_state, task_name, task_description) VALUES (?,?,?,?,?,?)');
                $insert_ok = $query->execute([null, $user_id, date('Y-m-d H:i:s'), 'waiting', $task_name, $task_description]);
                if($insert_ok){
                    $result['result'] = $insert_ok;
                    $result['info'] = "Tarea añadida correctamente.";
                    echo json_encode($result);
                }else{
                    $result['result'] = $insert_ok;
                    $result['info'] = "Error al añadir la tarea.";
                    echo json_encode($result);
                }
                $query = null;
                $this->db = null;
            }else{
                $result['result'] = false;
                $result['info'] = "Error en el formato de los campos.";
                echo json_encode($result);
            }

        }catch(PDOException $e){
            $result['result'] = false;
            $result['info'] = "Exception";
            echo json_encode($result);
        }
    }

    //Funcion que devuelve las tareas del usuario de sesión
    public function get_user_tasks(){
        try{
            session_start();
            $result = array();

            $user_id = ((isset($_SESSION['user']))?$_SESSION['user']:'');

            $query = $this->db->prepare("SELECT task_id, task_state, task_name, task_description FROM tasks WHERE user_id = ".$user_id." order by task_date asc");
            $query->execute();

            if($query->rowCount()>0){
                $result = $query->fetchALL(PDO::FETCH_OBJ);
                echo json_encode($result);
            }else{
                echo json_encode($result);
            }
            $query = null;
            $this->db = null;

        }catch(PDOException $e){
            $result['result'] = false;
            $result['info'] = "Exception";
            echo json_encode($result);
        }
    }

    //Funcion que actualiza el estado de una tarea
    public function update_task_state(){
        try{
            session_start();
            $result = array();

            $user_id = ((isset($_SESSION['user']))?$_SESSION['user']:'');
            $task_id = strip_tags(((isset($_GET['task_id']))?$_GET['task_id']:''));

            $query = $this->db->prepare("SELECT task_id FROM tasks WHERE user_id = ".$user_id." and task_id=".$task_id." and task_state = 'waiting'");
            $query->execute();

            $update_ok = false;

            if($query->rowCount() == 1){
                $query = $this->db->prepare("UPDATE tasks SET task_state='in_process' WHERE task_id=".$task_id." and user_id=".$user_id);
                $update_ok = $query->execute();
            }else{
                $query = $this->db->prepare("UPDATE tasks SET task_state='finished' WHERE task_id=".$task_id." and user_id=".$user_id);
                $update_ok = $query->execute();
            }

            if($update_ok){
                $result['result'] = $update_ok;
                echo json_encode($result);
            }else{
                $result['result'] = $update_ok;
                echo json_encode($result);
            }
            $query = null;
            $this->db = null;

        }catch(PDOException $e){
            $result['result'] = false;
            $result['info'] = "Exception";
            echo json_encode($result);
        }
    }

    //Funcion que edita una tarea
    public function edit_task(){
        try{
            session_start();
            $result = array();

            $user_id            = ((isset($_SESSION['user']))?$_SESSION['user']:'');
            $task_id            = strip_tags(((isset($_GET['task_id']))?$_GET['task_id']:''));
            $task_name          = strip_tags(((isset($_POST['name']))?$_POST['name']:''));
            $task_state         = strip_tags(((isset($_POST['state']))?$_POST['state']:''));
            $task_description   = strip_tags(((isset($_POST['description']))?$_POST['description']:''));

            if($task_name != '' && $task_description != '' && $task_state != ''){
                $query = $this->db->prepare("UPDATE tasks SET task_name='".$task_name."', task_state='".$task_state."', task_description='".$task_description."' WHERE task_id=".$task_id." and user_id=".$user_id);
                $update_ok = $query->execute();
                if($update_ok){
                    $result['result'] = $update_ok;
                    $result['info'] = "Tarea editada correctamente.";
                    echo json_encode($result);
                }else{
                    $result['result'] = $update_ok;
                    $result['info'] = "Error editar la tarea.";
                    echo json_encode($result);
                }
                $query = null;
                $this->db = null;
            }else{
                $result['result'] = false;
                $result['info'] = "Error en el formato de los campos.";
                echo json_encode($result);
            }

        }catch(PDOException $e){
            $result['result'] = false;
            $result['info'] = "Exception";
            echo json_encode($result);
        }
    }

    //Funcion que elimina una tarea
    public function delete_task(){
        try{
            session_start();
            $result = array();

            $user_id = ((isset($_SESSION['user']))?$_SESSION['user']:'');
            $task_id = ((isset($_GET['task_id']))?$_GET['task_id']:'');

            $delete_ok = false;
            $query = $this->db->prepare("DELETE FROM tasks WHERE task_id=".$task_id." and user_id=".$user_id);
            $delete_ok = $query->execute();

            if($delete_ok){
                $result['result'] = $delete_ok;
                echo json_encode($result);
            }else{
                $result['result'] = $delete_ok;
                echo json_encode($result);
            }
            $query = null;
            $this->db = null;

        }catch(PDOException $e){
            $result['result'] = false;
            $result['info'] = "Exception";
            echo json_encode($result);
        }
    }

}

?>