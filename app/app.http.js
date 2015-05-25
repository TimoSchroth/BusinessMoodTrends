/* Konfigurationsblock um die Serialisierung der Parameter einer URL umzuaendern.
 * 
 * Standardmässig versendet AngularJS die Daten einer http-Anfrage mit einem
 * AJAX-Aufruf in Form eines JSON-Objekts. Das Back-End von Business Mood Trends
 * versteht eine Daten Serialisierung nur in der Form name1=wert1&name2=wert2&...
 * Demntsprechend muss die Serialisierung in AngularJS angepasst werden.
 * Dem Header wird zunaechst ein anderer Conten-Type zugewiesen 
 * (application/x-www-form-urlencoded anstatt application/json).
 * Anschließend werden die JSON-Objekt Eigenschaften und Werte abgefangen.
 * Diese werden dann in einem String der Form name1=wert1&name2=wert2&... zusammengefasst
 * und dem $httpProvider zurück gegeben.
 * 
 * @param {provider} $httpProvider - Steuert http-Anfragen
 * @return {String} Serialisierungs Form für das Back-End
 */
bmtApp.config(['$httpProvider', function ($httpProvider) {
  var defaults =  $httpProvider.defaults;
  var contentType = "application/x-www-form-urlencoded";
  defaults.headers.post["Content-Type"] = contentType;
  defaults.transformRequest.unshift(function (data) {
    if(data != undefined){
        console.log(data);
        var result = [];
        for (key in data){
            result.push(encodeURIComponent(key) + "=" 
                        + encodeURIComponent(data[key]));
        }
        return result.join("&");
    }
  });
}]);

/* Konfigurierungsblock um dem $http Provider einen Interceptor zuzuweisen.
 */
bmtApp.config(['$httpProvider', '$routeProvider', function($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
}]);

/* Interceptor in Form einer Factory um die Anfragen und Antworten eines jeden
 * AJAX-Aufrufes abzufangen.
 * 
 * request      : Alle erfolgreichen Anfragen.
 * requestError : Alle fehlerhaften Anfragen.
 * response     : Alle erfolgreichen Antworten.
 * responseError: Alle fehlerhaften Antworten.
 * 
 * @param {service} $q          - Hilft Funktionen ansychron auszufuehren.
 * @param {service} $location   - parst die URL im Broswer und macht diese in der Applikation verfuegbar
 *                                (window.location)
 * @param {service} $injector   - Mit dem $injector können Objektinstanzen aus dem Providercache ermittelt werden
 * @param {constant} URILocationConstants - Beinhaltet alle URLs der einzelnen Routen von Business Mood Trends
 * @param {service} $cookieStore - Erlaubt das Verwalten von Cookies
 * 
 */
bmtApp.factory('httpInterceptor', ['$q', '$location', '$injector', 'URILocationConstants', '$cookieStore',
    function ($q, $location, $injector, URILocationConstants, $cookieStore) {
        return {
            /* Beim Anmeldeprozess eines Benutzers wird der Header des $http Providers
             * mit einem Token gesetzt, der fuer die Authentifizierung im Back-End dient.
             * Ist der Benutzer angemeldet und ladet die Applikation manuell neu, findet kein
             * Anmeldeprozess statt. Somit muss der Header neu gesetzt werden, falls sich
             * in einem Cookie der entsprechende Token befindet.
             * In der config befinden sich alle Eigenschaften der Anfrage (URL, Methode wie POST oder GET, ...usw.).
             * Diese wird nach dem Abfangen der Abfrage weiter zum Ursprünglichen Aufruf weitergeleitet. 
             */
            request: function (config) {
                if($cookieStore.get("token") != undefined){
                    config.headers['TOKEN'] = $cookieStore.get("token");
                }
                return config || $q.when(config);
            },
            requestError: function(request){
                return $q.reject(request);
            },
            response: function (response) {
                return response || $q.when(response);
            },
            /* Sendet das Back-End eine Statusmeldung 401 wird die Funktion responseError aufgerufen,
             * da eine http-Anfrage unter AngularJS auf Statusmeldungen zwischen 200 - 299 position reagiert.
             * Bei einer 401 Statusmeldung wird der Benutzer mit der Funktion setLoggedOut() ausgeloggt
             * (Cookies werden geloescht). Anschließend wird der Benutzer zur Anmeldeseite weitergeleitet.
             * Der Service LoginService kann nicht in dem $http Provider injeziert werden, da der Service
             * selber den $http Provider verwendet (Henne Ei Problem). Deshalb muss die Instanz manuelle
             * ermittelt werden.
             * Anschließend wird die Antwort abgewiesen (reject()). Dadurch
             * ruft ein AJAX-Aufruf ($http.post()) den Funktionsblock error() auf.
             */
            responseError: function (response) {
                if (response && response.status === 404){}
                if (response && response.status === 401){
                    var LoginService = $injector.get('LoginService');
                    LoginService.setLoggedOut();
                    $location.url(URILocationConstants.base).replace();
                }
                if (response && response.status >= 500) {}
                return $q.reject(response);
            }
        };
}]);