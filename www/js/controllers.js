angular.module('app.controllers', [])

.controller('PresentacionCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('TriviaCtrl', ['$scope', '$stateParams','$ionicPopup'
,'$ionicTabsDelegate','Informacion', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicPopup,$ionicTabsDelegate,Informacion) {
	console.log(Informacion);
	var cont=0 ;
	var respCorrecta=0;
	$scope.preguntas=[{
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
		];
		$scope.pregunta=$scope.preguntas[0];
		console.log($scope.pregunta.prengunta);
		$scope.corregir=function(num){
			//Validar respueesta
			if(num===$scope.pregunta.repuestaCorrecta){
				$ionicPopup.alert({
					title: 'Respuesta:',
					template: 'Respuesta correcta, vamos por la siguente!!'

				}); 
				respCorrecta++;	
			}else{
				$ionicPopup.alert({
					title: 'Lo siento',
					template: 'Respuesta incorrecta, vamos por la siguente!!'

				});  

			}

			//Si se alcanzo  todas las pregunta disponible
			if(cont<($scope.preguntas.length)-1){
				$scope.pregunta=$scope.preguntas[(++cont)];
			}
			else{
				$ionicTabsDelegate.select(2);
				console.log("Cantidad de respuesta correcta es "+ respCorrecta);
				Informacion.respuestaCorrecta=respCorrecta;
				Informacion.cantidadDeResputaCorrecta=$scope.preguntas.length;
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
	'$ionicPopup','$ionicTabsDelegate',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,Informacion,$ionicPopup,$ionicTabsDelegate) {
	$scope.Informacion=Informacion;
	if($scope.Informacion.completo===false){

		$ionicPopup.alert({
			title: 'Lo siento',
			template: 'Debes completar la encuesta!!'

		});  
		$ionicTabsDelegate.select(1);
	}

}])
