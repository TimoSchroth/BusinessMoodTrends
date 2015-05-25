/**
 * SignupController
 * 
 * @param {service} $scope - verwaltet den Zugriff auf die View (Datenbindung - ViewModel).
 * @param {service} $location - verwaltet Routen.
 * @param {service} SignupService - verwaltet die Registrierung.
 * @param {service} DashboardService - verwaltet die Daten des Dashbaords.
 * @param {constant} AlertMsgs - beinhaltet alle Fehlermeldungen.
 * @param {constant} URIAssetsConstants - beinhaltet alle URLs der Bibliotheken, Bilder, CSS-Dateien, ...usw.
 * @param {service} AlertsService - verwaltet die Warnmeldungen.
 * @param {constant} URILocationConstants - beinhaltet alle URLs der Routen.
 */
bmtApp.controller('SignupController', function($scope, $location, SignupService, 
                                               AlertsService, URIAssetsConstants, 
                                               AlertMsgs, URILocationConstants){
    /* View-Bereich wird mit dieser Klasse versehen, damit die Animationen fuer
     * die Registrierungsseite angezeigt werden.
     */
    $scope.animationClass = 'an-register';
    /* Fuer die Setzung eines zufaelligen Bildes der Datenbank.
     */
    $scope.signupUser = {
        gender: 0,
        imgId: 0,
        imgUrl: URIAssetsConstants.baseImgMentors + URIAssetsConstants.imgMentorsPlaceholder
    };

    /* Ermittelt und setzt ein zufaelliges Bild fuer einen Moody
     */
    $scope.getRandomMentorImg = function(){
        SignupService.getRandomMentorImg($scope.signupUser.imgId)
            .success(
                function(data){
                    if(data['success']){
                        /* Die ID eines Bildes aus der Datenbank wird nach Abschluss der Registrierung
                         * in das entsprechende Benutzerprofil gespeichert. Damit zu jederzeit
                         * eine Zuordnung statt findet.
                         * Die Bild URL wird direkt im Platzhalter des Moodys geladen.
                         */
                        $scope.signupUser.imgId = data['mentor_img_id'];
                        $scope.signupUser.imgUrl = URIAssetsConstants.baseImgMentors + data['url'];
                    } else {
                        AlertsService.generateAlert(AlertMsgs.signUpNoRandomImg.type, AlertMsgs.signUpNoRandomImg.msg + " " + data['msg']);
                    }
                }
            ).error(
                function(data){
                    AlertsService.generateAlert(AlertMsgs.signUpNoRandomImg.type, AlertMsgs.signUpNoRandomImg.msg + " " + data['msg']);
                }
            );
    };
    
    /**
     * Fuehrt eine Registrierung durch. 
     * Eingegebenen Daten werden zunaechst auf Gueltigkeit ueberprueft.
     * Anschließend werden die Daten ueber einen AJAX-Aufruf an das Back-End
     * verschickt.
     * Wurden die Daten erfolgreich in die Datenbank eingetragen wird eine
     * Nachricht fuer den Benutzer erzeugt und dieser weiter zur Anmeldeseite
     * weitergeleitet.
     * @returns {undefined}
     */
    
    $scope.doSignupUser = function(){
        
        var canSignupUser = true;
        
        if (!$scope.signupUser.name) {
            canSignupUser = false;
            AlertsService.generateAlert(AlertMsgs.signUpNameEmpty.type, AlertMsgs.signUpNameEmpty.msg);
        }

        if (!$scope.signupUser.password) {
            canSignupUser = false;
            AlertsService.generateAlert(AlertMsgs.signUpPasswordEmpty.type, AlertMsgs.signUpPasswordEmpty.msg);
        }
        
        if (!$scope.signupUser.passwordRetype) {
            canSignupUser = false;
            AlertsService.generateAlert(AlertMsgs.signUpPasswordRetypeEmpty.type, AlertMsgs.signUpPasswordRetypeEmpty.msg);
        }        
        
        /*if ($scope.signupUser.gender === 0) {
            canSignupUser = false;
            AlertsService.generateAlert(AlertMsgs.signUpGenderEmpty.type, AlertMsgs.signUpGenderEmpty.msg);
        }*/
        
        if ($scope.signupUser.imgId === 0) {
            canSignupUser = false;
            AlertsService.generateAlert(AlertMsgs.signUpMentorImgEmpty.type, AlertMsgs.signUpMentorImgEmpty.msg);
        }         
        
        if(canSignupUser){
            $scope.showPreloader = true;
            SignupService.signupUser($scope.signupUser)
                .success(function(data){
                    if(data['success']){
                        $scope.showPreloader = false;
                        AlertsService.generateAlert(AlertMsgs.signUpSuccess.type, AlertMsgs.signUpSuccess.msg);
                        $location.url(URILocationConstants.base);
                    } else {
                        AlertsService.generateAlert(AlertMsgs.signUpNoSignUp.type, AlertMsgs.signUpNoSignUp.msg + " " + data['msg']);
                    }
                })
                .error(function(data){
                    $scope.showPreloader = false;
                    AlertsService.generateAlert(AlertMsgs.signUpNoSignUp.type, AlertMsgs.signUpNoSignUp.msg + " " + data['msg']);
                });
        }

    };  
    
    /*$scope.$on('$locationChangeStart', function (event, next, current) {
        this_next = next.split("#")[1];
        this_current = current.split("#")[1];
        if((this_next !== URILocationConstants.base) && $window.sessionStorage.getItem("token") === null){
            event.preventDefault();
        }      
    });*/     
    
});