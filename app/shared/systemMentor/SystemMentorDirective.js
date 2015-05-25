/**
 * systemMentor
 * 
 * @param {service} SystemMentorService - verwaltet den Moody der Applikation
 * @param {constant} URIViewConstants - beinhaltet alle URLs der Views
 */
bmtApp.directive('systemMentor', function(SystemMentorService, URIViewConstants) {
  /**
   * Direktive wird ueber <systemMentor> aufgerufen
   */  
  return {
    restrict: 'E',
    transclude: false,
    scope: false,
    controller: function($scope, $rootScope) {
        /*  Dem Moody wird das zugehoerige Bild zugewiesen
         */
        $scope.mentor.image = SystemMentorService.setMentorImage();
        /* Bild wird nach einem anmeldewechsel neu gesetzt
         * (Reagiert auf eine Anmeldung) 
         */
        $rootScope.$on('login', function(event, data) {
            $scope.mentor.image = SystemMentorService.setMentorImage();
        });
    },
    templateUrl: URIViewConstants.shared + 'systemMentor/SystemMentorView.html'
  };
});