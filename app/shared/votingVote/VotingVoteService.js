bmtApp.factory('VotingVoteService', function($http, URIBackendConstants){

    var srv = {};

    /**
     * Uebermittelt eine Stimmung
     * 
     * @param {type} mood
     * @returns {unresolved}
     */
    srv.vote = function(mood){
        return $http.post(URIBackendConstants.base + URIBackendConstants.vote, {mood: mood});
    };

    /**
     * Ermittelt die Gesamtzahl der abgegebenen Votes
     */
    srv.getTotalVotesToday = function(){
        return $http.post(URIBackendConstants.base + URIBackendConstants.getTotalVotesToday);
    };

    return srv;
});