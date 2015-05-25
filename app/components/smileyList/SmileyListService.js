/**
 * SmileyListService
 * 
 * @param {type} param1
 * @param {type} param2
 */
bmtApp.factory('SmileyListService', function($http, URIBackendConstants){
    var srv = {};
    
    /**
     * Ermittelt aus dem Back-End eine Smilieliste, die der angemeldete Benutzer erworben hat.
     * Die Liste beinhaltet die URLs der Smilies
     * 
     * @returns {unresolved}
     */
    srv.getSmileyList = function(){
        return $http.post(URIBackendConstants.base + URIBackendConstants.getSmileyList);
    };
    
    return srv;
});


