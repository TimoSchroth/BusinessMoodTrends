/**
 * SmileyListController
 * 
 * @param {service} $scope - Datenbindung mit der View (ViewModel).
 * @param {service} LoginService - verwaltet die Authentifizierung.
 * @param {constant} URIAssetsConstants - beinhaltet alle URLs der Bibliotheken, Bilder, CSS-Dateien, ...usw. 
 * @param {service} SystemMentorTooltipService - verwaltet die Nachrichten des Tooltips.
 * @param {value} AlertMsgs - Beinhaltet alle dynamischen Nachrichten der Warnmeldungen.
 * @param {service} AlertsService - verwaltet die Warnmeldungen.
 */
bmtApp.controller('SmileyListController',  function($scope, LoginService, 
                                                    SmileyListService, 
                                                    URIAssetsConstants, 
                                                    SystemMentorTooltipService, 
                                                    AlertMsgs, AlertsService){
    LoginService.setIsInSystem(0); // Wenn der Controller direkt aufgerufen wird 

    //Binhaltet das Hauptverzeichnis fuer die Smileybilder
    $scope.baseImgSmilies = URIAssetsConstants.baseImgSmilies;

    /**
     * Ermittelt die Liste aller erworbenen Smilies
     * Weist dem Tooltip die Anzahl der erworbenen Smilies zu.
     * Anschließend werden die Smilies der View uebermittelt.
     */
    SmileyListService.getSmileyList()
        .success(function(data){
            if(data['success']){
                SystemMentorTooltipService.setMentorTooltip("smileyList", [data['smiley_list'].length]);
                $scope.smileyList = data['smiley_list'];
            } else {
                AlertsService.generateAlert(AlertMsgs.smileyListError.type, AlertMsgs.smileyListError.msg + " " + data['msg']);
            }
        })
        .error(function(data){
            AlertsService.generateAlert(AlertMsgs.smileyListError.type, AlertMsgs.smileyListError.msg + " " + data['msg']);
        });   
    
});
