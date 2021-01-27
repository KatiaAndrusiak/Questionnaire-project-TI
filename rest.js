
var request;
var objJSON;
var id_mongo;
var login = "";


function getRequestObject()      {
   if ( window.ActiveXObject)  {
      return ( new ActiveXObject("Microsoft.XMLHTTP")) ;
   } else if (window.XMLHttpRequest)  {
      return (new XMLHttpRequest())  ;
   } else {
      return (null) ;
   }
}

function openTab(evt, tabName) {
  document.getElementById('result').innerHTML ="";
  document.getElementById('result1').innerHTML ="";
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

window.addEventListener("DOMContentLoaded", ()=> {    
    if(get_cookies() != "") {
        document.getElementById('Login').style.display = 'none';
        document.getElementById('login').style.display = 'none';
        document.getElementById('logout').style.display = 'inline';
    } 
});


function get_cookies() {
	var cookies = document.cookie.split(';')
	for (var i = 0; i < cookies.length; i++) {
	  var	tmp = cookies[i];
		while (tmp.charAt(0) == ' ') {
			tmp = tmp.substring(1, tmp.length);
		}
		if (tmp.indexOf("sessionID=") == 0) {
			return tmp.substring("sessionID=".length, tmp.length);
		}
	}
	return '';
}



function _register()  {
  document.getElementById('result').innerHTML ="";
  document.getElementById('result1').innerHTML ="";
if(validate_login()){
    var form = document.querySelector("[name='form2']");
    var user = {};
    user.login = form.login.value;
    user.haslo = form.haslo.value;
   
    txt = JSON.stringify(user);
    console.log(txt);
    document.getElementById('result').innerHTML = '';
    
    request = getRequestObject();
    request.open("POST", "http://pascal.fis.agh.edu.pl/~8andrusiak/Project2/rest/register", true);
    request.onreadystatechange = function() {
        if(request.readyState == 4 && request.status == 200) {
          
          objJSON = JSON.parse(request.response);
            if(objJSON['return'] == 'ok') {
              document.getElementById('result').innerHTML = "Udało się. Teraz możesz zalogować się!";
              console.log(request.responseText);
              } else {
                console.log(request.responseText);
                document.getElementById('result').innerHTML = "Nie udało się. Użytkownik z takim loginem już istnieje!";
              }
        }
    }
    request.send(txt);
       }
        else{
      document.getElementById('result').innerHTML ="Pola nie mogą być puste!!!";
    }
}

function _login()  {
  document.getElementById('result').innerHTML ="";
  document.getElementById('result1').innerHTML ="";
  if(validate_login()){
    var form = document.querySelector("[name='form2']");
    var user = {};
    user.login = form.login.value;
    user.haslo = form.haslo.value;
   
    txt = JSON.stringify(user);
    console.log(txt);
    document.getElementById('result').innerHTML = '';
    
    request = getRequestObject();
    request.open("POST", "http://pascal.fis.agh.edu.pl/~8andrusiak/Project2/rest/login", true);
    request.onreadystatechange = function() {
        if(request.readyState == 4 && request.status == 200) {
          objJSON = JSON.parse(request.response);
            if(objJSON['return'] == 'ok') {
              login = user.login;
              document.getElementById('data').innerHTML = ''; 
              document.getElementById('Login').style.display = 'none';
              document.getElementById('login').style.display = 'none';
              document.getElementById('logout').style.display = 'inline';
              form.login.value ="";
              form.haslo.value ="";
              document.getElementById('result').innerHTML ="";
              document.cookie = "sessionID=" + objJSON['session'] + "; path=/";
              indexedDB.deleteDatabase("questionnaire");
              document.getElementById('data').innerHTML = ''; 
              } 
            else {
                document.getElementById('result').innerHTML ="Nie udało się zalogować. Sprobuj ponownie!!!";
              }
        }
    }
    request.send(txt);
    }
    else{
      document.getElementById('result').innerHTML ="Pola nie mogą być puste!!!";
    }
}

function _logout()  {
  document.getElementById('result').innerHTML ="";
  document.getElementById('result1').innerHTML ="";
	req = getRequestObject();
	req.onreadystatechange = function () {
		if (req.readyState == 4 && req.status == 200) {
			objJSON = JSON.parse(req.response);
      console.log(req.responseText);
			if (objJSON['return'] == 'ok') {
      login ="";
       document.cookie ="sessionID=" + "" + "; path=/";
       document.getElementById('logout').style.display = 'none';
       document.getElementById('login').style.display = 'inline';
			}
		}
	}
	req.open("POST", "http://pascal.fis.agh.edu.pl/~8andrusiak/Project2/rest/logout", true);
	req.send(null);
}

function save_answers()  {
  document.getElementById('result').innerHTML ="";
  document.getElementById('result1').innerHTML ="";
  if( validate_questionnaire()){
    console.log("ok zapisz");
    var form = document.querySelector("[name='form1']");
    var cookiee=get_cookies();
    var answ = {};
    answ.id = login;
    answ.age = form.age.value;
    answ.q2 = form.travel.value;
    answ.q3= form.travel2.value;
    answ.q4= form.travel3.value;
    
    txt = JSON.stringify(answ);
    console.log(txt);
       
    document.getElementById('result1').innerHTML = '';
    if(navigator.onLine && cookiee!=''){
      request = getRequestObject();
      
      request.onreadystatechange = function() {
          if(request.readyState == 4 && request.status == 200) {
            document.getElementById('result1').innerHTML = request.responseText;
            objJSON = JSON.parse(request.response);
              if(objJSON['return'] == 'ok') {
                console.log(request.responseText);
                document.getElementById('result1').innerHTML = "Odpowiedzi zostały dodane";
                } else {
                  console.log(request.responseText);
                   document.getElementById('result1').innerHTML = " Twoje odpowiedzi już są zapisane!!!";
                }
          }
      }
      
      request.open("POST", "http://pascal.fis.agh.edu.pl/~8andrusiak/Project2/rest/answers", true);
      request.send(txt);
    }
    else{
             
      
      var conn = window.indexedDB.open("questionnaire", 4);
      
        conn.onupgradeneeded = function (event) {
            var db = event.target.result;
            var objectStore = db.createObjectStore('answer', {autoIncrement: true});
            console.log(objectStore);
            
            objectStore.createIndex("age", "age");
          	objectStore.createIndex("q2", "q2");
          	objectStore.createIndex("q3", "q3");
          	objectStore.createIndex("q4", "q4");
        };
        conn.onsuccess = function (event) {
            var db = event.target.result;
            var transaction = db.transaction('answer', 'readwrite');
            var objectStore = transaction.objectStore('answer');
            var objectRequest = objectStore.put(answ);
            objectRequest.onerror = function (event) {
                console.log("error");
                console.log(event);
         };
    
        objectRequest.onsuccess = function (event) {
            console.log("success");
        };
        
        document.getElementById('result1').innerHTML = " Dane zostały zapisane do lokalnej bazy"; 
    }
  }
    clear_questionnaire();
  }
  else{
   console.log("noooooo zapisz");
    document.getElementById('result1').innerHTML = "Musisz odpowiedzieć na wszystkie pytania!!!"; 
  }
       
}




function set_results() {
    var content = "<h3>Lokalna baza:</h3>";
    if (navigator.onLine && get_cookies() != '') {
        analyze_answers();
    } else {
    
      document.getElementById('onlineRes').style.display = 'none';
        var conn = window.indexedDB.open("questionnaire", 4);

        conn.onsuccess = function (event) {
            var db = event.target.result;
            var transaction = db.transaction('answer', 'readwrite');
            var objectStore = transaction.objectStore('answer');
           


                objectStore.openCursor().onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                      
                      var data = {};
                			data.age = cursor.value.age;
                      content += "Wiek:  <b>" + cursor.value.age + "</b>;  ";
                			data.q2 = cursor.value.q2;
                      content += "2.  <b>" + cursor.value.q2 + "</b>;  ";
                			data.q3 = cursor.value.q3;
                      content += "3.  <b>" + cursor.value.q3 + "</b>;  ";
                			data.q4 = cursor.value.q4;
                      content += "4.  <b>" + cursor.value.q4 + "</b><br><hr> ";
                      
                       cursor.continue();
                        console.log(`1 ${content}`);
                        document.getElementById('data').innerHTML = content;
                    } else {
                        console.log("No more entries!");
                    }
                };

            };
        }
         
    }


