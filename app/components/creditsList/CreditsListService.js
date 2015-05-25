/**
 * CreditsListService
 * 
 * @param {service} $http - verwaltet die AJAX-Aufrufe fuer http-Anfragen.
 * @param {constant} URIBackendConstants - beinhaltet alle URLs des Back-Ends.
 */
bmtApp.factory('CreditsListService', function($http, URIBackendConstants){
    var srv = {};
    
    /**
     * AJAX-Aufruf, ermittelt die Punkteliste eines Benutzers
     * 
     * @returns {array} - Array mit der Punkteliste
     */
    srv.getCreditsList = function(){
        return $http.post(URIBackendConstants.base + URIBackendConstants.getCreditsList);
    };
    
    return srv;
});


