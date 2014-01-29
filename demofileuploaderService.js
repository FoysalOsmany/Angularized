TPAngular.factory('fileuploaderService', function ($rootScope, $http) {
    var fileuploaderService = {};
    var xhr;

    $rootScope.fileId = '';

    fileuploaderService.Status = {
        upload_not_started: 0,
        upload_started: 1,
        upload_canceled: 2,
        upload_failed: 3,
        upload_finished: 4,
    };

    fileuploaderService.uploadProgressVisible = false;
    fileuploaderService.uploadProgress = 0;
    fileuploaderService.uploadProgressIE = 0;
    fileuploaderService.uploadProgressVisibleIE = false;
    fileuploaderService.uploadStatus = fileuploaderService.Status.upload_not_started; 
    fileuploaderService.KeyHandleFileUploadBroadcast = "handleFileUploadBroadcast";
    
    fileuploaderService.uploadFile = function (file) {
        var fileData = {
            's3ObjectName': file.name,
            's3ObjectType': file.type
        };

        $http.post('/api/v1/.....', fileData).
            success(function (data) {
                $rootScope.fileId = data.key;
                
                if (window.FormData) {
                    var formData = new FormData();
                    formData.append("key", data.key);
                    formData.append("AWSAccessKeyId", data.accesskey);
                    formData.append("acl", "private");
                    formData.append("policy", data.policy);
                    formData.append("signature", data.signature);
                    formData.append("success_action_status", "201");
                    formData.append("file", file);

                    xhr = new XMLHttpRequest();
                    xhr.upload.addEventListener("progress", uploadProgress, false);
                    xhr.addEventListener("load", uploadComplete, false);
                    xhr.addEventListener("error", uploadFailed, false);
                    xhr.addEventListener("abort", uploadCanceled, false);
                    xhr.open("POST", data.url);
                    fileuploaderService.uploadProgressVisible = true;
                    xhr.send(formData);
                }
                else {
                    $("#s3key").val(data.key);
                    $("#s3AWSAccessKeyId").val(data.accesskey);
                    $("#s3policy").val(data.policy);
                    $("#s3signature").val(data.signature);
                    $("#file").val($rootScope.fileContent);
                    fileuploaderService.uploadProgressIE = 20;
                    fileuploaderService.uploadProgressVisibleIE = true;
                    $("#remote-form").ajaxSubmit({
                        type: "POST",
                        url: data.url,
                        dataType: 'html',
                        beforeSend: function() {
                            fileuploaderService.uploadProgressIE = 0;
                            fileuploaderService.uploadStatus = fileuploaderService.Status.upload_started;
                        },             
                        uploadProgress: function (event, position, total, percentComplete) {
                            fileuploaderService.uploadProgressIE = percentComplete;
                            fileuploaderService.uploadStatus = fileuploaderService.Status.upload_started;
                        },
                        success: function (response, status) {
                            fileuploaderService.uploadProgressIE = 100;
                            fileuploaderService.uploadStatus = fileuploaderService.Status.upload_finished;
                            fileuploaderService.broadcastItem();
                        },
                        error: function(status, error) {
                            fileuploaderService.uploadStatus = fileuploaderService.Status.upload_failed;
                            fileuploaderService.broadcastItem();
                        }
                    });
                }
            }).
            error(function (data, status) {
                console.log("failed");
            });
    };

    fileuploaderService.cancelFileUpload = function() {
        xhr.abort();
        fileuploaderService.uploadProgressVisible = false;
        fileuploaderService.uploadStatus = fileuploaderService.Status.upload_canceled;
        fileuploaderService.broadcastItem();
    };

    function uploadProgress(evt) {
        if (evt.lengthComputable) {
            fileuploaderService.uploadProgressVisible = true;
            fileuploaderService.uploadProgress = Math.round(evt.loaded * 100 / evt.total);
            fileuploaderService.uploadStatus = fileuploaderService.Status.upload_started;
        } else {
            fileuploaderService.uploadProgress = 0;
            fileuploaderService.uploadStatus = fileuploaderService.Status.upload_not_started;
        }

        fileuploaderService.broadcastItem();
    }

    function uploadComplete(evt) {
        fileuploaderService.uploadStatus = fileuploaderService.Status.upload_finished;
        fileuploaderService.broadcastItem();
    }

    function uploadFailed(evt) {
        fileuploaderService.uploadStatus = fileuploaderService.Status.upload_failed;
        fileuploaderService.broadcastItem();
    }

    function uploadCanceled(evt) {
        fileuploaderService.uploadProgressVisible = false;
        fileuploaderService.uploadStatus = fileuploaderService.Status.upload_canceled; 
        fileuploaderService.broadcastItem();
    }

    fileuploaderService.broadcastItem = function () {
        $rootScope.$broadcast(fileuploaderService.KeyHandleFileUploadBroadcast);
    };

    return fileuploaderService;
});
