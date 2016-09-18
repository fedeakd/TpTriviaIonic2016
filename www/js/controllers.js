angular.module('app.controllers', ['ngCordova'])
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
					template: 'Trivia completa'

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
	,'$ionicTabsDelegate','Informacion','$timeout','$cordovaVibration',
	function ($scope, $stateParams, $ionicPopup,$ionicTabsDelegate,Informacion,$timeout,$cordovaVibration) {
		$scope.divComenzar="show";
		$scope.divTrivia="none";
	//Parte firebase
	var firabaseJugadores=new Firebase('https://trivia-74b16.firebaseio.com/Jugadores');
	var firabasePreguntas=new Firebase('https://trivia-74b16.firebaseio.com/Preguntas');
	$scope.arrayPreguntas = [];
	$scope.arrayJugadores = [];
	firabaseJugadores.on('child_added', function (snapshot) {

		var message = snapshot.val();
	});

	firabasePreguntas.on('child_added', function (snapshot) {
		$timeout(function(){
			var message = snapshot.val();
			$scope.arrayPreguntas.push(message);
		});
	});
	var infoJugador={
		'numeroDeJugador':'',
		'nombre':Informacion.jugador,
		'preguntas':[],
		'respuesta':[]

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
					template: 'Respuesta correcta, vamos por la siguente!!'

				}); 
				respCorrecta++;	
			}else{
				$scope.Vibrar(false);
				$ionicPopup.alert({
					title: 'Lo siento',
					template: 'Respuesta incorrecta, vamos por la siguente!!'
				});  
			}
			
			infoJugador.preguntas.push($scope.pregunta);
			infoJugador.respuesta.push(num);

			//Si se alcanzo  todas las pregunta disponible
			if(cont<($scope.arrayPreguntas.length)-1){
				$scope.pregunta=$scope.arrayPreguntas[(++cont)];
			}
			else{
				$ionicTabsDelegate.select(2);
				firabaseJugadores.push(infoJugador);
				console.log(infoJugador);
				console.log("Cantidad de respuesta correcta es "+ respCorrecta);
				Informacion.respuestaCorrecta=respCorrecta;
				Informacion.cantidadDeResputaCorrecta=$scope.arrayPreguntas.length;
				Informacion.completo=true;
			}

		}

	}])

.controller('PrincipalCtrl', ['$scope','$state' ,'$stateParams','Informacion',

	function ($scope,$state, $stateParams,Informacion) {
		$scope.usuario={};
		$scope.usuario.nombre="";
		$scope.Iniciar=function(){
			console.log($scope.usuario.nombre)
			Informacion.jugador=$scope.usuario.nombre;
			$state.go("tabs.tab-Trivia");

		}
	}])

.controller('EstadisticaCtrl', ['$scope', '$stateParams','Informacion', 
	'$ionicPopup','$ionicTabsDelegate',
	function ($scope, $stateParams,Informacion,$ionicPopup,$ionicTabsDelegate) {


	}])





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