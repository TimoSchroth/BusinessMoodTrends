/**
 * systemSidebar
 * 
 * repraesentiert die Sidebar.
 * 
 * @param {service} SystemSidebarService - verwaltet die Daten der Sidebar
 * @param {service} FirebaseService - verwaltet den Zugriff auf den Onlinedienst Firebase
 * @param {service} $rootScope - verwaltet den Zugriff auf alle Scopes.
 * @param {constant} URIViewConstants - beinhaltet die URLs zu allen Views
 * @param {service} $cookieStore - verwaltet die Cookies
 * @param {constant} URIAssetsConstants - beinhaltet alle URLs der Bibliotheken, Bilder, CSS-Dateien, ...usw. 
 */
bmtApp.directive('systemSidebar', function($cookieStore, $rootScope, 
                                           FirebaseService, URIViewConstants, 
                                           URIAssetsConstants, SystemSidebarService, 
                                           $firebase) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {},
    link: function($scope){
        /**
         * Bei einer responsiven Darstellung wird die Sidebar ueber active angezeigt
         * oder ausgeblendet sobald die Schaltflaeche "Ranking" angewaehlt wird.
         * @returns {undefined}
         */
        $scope.slideUp = function(){
            if($scope.active){
                $scope.active = false;
            } else {
                $scope.active = true;
            }
        };
        /**
         * Setzt die Platzierungen der Sidebar
         * Zunaechst wird die Benutzerliste aus der Datenbank ermittelt.
         * Anschließend wir die $watch()-Funktion auf den Scope $scope.fbData angewendet.
         * Der Scope $scope.fbData bekommt zu jederzeit Daten der Firebase-Datenbank,
         * sobald sich in ihr etwas geaendert hat (genau hier findet die Pushbenachrichtigung und
         * die Echtzeit statt).
         * Hat sich etwas geaendert, wird der Sidebar der aktuelle Punktestand des Benutzers
         * und die aktualisiert Benutzerliste mit den Punktestaenden uebermittelt.
         * Die Punktestandliste ist allerdings noch unsortiert. Diese wird in der
         * View in der Direktive ng-repeat ueber den Filte orderBy nach den Punkten
         * geordnet.
         * 
         * Daten in
         * @returns {undefined}
         */
        setSidebarData = function(){
                SystemSidebarService.getUserList()
                    .success(function(data){
                        $scope.$watch("fbData", function(){
                            $scope.userRanking = FirebaseService.getFormatedUserList(data['user_list'], $scope.fbData);
                            $scope.totalCredits = FirebaseService.getTotalCredits($scope.fbData);
                        });
                    })
                    .error(function(data){
                        console.log(data + "test");
                    }); 
        };        
        $scope.baseImgMentors = URIAssetsConstants.baseImgMentors;
        $scope.fbData = '';
        /* Bindung der Firebase-Datenbank an dem Scope $scope.fbData.
         * Aenderungen werden in dem Scope druch die Funktion $bindTo() sofort
         * wahrgenommen.
         */
        FirebaseService.getFirebaseData().$bindTo($scope, "fbData");
        /* Ist ein Benutzer angemeldet, werden die Daten der Datenbank zugewiesen.
         */
        if($cookieStore.get('user_id') != undefined){
            setSidebarData();
        }
        /* Daten der Datenbank wird nach jedem Anmeldeprozess neu gesetzt.
         * (anderer Benutzer, andere ID = andere Daten in der Sidebar)
         */
        $rootScope.$on('login', function(event, data) {
            setSidebarData();
        });    
        
    },
    controller: function() {

    },
    templateUrl: URIViewConstants.shared + 'systemSidebar/SystemSidebarView.html'
  };
});