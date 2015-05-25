/**
 * Direktive die nach dem ersten Vote angezeigt wird (Zitat)
 * 
 * @param {type} param1
 * @param {type} param2
 */
bmtApp.directive('votingCredit', function(URIViewConstants) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
        credit_1: '=credit1',
        credit_2: '=credit2'
    },
    templateUrl: URIViewConstants.shared + 'votingCredit/VotingCreditView.html'
  };
});