function analyze_answers()  {
  document.getElementById('data').innerHTML = ''; 
  document.getElementById('result').innerHTML ="";
  document.getElementById('result1').innerHTML =""; 
   request = getRequestObject() ;
   
   request.onreadystatechange = function() {
      if (request.readyState == 4)    {
         objJSON = JSON.parse(request.response);
          if(objJSON['return'] == 'ok') {
                console.log(objJSON['res']);
                document.getElementById('data').style.display = 'none';
                document.getElementById('onlineRes').style.display = 'inline';
                draw1(objJSON['res']);
                draw2(objJSON['res']);
                draw3(objJSON['res']);
                draw4(objJSON['res']);
                
                } else {
                  console.log(request.responseText);
                  
                }
         }
      }
   
   request.open("GET", "http://pascal.fis.agh.edu.pl/~8andrusiak/Project2/rest/getansw", true);
   request.send(null);

}






function validate_login(){
  var form = document.querySelector("[name='form2']");
  var formValid = false;
  if(form.login.value !="" && form.haslo.value !=""){
    formValid=true;
  }
  return formValid;
}

function radiosVal(radios) {    
    var formValid = false;
    var i = 0;
    while ((!formValid) && (i < radios.length)) {
        if (radios[i].checked) {   formValid = true; }
        i++;        
    }
    return formValid;
}

