bmtApp.directive('votingQuote', function(URIViewConstants) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
        quote_text: '=quoteText',
        quote_author: '=quoteAuthor'
    },
    templateUrl: URIViewConstants.shared + 'votingQuote/VotingQuoteView.html'
  };
});