'use strict';

angular.module('automationApp.scriptor')
	.controller('NewScriptController', ['$rootScope', '$scope', 'pluginsService', 'applicationService', '$location', '$state', 'scriptorService', '$interval',
		function($rootScope, $scope, pluginsService, applicationService, $location, $state, scriptorService, $interval) {
	
			$scope.scriptor = scriptorService.uiElements;
			$scope.triggers =	scriptorService.getTriggers();

            scriptorService.getGlobalContext().then(function(res) {
                $rootScope.keyboardActions = res.data.keyboardActions;
                $scope.applications =  res.data.applications;
                $scope.scenarios =  res.data.scenarios;
                $scope.methodtypelist =	res.data.methodtype;

                $scope.scenarioType = $scope.scenarios[0];
                $scope.applicationName = $scope.applications[0];

                if($scope.scriptor.taskId){
                    $scope.taskId = $scope.scriptor.taskId;
                    $scope.scenarioType = $scope.scriptor.scenarioType;
                    $scope.applicationName = $scope.scriptor.applicationName;
                }
            });

            scriptorService.getTaskJson().then(function(res) {
                $scope.taskJson =  res.data;
            });

            /* Template Code to be kept in first route to be loaded */
			$scope.$on('$viewContentLoaded', function () {
				pluginsService.init();
				applicationService.customScroll();
				applicationService.handlePanelAction();
				$('.nav.nav-sidebar .nav-active').removeClass('nav-active active');
				$('.nav.nav-sidebar .active:not(.nav-parent)').closest('.nav-parent').addClass('nav-active active');

				if($location.$$path == '/'){
					$('.nav.nav-sidebar .nav-parent').removeClass('nav-active active');
					$('.nav.nav-sidebar .nav-parent .children').removeClass('nav-active active');
					if ($('body').hasClass('sidebar-collapsed') && !$('body').hasClass('sidebar-hover')) return;
					if ($('body').hasClass('submenu-hover')) return;
					$('.nav.nav-sidebar .nav-parent .children').slideUp(200);
					$('.nav-sidebar .arrow').removeClass('active');
					$('body').addClass('dashboard');
				} else {
					$('body').removeClass('dashboard');
				}

			});

			// todo: move to appropriate file
			function validateTaskId(input){
				var regex = /[^a-z0-9.]/i; // not a valid task id string - contains other characters from a-z0-9.

				if (regex.test(input)) {
					return false;
				} else {
					return true;
				}
			}

			// todo: move to appropriate file && abstract showNotify
			$scope.updateData = function(){

				function showNotify(customText){
					noty({
						text        : customText,
						layout      : 'topRight',
						theme       : 'made',
						maxVisible  : 1,
						animation   : {
							open  : 'animated fadeInRight',
							close : 'animated fadeOut'
						},
						timeout: 3000
					});
				}

				if ($scope.taskId == undefined || $scope.taskId.length === 0) {
					showNotify('<div class="alert alert-danger m-r-30"><p><strong>' + 'Task Id cannot be blank !' + '</p></div>');
					return false;
				}
				else if (validateTaskId($scope.taskId)){
					$scope.scriptor.scenarioType = $scope.scenarioType;
					$scope.scriptor.applicationName = $scope.applicationName;
					$scope.scriptor.taskId = $scope.taskId;
					showNotify('<div class="alert alert-success m-r-30"><p><strong>' + 'Task data updated successfully !' + '</p></div>');
					return true;
				} else{
					showNotify('<div class="alert alert-danger m-r-30"><p><strong>' + 'Invalid Task Id !' + '</p></div>');
					return false;
				}
			};

			$scope.displayScript = function(){
				var dataUpdated = $scope.updateData();
				if(dataUpdated){
					$state.go('displayscript');
				}
			};

		}]);
