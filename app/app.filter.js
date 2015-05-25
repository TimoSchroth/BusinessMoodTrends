/* Wandelt ein Datum in einem ISO-String um.
 * Ist hilfreich um den Datumsfilter anzuwenden, da dieser nur ein Datum
 * in einem ISO-String Format versteht.
 */
bmtApp.filter('dateToISO', function() {
  return function(input) {
    input = new Date(input).toISOString();
    return input;
  };
});
