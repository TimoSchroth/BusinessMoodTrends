/**
 * systemMentorTooltip
 * 
 * @param {service} SystemMentorService - verwaltet den Moody der Applikation
 * @param {constant} URIViewConstants - beinhaltet alle URLs der Views
 */
bmtApp.directive('systemMentorTooltip', function(SystemMentorTooltipService, URIViewConstants) {
  return {
    restrict: 'E',
    transclude: false,
    scope: false,
    controller: function() {
        /* setzt die initiale Nachricht des Tooltips
         */
        SystemMentorTooltipService.setInitMentorTooltip();
    },
    templateUrl: URIViewConstants.shared + 'systemMentorTooltip/SystemMentorTooltipView.html'
  };
});