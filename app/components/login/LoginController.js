/**
 * LoginController
 * 
 * @param {service} $cookieStore - verwaltet den Zugriff auf die Cookies.
 * @param {service} $scope - verwaltet den Zugriff auf die View (Datenbindung - ViewModel).
 * @param {service} $rootScope - verwaltet den Zugriff auf alle Scopes.
 * @param {service} LoginService - verwaltet die Authentifizierung.
 * @param {constant} AlertMsgs - beinhaltet alle Fehlermeldungen.
 * @param {service} AlertsService - verwaltet die Warnmeldungen.
 * @param {constant} URILocationConstants - beinhaltet alle URLs der Routen. 
 */
bmtApp.controller('LoginController', function($scope, $rootScope, $cookieStore, 
                                              $location, LoginService, 
                                              AlertsService, URILocationConstants, 
                                              AlertMsgs){
    $scope.animationClass = 'an-login';
    $scope.credentials = {
        name: '',
        password: ''
    };

    /**
     * Fuehrt eine Anmeldung durch.
     * 
     * Zunaechst wird kontrolliert, ob die eingegebenen Daten des Benutzers
     * gueltig sind. Ist dies der Fall, wird mit der Funktion $emit ein Anmeldeereignis gesetzt.
     * Dieses Ereignis kann in anderen Controllern angesprochen werden und entsprechend reagiert werden
     * falls sich der Wert von 'login' aendert. Dieses Ereignis wird z.B. bei der Sidebar aufgerufen,
     * damit die Werte der Sidebar (Firebase) neu gesetzt werden, sobald sich ein Benutzer an- oder abmeldet.
     * Danach werden der Funktion loginUser() aus dem Service LoginService die Benutzerdaten ubergeben.
     * Danach wird der Benutzer angemeldet (Cookies werden gesetzt) und der Wert der Wert des Ereignisses
     * 'login' wird mit der $emit() Funktion geaendert.
     * Handelt es sich um den angemeldeten Benutzer um einen einfachen Benutzer, dann wird dieser zur
     * Dashboardseite weitergeleitet. Andernfalls wird der Administrator zum Adminbereich weitergeleitet.
     * 
     * @returns {undefined}
     */
    $scope.doLoginUser = function(){
        
        var canLoginUser = true;

        if (!$scope.credentials.name) {
            canLoginUser = false;
            AlertsService.generateAlert(AlertMsgs.logInNameEmpty.type, AlertMsgs.logInNameEmpty.msg);
        }

        if (!$scope.credentials.password) {
            canLoginUser = false;
            AlertsService.generateAlert(AlertMsgs.logInPasswordEmpty.type, AlertMsgs.logInPasswordEmpty.msg);
        }     
        $rootScope.$emit('login', false);
        if(canLoginUser){
            $scope.showPreloader = true;
            LoginService.loginUser($scope.credentials)
                .success(function(data){
                    if(data['success']){
                        $scope.showPreloader = false;
                        LoginService.setLoggedIn(data);
                        $rootScope.$emit('login', true); 
                        if($cookieStore.get('user_role_id') > 0){
                            $location.url(URILocationConstants.dashboard).replace();
                        } else {
                            $location.url(URILocationConstants.admin).replace();
                        }
                    } else {
                        AlertsService.generateAlert(AlertMsgs.logInWrongCredentials.type, AlertMsgs.logInWrongCredentials.msg + " " + data['msg']);
                    }
                })
                .error(function(data){
                    $scope.showPreloader = false;
                    //LoginService.setLoggedOut();
                    AlertsService.generateAlert(AlertMsgs.logInWrongCredentials.type, AlertMsgs.logInWrongCredentials.msg + " " + data['msg']);
                });
        }
    };
     
    
});