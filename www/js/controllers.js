angular.module('app.controllers', ['ngCordova','firebase'])
.controller('GeneralCtrl', ['$scope', '$stateParams','Informacion','$ionicPopup', 
	'$ionicTabsDelegate',
	function ($scope, $stateParams,Informacion,$ionicPopup,$ionicTabsDelegate) {
		$scope.ComprobarEstadistica=function(){
			$scope.Informacion=Informacion;
			if($scope.Informacion.completo===false){

				$ionicPopup.alert({
					title: 'Lo siento',
					template: 'Debes completar la encuesta!!'

				});  
				$ionicTabsDelegate.select(1);
				return;
			}

		}

		$scope.ComprobarTrivia=function(){
			$scope.Informacion=Informacion;
			if($scope.Informacion.completo===true){

				$ionicPopup.alert({
					title: 'Lo siento',
					template: 'Trivia completa, reinicie la aplicacion'

				});  
				$ionicTabsDelegate.select(2);
				return;
			}

		}

	}])

.controller('PresentacionCtrl', ['$scope', '$stateParams', 
	function ($scope, $stateParams) {


	}])

.controller('TriviaCtrl', ['$scope', '$stateParams','$ionicPopup'
	,'$ionicTabsDelegate','Informacion','$timeout','$cordovaVibration','$cordovaFile','$ionicPlatform',
	function ($scope, $stateParams, $ionicPopup,$ionicTabsDelegate,Informacion,$timeout,$cordovaVibration,$cordovaFile,$ionicPlatform) {
		$scope.divComenzar="show";
		$scope.divTrivia="none";
		var cont=0;
		var ban=false;
		$scope.hayConexion;//parte firebase

		var firabaseJugadores=new Firebase('https://trivia-74b16.firebaseio.com/Jugadores');
		var firabasePreguntas=new Firebase('https://trivia-74b16.firebaseio.com/Preguntas');
		new Firebase('https://trivia-74b16.firebaseio.com/').child(".info/connected").on('value', function(connectedSnap) {
			$scope.hayConexion=connectedSnap.val();
			console.log(connectedSnap.val());

		});
		$scope.arrayPreguntas = [];
		$scope.arrayJugadores = [];


		firabaseJugadores.on('child_added', function (snapshot) {

			var message = snapshot.val();
		});

		firabasePreguntas.on('child_added', function (snapshot) {
			$timeout(function(){
				if(ban){//si no hay conexion no entra  ver metodo empezar 
					return;
				}
				var message = snapshot.val();
				$scope.arrayPreguntas.push(message);

			});
		});
		var infoJugador={
			'numeroDeJugador':'',
			'nombre':Informacion.jugador,
			'preguntas':[],
			'respuesta':[],
			'estado':'none'

		}
		var cont=0 ;
		var respCorrecta=0;
		$scope.Vibrar=function(resp){
			try{
				if(resp){
					navigator.vibrate([1000,500,1000,500,1000]);
				}
				else{
					navigator.vibrate([1000,500,1000]);
				}
			}catch(e){

				console.log("hola mundo");
			}
		}

		$scope.Comenzar=function(){
			$scope.divComenzar="none";
			$scope.divTrivia="show";
			if(!$scope.hayConexion){
				ban=true;
				$scope.arrayPreguntas=[{
					"pregunta":"¿Cuantos balones de oro tiene Messi?",
					"respuestas":[3,4,7],
					"repuestaCorrecta":1}
					,
					{"pregunta":"¿Quien invento la electricidad?",
					"respuestas":['Edison','Tesla','Obama'],
					"repuestaCorrecta":1}
					,
					{"pregunta":"¿Quien es el primer grande?",
					"respuestas":['Racing','Boca','Bojo'],
					"repuestaCorrecta":0}]
				}
				$scope.pregunta=$scope.arrayPreguntas[0];

			}

			$scope.corregir=function(num){
				console.log($scope.arrayPreguntas)
				if($scope.Informacion.completo===true){

					$ionicPopup.alert({
						title: 'Lo siento',
						template: 'Ya has compleado la trivia'

					});  
					$ionicTabsDelegate.select(2);
				}
			//Validar respueesta
			if(num===$scope.pregunta.repuestaCorrecta){
				$scope.Vibrar(true);
				$ionicPopup.alert({
					title: 'Respuesta:',
					template: 'Respuesta correcta'

				}); 
				respCorrecta++;	
			}else{
				$scope.Vibrar(false);
				$ionicPopup.alert({
					title: 'Lo siento',
					template: 'Respuesta incorrecta'
				});  
			}
			
			infoJugador.preguntas.push($scope.pregunta);
			infoJugador.respuesta.push(num);

			//Si se alcanzo  todas las pregunta disponible
			if(cont<($scope.arrayPreguntas.length)-1){
				$scope.pregunta=$scope.arrayPreguntas[(++cont)];
			}
			else{
				Informacion.completo=true;
				$ionicTabsDelegate.select(2);
				
				console.log(infoJugador);
				console.log("Cantidad de respuesta correcta es "+ respCorrecta);
				Informacion.respuestaCorrecta=respCorrecta;
				Informacion.cantidadDeResputaCorrecta=$scope.arrayPreguntas.length;
			
				if($scope.hayConexion){
					firabaseJugadores.push(infoJugador);
				}
				else{
					try{
						$ionicPlatform.ready(  function() {
							$cordovaFile.readAsText(cordova.file.externalRootDirectory, "Jugadores.txt")
							.then(function(success) {
								var jugadores=JSON.parse(success);
								jugadores.push(infoJugador);
								try{
									$ionicPlatform.ready(function() {
										$cordovaFile.writeFile(cordova.file.externalRootDirectory, "Jugadores.txt", JSON.stringify(jugadores), true)
										.then(function (success) {

										}, function (error) {
										});

									});
								}
								catch(e){
								}

							}, function(error){
								alert('didn\'t find the file: ' + error.code);
							})
						});

					}
					catch(e){
						alert("algo salio mal");
					}

				}

			}
		}

	}])

