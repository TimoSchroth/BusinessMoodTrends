
bmtApp.factory('SystemSidebarService', function($http, URIBackendConstants, $cookieStore){
    srv = {};
    /* deprecated */
    srv.getTotalCredits = function(creditsList){
        var totalCredits = 0;
        if(creditsList.$getRecord($cookieStore.get('user_id')) != undefined){
            totalCredits = creditsList.$getRecord($cookieStore.get('user_id')).credits;
        }
        return totalCredits;
    };
    
    srv.getUserList = function(){
        return $http.post(URIBackendConstants.base + URIBackendConstants.getUserList);
    };
    
    /*srv.getFormatedUserList = function(userList, creditsList){
        newUserList = {};
        for(i = 0; i < userList.length; i++){
            credits = 0;
            if(creditsList.$getRecord(userList[i].user_id)!= undefined){
                credits = creditsList.$getRecord(userList[i].user_id).credits;
            }
            newUserList.push({
                username: userList[i].username,
                image: userList[i].image,
                credits: credits
            });
        }
        return newUserList;
    };*/
    
    return srv;
    
});