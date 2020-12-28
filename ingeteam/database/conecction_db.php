<?php

class db{
    private $host = 'localhost';
    private $dbname = 'ingeteam';
    private $user = 'root';
    private $password = '';

    public function connectDB(){
        try {
            $dsn = 'mysql:host='.$this->host.';dbname='.$this->dbname;
            $db = new PDO($dsn, $this->user, $this->password);
            return $db;
        } catch (PDOException $e) {
            //print "¡Error!: " . $e->getMessage() . "<br/>";
            die();
        }
    }
}


?>