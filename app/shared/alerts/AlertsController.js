/**
 * AlertsController
 * 
 * Steuert die Anzeige von Warnmeldungen
 * Modul: UI Bootstrap
 * 
 * @param {service} $rootScope - Spitze der Scope-Hierarchie
 * @param {service} $timeout - Zeitsteuerung von Aufgaben (setTimeout(), setIntervall())
 */
bmtApp.controller('AlertsController', function ($rootScope, $timeout) { 
    /* Beinhaltet alle anzuzeigenden Nachrichten
     */
    $rootScope.alerts = [];
    
    /**
     * Wird aufgerufen wenn ein Nachrichtenfenster geschlossen werden soll.
     * 
     * @param {type} index
     * @returns {undefined}
     */
    $rootScope.closeAlert = function(index) {
      $rootScope.alerts.splice(index, 1);
    };
    
    /**
     * Schließt ein Fenster nach 5 Sekunden
     * @returns {undefined}
     */
    $rootScope.autoHide = function(){
        $timeout(function() {
            $rootScope.alerts.splice(0, 1);
        }, 5000);
    }  
});