/* Bildet den Startpunkt der Applikation.
 * 
 * @param {String}          - Name der Applikation in der index.html 
 *                            (bezieht sich somit nur auf den Bereich 'bmtApp')
 * @param {object - array}  - Beinhaltet alle Module, die in der Applikation 
 *                            geladen werden sollen
 */
var bmtApp = angular.module('bmtApp', 
    [
        'ngRoute',
        "firebase",
        'ngCookies',
        'ngAnimate',
        'ui.bootstrap',
        'nvd3ChartDirectives',
        'ngSanitize'
    ]);