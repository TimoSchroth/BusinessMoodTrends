/**
 * CreditsListController
 * 
 * @param {service} $scope - Datenbindung mit der View (ViewModel).
 * @param {service} LoginService - verwaltet die Authentifizierung.
 * @param {service} CreditsListService - verwaltet die Punkteliste.
 * @param {service} SystemMentorTooltipService - verwaltet die Nachrichten des Tooltips.
 * @param {value} AlertMsgs - Beinhaltet alle dynamischen Nachrichten der Warnmeldungen.
 * @param {service} AlertsService - verwaltet die Warnmeldungen.
 */
bmtApp.controller('CreditsListController',  function($scope, LoginService, 
                                                     CreditsListService, 
                                                     SystemMentorTooltipService, 
                                                     AlertMsgs, AlertsService){
    /* Sollte die Route direkt aufgerufen werden oder das Browserfenster manuell
     * neugeladen werden, wird das System erneut auf 'angemeldet' gesetzt, damit
     * die Animationen nicht neu abgespielt werden.
     */                                                         
    LoginService.setIsInSystem(0);

    /**
     * Ermittelt die Punkteliste eines Benutzers.
     * - Gesamtpunktzahl
     * - Gesamtlaenge der Bonuspunkteliste
     * - Bonuspunkteliste
     */
    CreditsListService.getCreditsList()
        .success(function(data){
            if(data['success']){
                console.log(data);
                SystemMentorTooltipService.setMentorTooltip("creditsList", [data['total_credits']]);
                $scope.totalCredits = data['total_credits'];
                $scope.totalBonusCredits = data['bonus_credits_list'].length;
                $scope.bonusCredits = data['bonus_credits_list'];
            } else {
                AlertsService.generateAlert(AlertMsgs.creditsListError.type, AlertMsgs.creditsListError.msg + " " + data['msg']);
            }
        })
        .error(function(data){
            AlertsService.generateAlert(AlertMsgs.creditsListError.type, AlertMsgs.creditsListError.msg + " " + data['msg']);
        });   
    
});

