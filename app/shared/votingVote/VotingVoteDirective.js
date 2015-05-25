/**
 * Direktive die fuer das Voting verwendet wird.
 * 
 * @param {type} param1
 * @param {type} param2
 */
bmtApp.directive('votingVote', function(URIViewConstants, AlertMsgs, VotingLabels, 
                                        VotingService, VotingVoteService, 
                                        SystemMentorTooltipService, MoodValueConstants, 
                                        URIAssetsConstants) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {},
    controller: function($scope) {

        $scope.voteContent = {
            voteable : false
        };
        
        /**
         * Erstellt die Skala des Votings.
         * Wurden noch nicht 3 Votes abgegeben. Hat der Benutzer die Moeglichkeit
         * weitere Votes abzugeben. Andernfalls wird eine Meldung ueber das erreichte
         * Tagesziel angezeigt.
         * 
         */
        VotingVoteService.getTotalVotesToday()
            .success(function(data){
                if(data['success']){
                    if(data['total_votes'] < 3){
                        $scope.voteContent = 'vote';
                        $scope.moodBaseUrl = URIAssetsConstants.baseImgMoods;
                        /* Enthaelt die Werte der Stimmungen
                         */
                        $scope.moods = MoodValueConstants;
                        /* Bezeichnungen fuer die Direktive (Datum, der wievielte Vote,...)
                         */
                        $scope.voting = {
                            labelBad : VotingLabels.labelBad,
                            totalVotesToday : (data['total_votes'] + 1) + "" + VotingLabels.totalVotesToday,
                            labelGood : VotingLabels.labelGood,
                            dateToday : new Date()
                        };
                        SystemMentorTooltipService.setMentorTooltip("voting", {});
                    } else {
                        $scope.voteContent = 'dayGoal';
                        SystemMentorTooltipService.setMentorTooltip("dayGoal", {});
                        $scope.dayGoal = VotingLabels.dayGoal;
                    }
                } else {
                    AlertsService.generateAlert(AlertMsgs.votingError.type, AlertMsgs.votingError.msg + " " + data);
                }
            })
            .error(function(data){
                AlertsService.generateAlert(AlertMsgs.votingError.type, AlertMsgs.votingError.msg + " " + data);
            });
        
        /**
         * Ubermittelt den Wert eines Votes (1,2,3,-1,-2,-3) an das Back-End
         * 
         * @param {type} mood - Wert der Stimmung
         * @returns {undefined}
         */
        $scope.vote = function(mood){
            VotingVoteService.vote(mood)
                .success(function(data){
                    VotingService.setVotingAction(data);
                })
                .error(function(data){
                    AlertsService.generateAlert(AlertMsgs.votingError.type, AlertMsgs.votingError.msg + " " + data);
                });
        };        
    },
    templateUrl: URIViewConstants.shared + 'votingVote/VotingVoteView.html'
  };
});