TPAngular.controller(
    "demofileuploaderController",
    function demofileuploaderController($rootScope, $scope, $http, $location, $window, AlertService, demofilevalidationService, fileuploaderService, filereaderService, demoFileTranslationService) {
        $scope.progressVisible = false;
        $scope.showLoader = false;
        $scope.progress = 0;

        $scope.handleFileSelect = function (evt) {
            $rootScope.selectedFileLines = null;
            $scope.showLoader = true;
            var file = evt.files[0];

            $scope.$apply(function () {
                $rootScope.file = file;
                $scope.validationMessages = demofilevalidationService.validateFile(file, [1, 3, 5]);
            });

            if ($scope.validationMessages.length > 0) {
                $scope.showLoader = false;
                $scope.errormsg = demoFileTranslationService.messages.validationmessagecases;
                $scope.$apply();

            }

            $scope.showLoader = false;
            if ($scope.validationMessages.length == 0) {

                filereaderService.proceedToReadFile(file, readSuccess, readFail);
            }
        };

        var readSuccess = function () {
            fileuploaderService.uploadFile($rootScope.file);

            $scope.$on(fileuploaderService.KeyHandleFileUploadBroadcast, function () {
                $scope.progressVisible = fileuploaderService.uploadProgressVisible;
                $scope.progress = fileuploaderService.uploadProgress;
                $scope.progressVisibleIE = fileuploaderService.uploadProgressVisibleIE;
                $scope.progressIE = fileuploaderService.uploadProgressIE;
                $scope.uploadStatus = fileuploaderService.uploadStatus;
                $scope.$apply();

                if ($scope.uploadStatus == fileuploaderService.Status.upload_finished) {
                    $scope.$apply(function () {
                        $location.path(window.global_clientPrefix + "send-demos/map-columns");
                    });
                }
            });
        };

        var readFail = function () {
            $scope.validationMessages = filereaderService.getValidationMessages();
            $scope.progressVisible = false;

            $scope.$apply();
        };

        angular.element($('#file-Upload')).ready(function () {
            if (window.FormData == undefined) {
                $('#file-Upload').fileReader({
                    id: 'fileReaderSWFObject',
                    filereader: 'filereader.swf',
                    debugMode: false,
                });

                $('#file-Upload').on('change', $scope.handleFileSelect);
            }
        });

        $scope.cancelFileUpload = function () {
            fileuploaderService.cancelFileUpload();
        };

        $scope.supportedFileAPIFound = function () {
            if (!$window.File || !$window.FileReader || !$window.FileList) {

                if (FlashDetect.installed) {
                    $rootScope.browserSupportedFileAPI = FileAPIType.FlashPlayerFileAPI;

                    return true;
                }
                else {
                    showValidationErrors([{ ValidationNumber: 5, Message: demoFileTranslationService.messages.validationmessagecase5 }]);
                    $rootScope.browserSupportedFileAPI = FileAPIType.NoAPIFound;
                    return false;
                }
            }

            $rootScope.browserSupportedFileAPI = FileAPIType.Html5;

            return true;
        };

        var FileAPIType = {
            NoAPIFound: 0,
            Html5FileAPI: 1,
            FlashPlayerFileAPI: 2
        };

        $("input[type=file]").on("click", function () {
            return $scope.supportedFileAPIFound();
        });

        $scope.reset = function () {
            $rootScope.currentToken = {};
            $rootScope.validationMessages = [];
            $rootScope.selectedFileLines = null;
            $rootScope.file = null;
        };
    }
);
