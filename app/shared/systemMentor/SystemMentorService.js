/**
 * SystemMentorService
 * 
 * @param {service} $rootScope - verwaltet den Zugriff auf alle Scopes.
 * @param {service} $window - verwaltet den Zugriff auf das Browsersfenster.
 * @param {constant} URIAssetsConstants - beinhaltet alle URLs der Bibliotheken, Bilder, CSS-Dateien, ...usw. 
 * @param {service} $cookieStore - verwaltet die Cookies
 */
bmtApp.factory('SystemMentorService', function($rootScope, $window, $cookieStore, URIAssetsConstants){
        var srv = {};
        $rootScope.mentor = {};
        
        /**
         * Ist ein Benutzer vorhanden, wird sein zugehoeroges Bild geliefert.
         * Andernfalls liefert die Funktion einen Platzhalter
         * 
         * @returns {URIAssetsConstants.imgMentorsPlaceholder|String|URIAssetsConstants.baseImgMentors}
         */
        srv.setMentorImage = function(){
            var mentorImage = "";
            if($cookieStore.get('username') != null){
                mentorImage = URIAssetsConstants.baseImgMentors + $cookieStore.get('mentor_image');
            } else {
                mentorImage = URIAssetsConstants.baseImgMentors + URIAssetsConstants.imgMentorsPlaceholder;
            }   
            return mentorImage;
        };
        
        return srv;
});