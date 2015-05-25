/**
 * Erstellt eine bidirektionale Verbindung zum Onlinedienst Firebase
 * 
 * @param {constant} FirebaseConstant - beinhaltet die Zugangsdaten zur Firebase-Datenbank
 * @param {service} $firebase - AngularJS Service fuer die Verwaltung von Firebasedaten
 * @param {service} $cookieStore - Verwaltung von Cookies
 */
bmtApp.factory('FirebaseService', function(FirebaseConstant, $firebase, $cookieStore){
    srv = {
    };
    
    /* Erstellt eine neue Referenz zum Onlinedienst Firebase 
     */
    ref = new Firebase(FirebaseConstant.url);
    /* AngularJS-Applikation wird mit der Firebase-Datenbank synchronisiert.
     */
    sync = $firebase(ref);
    
    /**
     * Liefert die Firebasedaten in Form eines Objektes
     * @returns {unresolved}
     */
    srv.getFirebaseData = function(){
        return sync.$asObject();
    };
    
    /**
     * Ermittelt die Gesamtpunktzahl eines Benutzers anhand der gespeicherten
     * ID im Cookie.
     * Hierfuer wird aus einer Liste von Punktestaenden der entsprechende User
     * gesucht.
     * 
     * @param {array} creditsList - Benutzerliste mit Punktestaenden
     * @returns {Number} Gesamtpunktzahl eines Benutzers
     */
    srv.getTotalCredits = function(creditsList){
        var totalCredits = 0;
        if(creditsList[$cookieStore.get('user_id')] != undefined){
            totalCredits = creditsList[$cookieStore.get('user_id')].credits;
        }
        return totalCredits;
    };    
    
    /**
     * Erhoeht die Punktzahl eines Benutzers
     * 
     * @param {number} credits - Anzahl der zu erhoehenden Punkte
     * @returns {undefined}
     */
    srv.setCredits = function(credits){
        console.log(credits);
        /* Daten werden von Firebase in Form eines Objects ermittelt 
         */
        data = this.getFirebaseData();
        /* Callback-Funktion die aufgerufen wird, sobald alle Daten der Firebase-Datenbank
         * geladen sind
         */
        data.$loaded()
            .then(function(data) {
                var ui = $cookieStore.get('user_id');
                /* Ist ein Benutzer in dem Objekt enthalten, wird der Benutzer angesprochen.
                 * Andernfalls wird eine neue Referenz mit der ID des Benutzers
                 * und den uebermittelten Punkten erstellt.
                 */
                if(data[ui] != undefined){
                    /* Punktestand des Benutzers wird erhoeht.
                     */
                    data[ui].credits = parseInt(data[ui].credits) + credits;
                    /* Neue Punktestand wird gespeichert und der Firebase-Datenbank mitgeteilt.
                     */
                    data.$save().then(function(ref) {
                    }, function(error) {
                        console.log("Firebase Error:", error);
                    }); 
                    console.log(data[$cookieStore.get('user_id')].credits);
                } else {
                    /* Neue Referenz wird mit Benutzer-ID erstellt.
                     */
                    data[ui] = {credits: parseInt(credits)};
                    /* Neue Referenz wird gespeichert und der Firebase-Datenbank mitgeteilt.
                     */                    
                    data.$save().then(function(ref) {
                    }, function(error) {
                        console.log("Firebase Error:", error);
                    }); 
                }
            })
            .catch(function(error) {
                console.error("Firebase Error:", error);
            });

    };
    
    /**
     * Vereinigt die Benutzerliste aus dem Back-End mit der Punktestandliste
     * der Firebase-Datenbank und liefert diese zurueck.
     * 
     * @param {array} userList - Benutzerliste vom Back-End
     * @param {object} creditsList - Paunkteliste der Firebase-Datenbank
     * @returns {newUserList|Array} - Vereinigte Liste mit Benutzers und zugehoerigen Punktestaenden
     */
    srv.getFormatedUserList = function(userList, creditsList){
        newUserList = [];
        for(i = 0; i < userList.length; i++){
            credits = 0;
            if(creditsList[userList[i].user_id] != undefined){
                credits = creditsList[userList[i].user_id].credits;
            }
            newUserList.push({
                username: userList[i].username,
                image: userList[i].image,
                credits: credits
            });
        }
        return newUserList;
    };
    
    return srv;
    
});