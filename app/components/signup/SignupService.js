bmtApp.factory('SignupService', function($http, URIBackendConstants){
    var srv = {};
    
    /**
     * Ermittelt die URL und die ID eines zufaelligen Bildes eines Moodys.
     * @param {type} oldImgId
     * @returns {unresolved}
     */
    srv.getRandomMentorImg = function(oldImgId){
        return $http.post(URIBackendConstants.base + URIBackendConstants.getRandomMentorImg, {oldImgId: oldImgId});
    };
    
    /**
     * Registriert einen Benutzer anhand von den im Registrierungsformular angegebenen Daten.
     * @param {type} userData
     * @returns {unresolved}
     */
    srv.signupUser = function(userData){
        return $http.post(URIBackendConstants.base + URIBackendConstants.signUp, userData);
    };
    
    return srv;
});