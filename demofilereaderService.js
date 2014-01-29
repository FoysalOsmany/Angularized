TPAngular.factory('filereaderService', function ($rootScope, $location, $http, $q, demofilevalidationService, demoFileTranslationService) {
    var filereaderService = {};
    filereaderService.tableData = [];
    
    filereaderService.delimeter = "";
    filereaderService.validationMessages = "";
    filereaderService.KeyHandleFileReaderBroadcast = "handleFileReaderBroadcast";
    filereaderService.selectionMessage = '';
    $rootScope.fileContent = "";
   
    filereaderService.proceedToReadFile = function (file, readSuccess, readFail) {
        var reader = new FileReader();
        reader.onload = (function() {
            filereaderService.file = file;
            return function(e) {
                if (e.target.readyState == FileReader.DONE || e.target.readyState == 2) {

                    filereaderService.selectedFileLines = e.target.result != null ? e.target.result.match(/[^\r\n]+/g) : e.target.result;

                    filereaderService.validationMessages = demofilevalidationService.validateFileLines(filereaderService.selectedFileLines, [0, 2, 4]);

                    if (filereaderService.validationMessages.length == 0) {
                        $rootScope.fileContent = e.target.result;
                        readSuccess();
                    }
                    else {
                        readFail();
                    }
                }
            };
        })(file);

        reader.readAsText(file, "UTF-8");
    };

    filereaderService.getValidationMessages = function () {
        return filereaderService.validationMessages;
    };

    filereaderService.getData = function (delimeter) {
        filereaderService.tableData = [];
        var selectedFileLines = filereaderService.selectedFileLines;
        var emailIndex = [];
        var nameIndex = [];
        
        filereaderService.emailDropdown = [];
        filereaderService.nameDropdown = [];
        filereaderService.refDropdown = [];
        
        var referenceIndex = [];
        
        var row = selectedFileLines.length > 1 ? selectedFileLines[1] : selectedFileLines[0];
       
        if (typeof(delimeter) == 'undefined')
            delimeter = row.split(";").length > 1 && row[0].split(";").length < 3 ? ';' : ',';
        
        filereaderService.delimeter = delimeter;
        var columns = row.split(delimeter);

        for (var i = 0; i < columns.length; i++) {

            if (columns[i].indexOf("@") > -1)
                emailIndex.push(i);
            else if (/^[a-zA-Z ]+$/.test(columns[i]))
                nameIndex.push(i);
            else if (/^[\d,. ]+$/.test(columns[i]))
                referenceIndex.push(i);
        }

        var headerColumns = selectedFileLines[0].split(delimeter);
  

        filereaderService.emailDropdown.push({ key: -1, value: demoFileTranslationService.messages.dropdownloadmessage });
        filereaderService.nameDropdown.push({ key: -1, value: demoFileTranslationService.messages.dropdownloadmessage });
        filereaderService.refDropdown.push({ key: -1, value: demoFileTranslationService.messages.dropdownloadmessage });
        

        for (var d = 0; d < headerColumns.length; d++) {
            filereaderService.emailDropdown.push({ key: d, value: "Field " + d + ":" + headerColumns[d] });
            filereaderService.nameDropdown.push({ key: d, value: "Field " + d + ":" + headerColumns[d] });
            filereaderService.refDropdown.push({ key: d, value: "Field " + d + ":" + headerColumns[d] });
        }

        var tableDataLength = selectedFileLines.length >= 5 ? 5 : selectedFileLines.length;
        
        for (var c = 0; c < tableDataLength; c++) {
            filereaderService.tableData.push(selectedFileLines[c].split(delimeter));
        }
       
        if (emailIndex.length > 1 || emailIndex.length == 0)
            filereaderService.selectedEmailIndex = -1;
        else
            filereaderService.selectedEmailIndex = emailIndex[0];

        if (nameIndex.length > 1 || nameIndex.length == 0)
            filereaderService.selectedNameIndex = -1;
        else
            filereaderService.selectedNameIndex = nameIndex[0];

        if (referenceIndex.length > 1 || referenceIndex.length == 0)
            filereaderService.selectedReferenceIndex = -1;
        else
            filereaderService.selectedReferenceIndex = referenceIndex[0];
        
        filereaderService.broadcastItem();
    };

    filereaderService.broadcastItem = function () {
        $rootScope.$broadcast(filereaderService.KeyHandleFileReaderBroadcast);
    };

    return filereaderService;
});
