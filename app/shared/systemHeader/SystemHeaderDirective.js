/**
 * systemHeader
 * 
 * Repraesentiert den Header der Applikation
 * 
 * @param {constant} URIViewConstants - beinhaltet die URLs zu allen Views
 * @param {service} $cookieStore - verwaltet die Cookies
 * @param {value} AlertMsgs - Beinhaltet alle dynamischen Nachrichten der Warnmeldungen.
 * @param {service} AlertsService - verwaltet die Warnmeldungen.
 */
bmtApp.directive('systemHeader', function(URIViewConstants, $cookieStore, AlertMsgs, $rootScope) {
  /**
   * Direktive wird ueber <systemHeader> aufgerufen
   */
  return {
    restrict: 'E',
    transclude: true,
    scope: {},
    controller: function($scope, LoginService, AlertsService, SystemHeaderService) {
        
        /* setzt die Elemente der Navigation
         */
        if($cookieStore.get('user_id') != undefined){
            $scope.navigation = SystemHeaderService.getNavigation();
        }
        /* Hier wird auf ein Anmeldewechsel reagiert, und die Navigation neu gesetzt.
         * (Falls sich ein Benutzer mit anderen Rechten anmelden, muss diesem Benutzer
         * ggf. eine Navigation angezeigt werden)
         */
        $rootScope.$on('login', function(event, data) {
            $scope.navigation = SystemHeaderService.getNavigation();
        });
        
        /* Meldet einen Benutzer ab
         */
        $scope.doLogoutUser = function(){
            LoginService.logoutUser()
                .success(function(data){
                })
                .error(function(data){
                    //AlertsService.generateAlert(AlertMsgs.logOutSuccess.type, AlertMsgs.logOutSuccess.msg);
                });
        };
    },
    templateUrl: URIViewConstants.shared + 'systemHeader/SystemHeaderView.html'
  };
});