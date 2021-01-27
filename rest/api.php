<?php
    	
require '../vendor/autoload.php' ;        
require_once("rest.php");
require_once("mongo.php");
	
class API extends REST {
	
	public $data = "";
	
	public function __construct(){
		parent::__construct();		// Init parent contructor
              $this->db = new db() ;             // Initiate Database
	}
			
	public function processApi(){

		$func = "_".$this->_endpoint ; 
		if((int)method_exists($this,$func) > 0) {
		    $this->$func();
              }  else {
		    $this->response('Page not found',404); }			
	}
		
		
	

 
 private function _register(){	
		if($this->get_request_method() != "POST"){
			$this->response('',406);
		}
    if(!empty($this->_request) ){
  			try { 
               $json_array = json_decode($this->_request,true);
               $res = $this->db->reg_insert( $json_array);
                     if ( $res ) {
                				   $result = array('return'=>'ok', 'res'=> $res);
                				   $this->response($this->json($result), 200);
                       } else {
                          $result = array('return'=>'not added');
                          $this->response($this->json($result), 200);
                       }
  			} catch (Exception $e) {
  				$this->response('', 400) ;
  			}
		} else {
		  	$error = array('status' => "Failed", "msg" => "Invalid send data");
			  $this->response($this->json($error), 400);
		}
    $this->response($this->json($error), 400);
    }


  private function _answers(){	
		if($this->get_request_method() != "POST"){
			$this->response('',406);
		}
    if(!empty($this->_request) ){
  			try { 
               $json_array = json_decode($this->_request,true);
               $res = $this->db->answer_insert( $json_array);
                     if ( $res ) {
                				   $result = array('return'=>'ok', 'res'=> $res);
                				   $this->response($this->json($result), 200);
                       } else {
                          $result = array('return'=>'not added');
                          $this->response($this->json($result), 200);
                       }
  			} catch (Exception $e) {
  				$this->response('', 400) ;
  			}
		} else {
		  	$error = array('status' => "Failed", "msg" => "Invalid send data");
			  $this->response($this->json($error), 400);
		}
    $this->response($this->json($error), 400);
    }




		private function _login(){	
		if($this->get_request_method() != "POST"){
			$this->response('',406);
		}
		if(!empty($this->_request) ){
			try { 
			 $json_array = json_decode($this->_request,true);
			 $res = $this->db->login($json_array) ; 
				if ( $res != false ) {
					$result = array('return'=>'ok', 'session' => $res);
					$this->response($this->json($result), 200);
				} else {
					$result = array('return'=>'not found');
					$this->response($this->json($result), 200);
				}   
			}catch (Exception $e) {
				$this->response('', 400) ;
			} 
		} else {
			$error = array('status' => "Failed", "msg" => "Invalid send data");
			$this->response($this->json($error), 400);
		}
		       
		$this->response($this->json($result), 200); 
	       $this->response('',204);	// If no records "No Content" status
	}
 
 
 	private function _logout(){	
		if($this->get_request_method() != "POST"){
			$this->response('',406);
		}
		
	 $res = $this->db->logout(); 
		if ( $res ) {
			$result = array('return'=>'ok');
			$this->response($this->json($result), 200);
		} else {
			$result = array('return'=>'not logout');
			$this->response($this->json($result), 200);
		}   
			    
		$this->response($this->json($result), 200); 
	       $this->response('',204);	// If no records "No Content" status
	}


	private function _getansw(){	
		if($this->get_request_method() != "GET"){
			$this->response('',406);
		}
		
	 $res = $this->db->answer_get(); 
		if ( $res ) {
			$result = array('return'=>'ok', 'res' => $res);
			$this->response($this->json($result), 200);
		} else {
			$result = array('return'=>'not found');
			$this->response($this->json($result), 200);
		}   
			    
		$this->response($this->json($result), 200); 
	       $this->response('',204);	// If no records "No Content" status
	}
 
 

	private function json($data){
		if(is_array($data)){
			return json_encode($data);
		}
	}
}
		
	$api = new API;
	$api->processApi();

?>