function validate_questionnaire(){
  var formValid = false;
  
  if(radiosVal(document.querySelectorAll("[name = 'travel']")) && radiosVal(document.querySelectorAll("[name = 'travel2']")) &&
  radiosVal(document.querySelectorAll("[name = 'travel3']")) && (document.querySelector("[name='age']").value != ""))
  {
    formValid=true;
  }
  
  return formValid;
}


function clear_questionnaire(){
  document.querySelector("[name='age']").value="";
   clear_radio(document.querySelectorAll("[name = 'travel']"));
   clear_radio(document.querySelectorAll("[name = 'travel2']"));
   clear_radio(document.querySelectorAll("[name = 'travel3']"));
 }
 
 
 function clear_radio(ele){
   for(var i=0;i<ele.length;i++){
      ele[i].checked = false;
      }
 }
 
 
  function draw1(data){
  
   var x = {};
   x.a1=0;
   x.a2=0;
   x.a3=0;
   x.a4=0;
   x.a5=0;
   for ( var id in data )  {
       for ( var prop in data[id] ) {             
           if ( prop === 'age'){
             var age = parseInt(data[id][prop])
             if(age <= 18){
                 x.a1++;
             }
             else if(age>18 && age <=30){
                 x.a2++;
             }
             else if(age>30 && age <=45){
                 x.a3++;
             }
              else if(age>45 && age <=65){
                 x.a4++;
             }
             else if(age > 65){
                 x.a5++;
             }
          }
        }
     }
     
             
   var options = {
          series: [x.a1, x.a2, x.a3, x.a4, x.a5],
          chart: {
          width: 380,
          type: 'donut',
        },
        title: {
          text: "1. Ile masz lat? ",
          align: 'left',
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize:  '14px',
            fontWeight:  'bold',
            fontFamily:  undefined,
            color:  '#263238'
          },
        },
        labels: [' -18', '19-30', '31-45', '46-65', '66+'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
        
        
        };

        var chart = new ApexCharts(document.querySelector("#chart1"), options);
        
        destroyChart = () => {
              if (chart.ohYeahThisChartHasBeenRendered) {
                  chart.destroy();
                  chart.ohYeahThisChartHasBeenRendered = false;
              }
          };
      document.getElementById('chart1').innerHTML = '';
      chart.render().then(() => chart.ohYeahThisChartHasBeenRendered = true);
        
      
      
 }

 
 function draw2(data){
   
   var x = {};
   x.a1=0;
   x.a2=0;
   x.a3=0;
   for ( var id in data )  {
       for ( var prop in data[id] ) {             
           if ( prop === 'q2'){
             
             if(data[id][prop]==='tak'){
                 x.a1++;
             }
             else if(data[id][prop]==='nie'){
                 x.a2++;
             }
             else if(data[id][prop]==='nie podróżuję'){
                 x.a3++;
             }
          }
        }
     }
     
             
   var options = {
          series: [x.a1, x.a2, x.a3],
          chart: {
          width: 380,
          type: 'pie',
        },
        title: {
          text: "2. Czy lubisz podróżować? ",
          align: 'left',
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize:  '14px',
            fontWeight:  'bold',
            fontFamily:  undefined,
            color:  '#263238'
          },
        },
        labels: ['Tak', 'Nie', 'Wcale nie podróżuję'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
        
        
        };

        var chart = new ApexCharts(document.querySelector("#chart2"), options);
        
        destroyChart = () => {
              if (chart.ohYeahThisChartHasBeenRendered) {
                  chart.destroy();
                  chart.ohYeahThisChartHasBeenRendered = false;
              }
          };
      document.getElementById('chart2').innerHTML = '';
      chart.render().then(() => chart.ohYeahThisChartHasBeenRendered = true);
      
 }


 function draw3(data){
   var x = {};
   x.a1=0;
   x.a2=0;
   x.a3=0;
   for ( var id in data )  {
       for ( var prop in data[id] ) {             
           if ( prop === 'q3'){
             
             if(data[id][prop]==='tak'){
                 x.a1++;
             }
             else if(data[id][prop]==='nie'){
                 x.a2++;
             }
             else if(data[id][prop]==='nie podróżuję'){
                 x.a3++;
             }
          }
        }
     }
     
             
   var options = {
          series: [x.a1, x.a2, x.a3],
          chart: {
          width: 380,
          type: 'pie',
        },
        title: {
          text: "3. Jak często podróżujesz? ",
          align: 'left',
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize:  '14px',
            fontWeight:  'bold',
            fontFamily:  undefined,
            color:  '#263238'
          },
        },
        labels: ['Często', 'Nie często', 'Wcale nie podróżuję'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
        
        
        };
        
        var chart = new ApexCharts(document.querySelector("#chart3"), options);
        destroyChart = () => {
              if (chart.ohYeahThisChartHasBeenRendered) {
                  chart.destroy();
                  chart.ohYeahThisChartHasBeenRendered = false;
              }
          };
      document.getElementById('chart3').innerHTML = '';
      chart.render().then(() => chart.ohYeahThisChartHasBeenRendered = true);
      
 }


