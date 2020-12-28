<?php

include '../utils.php';

$user = new User();
switch($_GET['function']){
    case 'login':
        $user->login();
        break;
    case 'logout':
        $user->logout();
        break;
    case 'sign-up':
        $user->sign_up();
        break;
    case 'user-exists':
        $user->user_exists();
        break;
    case 'get-user':
        $user->get_user();
        break;
    case 'get-username':
        $user->get_username();
        break;
    case 'update-user':
        $user->update_user();
        break;
    case 'update-user-password':
        $user->update_user_password();
        break;   
}

class User{

    private $db;
    
    function  __construct(){
        include '../../database/conecction_db.php';
        $db = new db();
        $this->db = $db->connectDB();
    }

    //Funcion que inicia sesion si el usuario existe
    public function login(){
        try{
            $result = array();

            $email      = ((isset($_POST['email']))?$_POST['email']:'');
            $password   = hash("sha512", ((isset($_POST['password']))?$_POST['password']:''));

            if(re_email($email)){
                $query = $this->db->prepare("SELECT user_id FROM users WHERE email = '".$email."' AND password = '".$password."' LIMIT 1");
                $query->execute();
                
                if($query->rowCount() == 1){
                    session_start();
                    $result_query = $query->fetchAll();
                    $_SESSION['user'] = $result_query[0]['user_id'];
                    $result['result'] = true;
                    echo json_encode($result);
                }else{
                    $result['result'] = false;
                    echo json_encode($result);
                }
                $query = null;
                $this->db = null;
            }else{
                $result['result'] = false;
                echo json_encode($result);
            }

            
        }catch(PDOException $e){
            $result['result'] = false;
            $result['info'] = "Exception";
            echo json_encode($result);
        }
    }

    //Funcion que registra un usuario en la base de datos
    public function sign_up(){
        try{
            $result = array();

            //Recogemos los parametros POST de la peticion (Utilizamos la funcion strip_tags para evitar ataques XSS)
            $username       = strip_tags(((isset($_POST['username']))?$_POST['username']:''));
            $email          = strip_tags(((isset($_POST['email']))?$_POST['email']:''));
            $description    = strip_tags(((isset($_POST['description']))?$_POST['description']:''));
            $address        = strip_tags(((isset($_POST['address']))?$_POST['address']:''));
            $cp             = strip_tags(((isset($_POST['cp']))?$_POST['cp']:''));
            $password       = ((isset($_POST['password']))?$_POST['password']:'');
            $rpassword      = ((isset($_POST['rpassword']))?$_POST['rpassword']:'');

            //Validamos que los campos recogidos del formulario tienen el formato correcto
            if(re_only_letters($username) && re_email($email) && re_cp($cp) && re_password_secure($password) && $password==$rpassword && $address != '' && $description != ''){
                //Comprobamos que el usuario no exista
                $query = $this->db->prepare("SELECT user_id FROM users WHERE email = '".$email."'");
                $query->execute();
                if($query->rowCount() == 0){
                    //Encriptamos contraseña
                    $password_hashed = hash("sha512", $password);

                    //Ejecutamos el insert
                    $query = $this->db->prepare('INSERT INTO users (user_id, username, email, description, address, cp, password) VALUES (?,?,?,?,?,?,?)');
                    $insert_ok = $query->execute(['null', $username, $email, $description, $address, $cp, $password_hashed]);
                    if($insert_ok){
                        $query = $this->db->prepare("SELECT user_id FROM users WHERE email = '".$email."' LIMIT 1");
                        $query->execute();
                        if($query->rowCount() == 1){
                            session_start();
                            $result_query = $query->fetchAll();
                            $_SESSION['user'] = $result_query[0]['user_id'];
                        }
                        //$_SESSION['user'] = $result_query[0]['user_id'];
                        $result['result'] = $insert_ok;
                        $result['info'] = "Usuario registrado con exito.";
                        echo json_encode($result);
                    }else{
                        $result['result'] = $insert_ok;
                        $result['info'] = "Ocurrio un error al registrar el usuario.";
                        echo json_encode($result);
                    }
                }else{
                    $result['result'] = false;
                    $result['info'] = "El usuario ya existe";
                    echo json_encode($result);
                }
                $query = null;
                $this->db = null;
            }else{
                $result['result'] = false;
                $result['info'] = "Error en el formato de los campos";
                echo json_encode($result);
            }

            
        }catch(PDOException $e){
            $result['result'] = false;
            $result['info'] = "Exception";
            echo json_encode($result);
        }
        
    }

