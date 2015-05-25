/**
 * SystemHeaderService
 * 
 * @param {constant} NavigationConstants - beinhaltet die Namen und URLs der Navigationselemente
 * @param {service} $cookieStore - verwaltet die Cookies
 */
bmtApp.factory('SystemHeaderService', function(NavigationConstants, $cookieStore){
    srv = {};
    
    /**
     * Entscheidet nach der Benutzerrolle, welche Navigation angezeigt werden soll.
     * Admin hat z.B. nur ein Element in der Navigation (abmelden).
     * @returns {navigation|NavigationConstants|SystemHeaderService_L1.NavigationConstants|Array}
     */
    srv.getNavigation = function(){
        navigation = [];
        if($cookieStore.get('user_role_id') > 0){
            navigation = NavigationConstants;
        }
        return navigation;
    };
    
    return srv;
});