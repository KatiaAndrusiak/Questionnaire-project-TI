<?php

//require 'vendor/autoload.php' ;

class db {
    private $user = "8andrusiak" ;
    private $pass = "pass8andrusiak";
    private $host = "172.20.44.25";
    private $base = "8andrusiak";
    private $coll = "uzytkownik";
    private $coll_ankieta = "ankieta";
    private $conn;
    private $dbase;
    private $collection;
    private $collection_s;
    private $collection_a;



    function __construct() {
      //$this->conn = new Mongo("mongodb://{$this->user}:{$this->pass}@{$this->host}/{$this->base}");
      $this->conn = new MongoDB\Client("mongodb://{$this->user}:{$this->pass}@{$this->host}/{$this->base}");    
      //$this->dbase = $this->conn->selectDB($this->base);
      //$this->collection = $this->dbase->selectCollection($this->coll);
      $this->collection = $this->conn->{$this->base}->{$this->coll};
      $this->collection_a = $this->conn->{$this->base}->{$this->coll_ankieta};
       session_start();
    }
    

    
    
     function reg_insert( $user) {
     $criteria = array(
        'login' => $user['login']);
      $doc = $this->collection->findOne($criteria);
      if (!empty($doc)) {
         return false;
      } 
      else {
       $ret = $this->collection->insertOne($user);
        return $ret;
      }
    }


    function login( $user) {
      $criteria = array(
         'login' => $user['login'], 'haslo'  => $user['haslo']);
       $doc = $this->collection->findOne($criteria);
       if (empty($doc)) {
          return false;
       } 
       else{
          $session_id = md5(uniqid($user['login'], true));
    			$_SESSION['id'] = $session_id;
         return $_SESSION['id'];
       }
      }
      
      

      function logout() {
        if(isset($_SESSION)){
          unset($_SESSION);
           session_destroy();
           return true;
        }
        return false;
        
      }
      
      
      
    function answer_insert( $answ ) {
     $criteria = array(
        'id' => $answ['id']);
      $doc = $this->collection_a->findOne($criteria);
      if (!empty($doc)) {
         return false;
      } 
      else {
       $ret = $this->collection_a->insertOne($answ);
        return $ret;
      }
    }
    
    
    function answer_get(){
      $cursor = $this->collection_a->find();
      $table = iterator_to_array($cursor);
      return $table ;
    }

}