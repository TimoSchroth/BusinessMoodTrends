/**
 * 
 * @param {type} param1
 * @param {type} param2
 */
bmtApp.controller('VotingController',  function($scope, LoginService, VotingService){
    LoginService.setIsInSystem(0); // Wenn der Controller direkt aufgerufen wird 
    
    /**
     * Der View werden ueber dem Scope $scope.votingActions mitgeteilt welche
     * Direktive in der View angezeigt werden soll.
     * Die View beinhaltet folgende Direktiven:
     *  -   votingVote: Skala mit Smilies um ein Vote abzugeben (Wird immer als erstes angezeigt)
     *  -   votingQuote: Anzeige des ersten Sammelobjekts (Zitat - wird nach dem ersten Vote angezeigt)
     *  -   votingCredit: Anzeige des zweiten Sammelobjekts (Bonuspunkt - wird nach dem zweiten Vote angezeigt)
     *  -   votingSmiley: Anzeige des dritten Sammelobjekts (Smiley - wird nach dem dritten Vote angezeigt)
     */
    $scope.votingActions = VotingService.votingActions;
    $scope.votingValues = VotingService.votingValues;
});
