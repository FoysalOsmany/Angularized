TPAngular.controller(
    "demofieldselectionController",
    function demofieldselectionController($rootScope, $scope, $http, $location, AlertService, filereaderService, senddemosService, demofilevalidationService, demoFileTranslationService) {
        $scope.isChecked = false;
        var removeData = null;
        $scope.isValid = true;
        senddemosService.setSenddemoFileRequest(null);
        
        $scope.$on(filereaderService.KeyHandleFileReaderBroadcast, function () {
           
            $scope.file = filereaderService.file;
            $scope.tableData = filereaderService.tableData;
            $scope.selectedEmailIndex = filereaderService.selectedEmailIndex;
            $scope.selectedNameIndex = filereaderService.selectedNameIndex;
            $scope.selectedReferenceIndex = filereaderService.selectedReferenceIndex;
            $scope.emailDropdown = filereaderService.emailDropdown;
            $scope.nameDropdown = filereaderService.nameDropdown;
            $scope.refDropdown = filereaderService.refDropdown;
            $scope.delimeter = filereaderService.delimeter;
            $scope.delimeterDropdown = [{ key: ';', value: 'semicolon [;]' }, { key: ',', value: 'comma [,]' }];

            setTimeout(function () {
                $scope.$apply(function () {
                    $scope.tableData = filereaderService.tableData;
                    $scope.emailDropdown = filereaderService.emailDropdown;
                    $scope.nameDropdown = filereaderService.nameDropdown;
                    $scope.refDropdown = filereaderService.refDropdown;
                    $scope.selectedEmailIndex = filereaderService.selectedEmailIndex;
                    $scope.selectedNameIndex = filereaderService.selectedNameIndex;
                    $scope.selectedReferenceIndex = filereaderService.selectedReferenceIndex;

                    _.delay(function() {
                        $(document).foundation();
                        $($($("select")[1]).next().find('a')[0]).text($scope.emailDropdown[$scope.selectedEmailIndex + 1].value);
                        $($($("select")[2]).next().find('a')[0]).text($scope.nameDropdown[$scope.selectedNameIndex + 1].value);
                        $($($("select")[3]).next().find('a')[0]).text($scope.refDropdown[$scope.selectedReferenceIndex + 1].value);
                        
                        if ($scope.tableData.length > 1)
                            $('input[type=checkbox]').css('display', 'inline');
                        else
                            $('input[type=checkbox]').css('display', 'none');

                    }, 10);
                });
            }, 0);
          

        });

        filereaderService.getData();

        $scope.moveToNextPageInFileUploadMode = function () {
            
            $scope.isValid = false;
            if ($scope.selectedEmailIndex >= 0 && $scope.selectedNameIndex >= 0 && $scope.selectedReferenceIndex >= 0) {
                $scope.isValid = true;
            }
            if (!$scope.isValid) {
                return;
            }

            var userMappingModel = {
                fileId: $rootScope.fileId,
                skipFirstRow: $scope.isChecked,
                delimiter: $scope.delimeter,
                columnMapping: {
                    name: $scope.selectedNameIndex,
                    email: $scope.selectedEmailIndex,
                    orderId: $scope.selectedReferenceIndex
                }
            };

            var requestValidationMessage = demofilevalidationService.validateToSenddemoRequest(userMappingModel);
            if (requestValidationMessage.length > 0) {
                for (var i = 0; 1 < requestValidationMessage.length; i++) {
                    console.log('Error: ' + requestValidationMessage[i]);
                }
                
                AlertService.showAlert(demoFileTranslationService.messages.usermappingmodelincomplete, 'error');
            }
            else if (requestValidationMessage.length == 0) {
                senddemosService.setSenddemoFileRequest(userMappingModel);
                $location.path(window.global_clientPrefix + 'send-demos/sender-details');
            } 

            console.log(userMappingModel);
        };

        $scope.checkChange = function () {
            if ($scope.isChecked) {
                removeData = $scope.tableData.splice(0, 1);              
            } else {
                $scope.tableData.splice(0, 0, removeData[0]);   
            }
        };

        $scope.selectDelimeter = function() {
            filereaderService.getData($scope.delimeter);
        };
    }
);
