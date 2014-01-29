TPAngular.service('demofilevalidationService', function (demoFileTranslationService) {
    this.validateFileLines = function (lines, numbersToValidate) {
        var validationMessages = [];
        
            for (var i = 0; i < numbersToValidate.length; i++) {
                var numberToValidate = numbersToValidate[i];
                switch (numberToValidate) {
                    case 0:
                        if (lines == null)
                            break; 
                        if ((lines.length == 1 && lines[0].indexOf("@") == -1)
                            || (lines.length > 1 && lines[1].indexOf("@") == -1)
                            || (lines[0].split(";").length > 1 && lines[0].split(";").length < 3)
                            || (lines[0].split(",").length > 1 && lines[0].split(",").length < 3)) {
                            validationMessages.push({ ValidationNumber: numberToValidate, Message: demoFileTranslationService.messages.validationmessagecase0 });
                            break;
                        }

                        var delimeter = lines[0].split(";").length > 1 ? ';' : ',';
                        if (lines[0].split(delimeter)[2] == "") {
                            validationMessages.push({ ValidationNumber: numberToValidate, Message: demoFileTranslationService.messages.validationmessagecase0 });
                        }
                        break;
                    case 2:
                        if (lines == null)
                            break;
                        if (lines.length > 0 && (lines[0].split(";").length > 50 || lines[0].split(",").length > 50)) {
                            validationMessages.push({ ValidationNumber: numberToValidate, Message: demoFileTranslationService.messages.validationmessagecase2 });
                        }
                        break;
                        
                    case 4:
                        if (lines == null) {
                            validationMessages.push({ ValidationNumber: numberToValidate, Message: demoFileTranslationService.messages.validationmessagecase8 });
                        }
                        break;
                }
            }
            
            return validationMessages;
        };

    this.validateFile = function (file, numbersToValidate) {
            var validationMessages = [];
            
            for (var i = 0; i < numbersToValidate.length; i++) {
                var numberToValidate = numbersToValidate[i];
                switch (numberToValidate) {
                case 1:
                    var fileExtension = file.name.split('.').pop().toLowerCase();
                    if (fileExtension != "txt" && fileExtension != "csv") {
                        validationMessages.push({ ValidationNumber: numberToValidate, Message: demoFileTranslationService.messages.validationmessagecase1 });
                    }
                    break;
                case 3:
                    if (file.size > 52428800) {
                        validationMessages.push({ ValidationNumber: numberToValidate, Message: demoFileTranslationService.messages.validationmessagecase3 });
                    }
                    break;
                }
            }

            return validationMessages;
        };    

    this.validateToSenddemoRequest = function (userMappingModel) {
        var validationMessage = [];

        if (userMappingModel == null) {
            validationMessage.push("demo file request can not be null");
        } else {
            if (userMappingModel.fileId == null || userMappingModel.fileId == '') {
                validationMessage.push("demo file id can not be null");
            } else if (userMappingModel.skipFirstRow == null) {
                validationMessage.push("demo skip first row can not be null");
            } else if (userMappingModel.columnMapping == null) {
                validationMessage.push("demo file mapping can not be null");
            } else {
                if (userMappingModel.columnMapping.name == null) {
                    validationMessage.push("demo file name column mapping can not be null");
                } else if (userMappingModel.columnMapping.email == null) {
                    validationMessage.push("demo file email column mapping can not be null");
                } else if (userMappingModel.columnMapping.orderId == null) {
                    validationMessage.push("demo file orderid column mapping can not be null");
                }
            }
        }

        //TO DO others validations if necessery

        return validationMessage;
    };    

    });