    //Funcion que comprueba si un usuario existe en la base datos
    public function user_exists(){
        try{
            $result = array();

            $email = ((isset($_GET['email']))?$_GET['email']:'');

            $query = $this->db->prepare("SELECT * FROM users WHERE email = '".$email."'");
            $query->execute();
            
            if($query->rowCount() == 0){
                $result['result'] = false;
                echo json_encode($result);
            }else{
                $result['result'] = true;
                $result['info'] = "El usuario introducido ya existe.";
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

    //Funcion que devuelve el usuario de sesion
    public function get_user(){
        try{
            session_start();
            $result = array();

            $user_id = ((isset($_SESSION['user']))?$_SESSION['user']:'');

            $query = $this->db->prepare("SELECT username, email, description, address, cp FROM users WHERE user_id = ".$user_id." LIMIT 1");
            $query->execute();

            if($query->rowCount()>0){
                $result = $query->fetchALL(PDO::FETCH_OBJ);
                $result['result'] = true;
                echo json_encode($result);
            }else{
                $result['result'] = false;
                $result['info'] = "Usuario no registrado";
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

    //Funcion que devuelve el nombre de usuario de sesion (Para la barra de navegacion)
    public function get_username(){
        try{
            session_start();
            $result = array();

            $user_id = ((isset($_SESSION['user']))?$_SESSION['user']:'');

            $query = $this->db->prepare("SELECT username FROM users WHERE user_id = ".$user_id." LIMIT 1");
            $query->execute();

            if($query->rowCount()>0){
                $result = $query->fetchALL(PDO::FETCH_OBJ);
                $result['result'] = true;
                echo json_encode($result);
            }else{
                $result['result'] = false;
                $result['info'] = "Usuario no registrado";
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

    //Funcion que actualiza el usuario de sesion
    public function update_user(){
        try{
            session_start();
            $result = array();

            $user_id        = ((isset($_SESSION['user']))?$_SESSION['user']:'');
            $username       = strip_tags(((isset($_POST['username']))?$_POST['username']:''));
            $description    = strip_tags(((isset($_POST['description']))?$_POST['description']:''));
            $address        = strip_tags(((isset($_POST['address']))?$_POST['address']:''));
            $cp             = strip_tags(((isset($_POST['cp']))?$_POST['cp']:''));

            if(re_only_letters($username) && re_cp($cp) && $description != '' && $address != ''){
                $query = $this->db->prepare("UPDATE users SET username='".$username ."', description='".$description ."', address='".$address ."', cp='".$cp ."' WHERE user_id = ".$user_id);
                $update_ok = $query->execute();
    
                if($update_ok){
                    $result['result'] = $update_ok;
                    $result['info'] = "Datos guardados correctamente.";
                    echo json_encode($result);
                }else{
                    $result['result'] = $update_ok;
                    $result['info'] = "Error al actualizar los datos.";
                    echo json_encode($result);
                }
                $query = null;
                $this->db = null;
            }else{
                $result['result'] = false;
                $result['info']   = "Error en el formato de los campos.";
                echo json_encode($result);
            }
            

        }catch(PDOException $e){
            $result['result'] = false;
            $result['info'] = "Exception";
            echo json_encode($result);
        }
    }

    //Funcion que actualiza la contraseña del usuario
    public function update_user_password(){
        try{
            session_start();
            $result = array();

            $user_id        = ((isset($_SESSION['user']))?$_SESSION['user']:'');
            $oldpassword    = ((isset($_POST['oldpassword']))?$_POST['oldpassword']:'');
            $newpassword    = ((isset($_POST['newpassword']))?$_POST['newpassword']:'');
            $newrpassword   = ((isset($_POST['newrpassword']))?$_POST['newrpassword']:'');

            $oldpassword_hashed = hash("sha512", $oldpassword);
            $newpassword_hashed = hash("sha512", $newpassword);  

            if($newpassword == $newrpassword && re_password_secure($newpassword)){
                $query = $this->db->prepare("SELECT user_id FROM users WHERE user_id = '".$user_id."' AND password = '".$oldpassword_hashed."' LIMIT 1");
                $query->execute();
                
                if($query->rowCount() == 1){
                    $query = $this->db->prepare("UPDATE users SET password='".$newpassword_hashed."' WHERE user_id = ".$user_id." and password = '".$oldpassword_hashed."'");
                    $update_ok = $query->execute();
        
                    if($update_ok){
                        $result['result'] = $update_ok;
                        $result['info']   = "Contraseña cambiada correctamente.";
                        echo json_encode($result);
                    }else{
                        $result['result'] = $update_ok;
                        $result['info']   = "Error al actualizar la contraseña.";
                        echo json_encode($result);
                    }
                }else{
                    $result['result'] = false;
                    $result['info']   = "Contraseña incorrecta.";
                    echo json_encode($result);
                }
                $query = null;
                $this->db = null;
            }else{
                $result['result'] = false;
                $result['info']   = "Error en el formato de los campos.";
                echo json_encode($result);
            }
            

        }catch(PDOException $e){
            $result['result'] = false;
            $result['info'] = "Exception";
            echo json_encode($result);
        }
    }

    //Funcion que cierra la sesion del usuario
    public function logout(){
        try{
            session_start();
            session_destroy();
            unset($_SESSION['user']);
            $result = array();
            $result['result'] = true;
            echo json_encode($result);
        }catch(PDOException $e){
            $result['result'] = false;
            $result['info'] = "Exception";
            echo json_encode($result);
        }
    }

}

?>