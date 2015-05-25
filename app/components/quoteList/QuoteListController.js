bmtApp.controller('QuoteListController',  function($scope, LoginService, QuoteListService, SystemMentorTooltipService, AlertMsgs, AlertsService){
    LoginService.setIsInSystem(0); // Wenn der Controller direkt aufgerufen wird 

    QuoteListService.getQuoteList()
        .success(function(data){
            console.log("test");
            console.log(data);
            if(data['success']){
                SystemMentorTooltipService.setMentorTooltip("quoteList", [data['quote_list'].length]);
                $scope.quoteList = data['quote_list'];
            } else {
                AlertsService.generateAlert(AlertMsgs.quoteListError.type, AlertMsgs.quoteListError.msg + " " + data['msg']);
            }
        })
        .error(function(data){
            AlertsService.generateAlert(AlertMsgs.quoteListError.type, AlertMsgs.quoteListError.msg + " " + data['msg']);
        });   
    
});
