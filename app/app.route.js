/**
 * Konfigurierungsblock fuer die Definierung der Routen.
 * 
 * Funktion when(): Definiert eine Route.
 *  Eigenschaft 'templateUrl': Setzt die View fest.
 *  Eigenschaft 'controller': Weist der Route einen Controller zu.
 *  Eigenschaft 'resolve': Wird aufgerufen, bevor die Route angesprochen wird.
 * 
 * @param {provider} $routeProvider - Steuert die Routen.
 * @param {constant} URIBackendConstants - Beinhaltet die URLs zum Back-End.
 * @param {constant} URIViewConstants - Beinhaltet die URLs fuer die Views.
 * @param {constant} URILocationConstants - Beinhaltet die URLs fuer die einzelnen Routen.
 */
bmtApp.config(function($routeProvider, URIBackendConstants, URIViewConstants, URILocationConstants){
    $routeProvider
            .when('/', {
                templateUrl: URIViewConstants.components + 'login/LoginView.html',
                controller: 'LoginController',
                resolve: { authorize:function($window, $cookieStore, $location) {
                    /* Falls ein Benutzername in einem Cookie vorhanden ist,
                     * sollen die Routen fuer das Anmelden und Registrieren
                     * nicht erreichbar sein (Benutzer ist angemeldet).
                     * Benutzer wird dann zum geschuetzten Bereich (Dashbaord)
                     * weitergeleitet.
                     */
                    console.log($cookieStore.get("username"));
                    if ($cookieStore.get("username") !== undefined){
                        $location.url(URILocationConstants.dashboard);
                    }
                }}
            })
            .when('/signup', {
                templateUrl: URIViewConstants.components + 'signup/SignupView.html',
                controller: 'SignupController',
                resolve: { authorize:function($window, $cookieStore, $location) {
                    if ($cookieStore.get("username") !== undefined){
                        $location.url(URILocationConstants.dashboard);
                    }
                }}
            })
            .when('/dashboard', {
                templateUrl: URIViewConstants.components + 'dashboard/DashboardView.html',
                controller: 'DashboardController', 
                resolve: { authorize:function($http) {
                    /* Bevor eine Route im geschuetztem Bereich angesprochen wird,
                     * wird ein AJAX-Aufruf zur 'ping()' Funktion im Back-End durchgefuehrt.
                     * Diese Funktion kontrolliert ob ein Benutzer weiterhin die
                     * Berechtigung hat die aktuelle Route anzusprechen. Hat der
                     * Benutzer keine Berechtigung, antwortet das Back-End mit einer
                     * 401 Statusmeldung.
                     */
                    return $http.get(URIBackendConstants.base + URIBackendConstants.ping); // $http.get liefert eine Promise zurück
                }}
            })
            .when('/voting', {
                templateUrl: URIViewConstants.components + 'voting/VotingView.html',
                controller: 'VotingController', 
                resolve: { authorize:function($http) {
                    return $http.get(URIBackendConstants.base + URIBackendConstants.ping); // $http.get liefert eine Promise zurück
                }}
            })   
            .when('/smileylist', {
                templateUrl: URIViewConstants.components + 'smileyList/SmileyListView.html',
                controller: 'SmileyListController', 
                resolve: { authorize:function($http) {
                    return $http.get(URIBackendConstants.base + URIBackendConstants.ping); // $http.get liefert eine Promise zurück
                }}
            })
            .when('/quotelist', {
                templateUrl: URIViewConstants.components + 'quoteList/QuoteListView.html',
                controller: 'QuoteListController', 
                resolve: { authorize:function($http) {
                    return $http.get(URIBackendConstants.base + URIBackendConstants.ping); // $http.get liefert eine Promise zurück
                }}
            })
            .when('/creditslist', {
                templateUrl: URIViewConstants.components + 'creditsList/CreditsListView.html',
                controller: 'CreditsListController', 
                resolve: { authorize:function($http) {
                    return $http.get(URIBackendConstants.base + URIBackendConstants.ping); // $http.get liefert eine Promise zurück
                }}
            }).when('/admin', {
                templateUrl: URIViewConstants.components + 'admin/AdminView.html',
                controller: 'AdminController', 
                resolve: { authorize:function($http) {
                    return $http.get(URIBackendConstants.base + URIBackendConstants.ping); // $http.get liefert eine Promise zurück
                }}
            })            
            .otherwise({
                /* Wird eine unbekannte Route angesprochen, wird der Benutzer
                 * zur Route der Eigenschaft 'redirectTo' weitergeleitet.
                 */
                redirectTo: URILocationConstants.base
            });
});