function draw4(data){
   var x = {};
   x.a1=0;
   x.a2=0;
   x.a3=0;
   x.a4=0;
   for ( var id in data )  {
       for ( var prop in data[id] ) {             
           if ( prop === 'q4'){
             
             if(data[id][prop]==='region'){
                 x.a1++;
             }
             else if(data[id][prop]==='kraj'){
                 x.a2++;
             }
             else if(data[id][prop]==='zagranica'){
                 x.a3++;
             }
             else if(data[id][prop]==='nie podróżuję'){
                 x.a4++;
             }
          }
        }
     }
     
             
   var options = {
          series: [x.a1, x.a2, x.a3, x.a4],
          chart: {
          width: 380,
          type: 'pie',
        },
        title: {
          text: "4. Gdzie najbardziej lubisz wyjeżdżasz? ",
          align: 'left',
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize:  '14px',
            fontWeight:  'bold',
            fontFamily:  undefined,
            color:  '#263238'
          },
        },
        labels: ['W obrębie regionu', 'W obrębie kraju', 'Za granicę', 'Wcale nie podróżuję'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
        
        
        };

        var chart = new ApexCharts(document.querySelector("#chart4"), options);
        destroyChart = () => {
              if (chart.ohYeahThisChartHasBeenRendered) {
                  chart.destroy();
                  chart.ohYeahThisChartHasBeenRendered = false;
              }
          };
      document.getElementById('chart4').innerHTML = '';
      chart.render().then(() => chart.ohYeahThisChartHasBeenRendered = true);
      
 }





    
    

