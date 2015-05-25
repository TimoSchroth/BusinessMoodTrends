/**
 * SystemMentorTooltipService
 * 
 * @param {service} $rootScope - verwaltet den Zugriff auf alle Scopes.
 * @param {value} MentorMsgs - beinhaltet alle Nachrichten fuer das Tooltip
 */
bmtApp.factory('SystemMentorTooltipService', function($rootScope, MentorMsgs){
        var srv = {};
        $rootScope.mentor = {};
        
        /**
         * Setzt die dynamischen Nachrichten des Tooltips.
         * Einzelne Nachrichten koennen dynamische Werte haben wie:
         * "Du bist schon {{20}} Zitate"
         * Diese werden entsprechend gesetzt und dem Tooltip zugewiesen.
         * 
         * @param {String} typ - Key der die Nachricht enthaelt
         * @param {array} data - dynamischen Werte der Nachricht
         * @returns {undefined}
         */
        srv.setMentorTooltip = function(type, data){
            for (var i = 0; i < data.length; i++) {
                MentorMsgs[type]['msg_val'][i] = data[i];
            }
            $rootScope.mentor.toolTip = "\"" + MentorMsgs[type].msg() + "\"";
        };
        
        srv.setInitMentorTooltip = function(){
            $rootScope.mentor.toolTip = MentorMsgs.init.msg();
        };        
        
        return srv;
});