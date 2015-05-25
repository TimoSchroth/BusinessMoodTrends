/**
 * LoginService
 * 
 * @param {service} $cookieStore - verwaltet den Zugriff auf die Cookies.
 * @param {service} $rootScope - verwaltet den Zugriff auf alle Scopes.
 * @param {service} $http - verwaltet die AJAX-Aufrufe fuer http-Anfragen.
 * @param {constant} URIBackendConstants - beinhaltet alle URLs des Back-Ends
 */
bmtApp.factory('LoginService', function($http, $rootScope,
                                        URIBackendConstants, 
                                        $cookieStore){
    var srv = {};

    /**
     * Anmeldedaten werden dem Back-End uebermittelt.
     * Sind die Daten korrekt werden im Back-End Sessions des Benutzers gesetzt.
     * 
     * @param {object} credentials - Name und Passwort des Benutzers.
     * @returns {object} - Daten des Benutzers (Name, ID, Rolle, Moodybild) und ein Token.
     */
    srv.loginUser = function(credentials){
        return $http.post(URIBackendConstants.base + URIBackendConstants.logIn, credentials);
    };
    
    /**
     * Benutzer wird im Back-End ausgeloggt. Sessions im Back-End werden geloescht.
     * 
     * @returns {object} - Object mit 401 Status.
     */    
    srv.logoutUser = function(){
        return $http.post(URIBackendConstants.base + URIBackendConstants.logOut);
    };    
    
    /**
     * Meldet den Benutzer an. Setzt Cookies mit Benutzerdaten.
     * Header des $http Providers wird das im Back-End erstellte Token zugewiesen.
     * Anschließend werden die Animationen der Applikationselemente (Header, Sidebar, ...usw.)
     * gesteuert (Einflug).
     * 
     * @param {object} data - Benutzerdaten
     */
    srv.setLoggedIn = function(data){
        $http.defaults.headers.common['TOKEN'] = data['token'];
        $cookieStore.put('token', data['token']);
        $cookieStore.put('username', data['username']);
        $cookieStore.put('user_id', data['user_id']);
        $cookieStore.put('user_role_id', data['user_role_id']);
        $cookieStore.put('mentor_image', data['mentor_image']);
        //$window.sessionStorage.token = data['token'];
        //$window.sessionStorage.username = data['username'];
        //$window.sessionStorage.mentor_image = data['mentor_image'];
        $rootScope.animationClassElements = 'animate_page_elements';
        this.setIsInSystem(500);
    };

    /**
     * Meldet Benutzer ab. Cookies werden geloescht.
     * Anschließend werden die Animationen der Applikationselemente (Header, Sidebar, ...usw.)
     * gesteuert (Ausflug).
     */    
    srv.setLoggedOut = function(){
        $cookieStore.remove('token');
        $cookieStore.remove('username');
        $cookieStore.remove('user_id');
        $cookieStore.remove('user_role_id');
        $cookieStore.remove('mentor_image');
        //delete $window.sessionStorage.token;
        //delete $window.sessionStorage.username;
        //delete $window.sessionStorage.mentor_image;
        $rootScope.animationClassElements = 'animate_page_elements';
        this.unsetIsInSystem(0);
    }; 
 
    /**
     * Steuert die Animationen des Anmeldeprozesses. Applikationselemente wie
     * Header, Sidebar, ...usw. werden angezeigt.
     */
    srv.setIsInSystem = function(time){
        $rootScope.contentClass = '';
        //$timeout(function(){
            //$rootScope.contentClass = 'in_system';
        //}, parseInt(time));
        $rootScope.showHeader = true;
        if($cookieStore.get('user_role_id') > 0){
            $rootScope.showMentor = true;
            $rootScope.showMentorTooltip = true;
            $rootScope.showSidebar = true;
            $rootScope.contentClass = '';
        } else {
            $rootScope.contentClass = 'main-content-admin';
        }
        
    };
    
    /**
     * Steuert die Animationen des Abmeldeprozesses. Applikationselemente wie
     * Header, Sidebar, ...usw. werden ausgeblendet.
     */    
    srv.unsetIsInSystem = function(time){
        $rootScope.contentClass = '';
        //$timeout(function(){
            //$rootScope.contentClass = '';
        //}, parseInt(time));
        $rootScope.showHeader = false;
        $rootScope.showMentor = false;
        $rootScope.showMentorTooltip = false;
        $rootScope.showSidebar = false;
    };
    
    return srv;
});