.controller('PrincipalCtrl', ['$scope','$state' ,'$stateParams','Informacion','$ionicPlatform','$cordovaFile','$ionicPopup',

	function ($scope,$state, $stateParams,Informacion,$ionicPlatform,$cordovaFile,$ionicPopup) {
		try{
			$ionicPlatform.ready(  function() {
				$cordovaFile.checkFile(cordova.file.externalRootDirectory, "Jugadores.txt")
				.then(function (success) {
					$scope.devuelve=success;
				}, function (error) {
					$ionicPlatform.ready(function() {
						$cordovaFile.writeFile(cordova.file.externalRootDirectory, "Jugadores.txt",'[]', true)
						.then(function (success) {
							$ionicPopup.alert({
								title: 'Informacion',
								template: 'Se a creado un archivo'

							});
						}, function (error) {
						});

					});
				});
			});
		}
		catch(e){
			alert("Algo salio mal");
		}
		$scope.usuario={};
		$scope.usuario.nombre="";
		$scope.Iniciar=function(){
			console.log($scope.usuario.nombre)
			Informacion.jugador=$scope.usuario.nombre;
			$state.go("tabs.tab-Trivia");

		}
	}])

.controller('EstadisticaCtrl', ['$scope', '$stateParams','Informacion', 
	'$ionicPopup','$ionicTabsDelegate','$cordovaFile',
	function ($scope, $stateParams,Informacion,$ionicPopup,$ionicTabsDelegate,$cordovaFile,$ionicPopup) {


	}])
.controller('UsuariosCtrl',
	function ($scope, $stateParams,Informacion,$ionicPopup,$ionicTabsDelegate,$cordovaFile,$firebaseArray,$ionicPlatform,$ionicPopup) {
		$scope.prueba="hola";
		$scope.arrayJson=[];
		$scope.arrayJson.push({nombre:"fefe",apellido:"santamaria" ,estado:'none'});
		$scope.arrayJson.push({nombre:"fefe",apellido:"santamaria" ,estado:'none'});
		$scope.arrayJson.push({nombre:"fefe",apellido:"santamaria" ,estado:'none'});
		var firebaseJugadores=new Firebase('https://trivia-74b16.firebaseio.com/Jugadores');

		
		new Firebase('https://trivia-74b16.firebaseio.com/').child(".info/connected").on('value', function(connectedSnap) {
			console.log(connectedSnap.val());
			if(connectedSnap.val()){ 
				$scope.jugadores = $firebaseArray(firebaseJugadores);
			}
			else{
				try{
					$ionicPlatform.ready(  function() {
						$cordovaFile.readAsText(cordova.file.externalRootDirectory, "Jugadores.txt")
						.then(function(success) {
							$scope.jugadores=JSON.parse(success);
								$ionicPopup.alert({
								title: 'Informacion',
								template: 'No tienes conexion a internet,Muestro el archivo interno '

							});
						}, function(error){
							alert('didn\'t find the file: ' + error.code);
						})
					});
				}
				catch(e){
					console.log("No es un celular");
				}

			}
		});

		$scope.Mostrar=function(num ){

			if($scope.jugadores[num].estado==="none"){
				$scope.jugadores[num].estado="show";
			}
			else{
				$scope.jugadores[num].estado="none";
			}
		}
		$scope.prueba=function(){
			console.log($scope.jugadores)
		}

	})




/*	$scope.preguntas=[{
		"pregunta":"¿Cuantos balones de oro tiene Messi?",
		"respuestas":[3,4,7],
		"repuestaCorrecta":1}
		,
		{"pregunta":"¿Quien invento la electricidad?",
		"respuestas":['Edison','Tesla','Obama'],
		"repuestaCorrecta":1}
		,
		{"pregunta":"¿Quien es el primer grande?",
		"respuestas":['Racing','Boca','Bojo'],
		"repuestaCorrecta":0}
		,
		{"pregunta":"",
		"respuestas":['Racing','Boca','Bojo'],
		"repuestaCorrecta":0}
		];*/