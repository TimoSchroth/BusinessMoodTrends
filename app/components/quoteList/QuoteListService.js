bmtApp.factory('QuoteListService', function($http, URIBackendConstants){
    var srv = {};
    
    srv.getQuoteList = function(){
        return $http.post(URIBackendConstants.base + URIBackendConstants.getQuoteList);
    };
    
    return srv;
});


