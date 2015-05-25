bmtApp.factory('AlertsService', function($rootScope){
    var srv = {};
    
    /**
     * Erstellt ein Nachrichtenfester anhand von uebergebenen Daten.
     * 
     * @param {Strng} type - welcher Typ Nachricht (Warnmeldung, Erfolgsmeldung,...) 
     * @param {type} msg - Der anzuzeigende Text in einer Nachricht.
     * @returns {undefined}
     */
    srv.generateAlert = function(type, msg){
        $rootScope.alerts.push({ type: type, msg: msg });
        $rootScope.autoHide();
    };
    
    return srv; 
});