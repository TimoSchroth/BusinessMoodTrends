bmtApp.directive('votingSmiley', function(URIViewConstants) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
        smiley_image_url: '=smileyImageUrl'       
    },
    templateUrl: URIViewConstants.shared + 'votingSmiley/VotingSmileyView.html'
  };
});