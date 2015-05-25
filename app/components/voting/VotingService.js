/**
 * VotingService
 * 
 * Verwaltet das Voting
 * 
 * @param {service} $http - verwaltet die AJAX-Aufrufe fuer http-Anfragen.
 * @param {service} $sce - Strict Contextual Escaping. Erlaubt HTML in Scopes zu verwenden.
 * @param {constant} URIBackendConstants - beinhaltet alle URLs des Back-Ends.
 * @param {service} FirebaseService - verwaltet den Zugriff auf den Onlinedienst Firebase
 * @param {service} SystemMentorTooltipService - verwaltet die Nachrichten des Tooltips.
 * @param {constant} URIAssetsConstants - beinhaltet alle URLs der Bibliotheken, Bilder, CSS-Dateien, ...usw. 
 * @param {value} AlertMsgs - Beinhaltet alle dynamischen Nachrichten der Warnmeldungen.
 * @param {service} AlertsService - verwaltet die Warnmeldungen.
 */
bmtApp.factory('VotingService', function($http, $sce, URIBackendConstants, 
                                         FirebaseService, SystemMentorTooltipService, 
                                         URIAssetsConstants, AlertsService, AlertMsgs){
    var srv = {
        /* Steuert die Ein- Ausblendung der Direktiven.
         */
        votingActions: {
            votingVote: true,
            votingQuote: false,
            votingCredit: false,
            votingSmiley: false            
        },
        /* Weist den Direktiven die noetigen Daten zu.
         */
        votingValues: {
            votingQuote: {
                text: '',
                author: ''
            },
            votingCredit: {
                credit1: true,
                credit2: false
            },
            votingSmiley: {
                url: ''
            }
        }
    };
    
    /**
     * Ermittelt ein zufaelliges Zitat (Author und Zitattext)
     * @returns {unresolved}
     */
    getRandomQuote = function(){
        return $http.post(URIBackendConstants.base + URIBackendConstants.getRandomQuote);
    };
    
    /**
     * Setzt 2 Punkte fuer das Back-End (Fallback fuer Firebase)
     * @returns {unresolved}
     */
    setBonusCredit = function(){
        return $http.post(URIBackendConstants.base + URIBackendConstants.setBonusCredit);
    };
    
    /**
     * Ermittelt eine zufaellige URL eines Smilies
     * @returns {unresolved}
     */
    getRandomSmiley = function(){
        return $http.post(URIBackendConstants.base + URIBackendConstants.getRandomSmiley);
    };
    
    /**
     * Je nach abgegebenen Vote wird anhand der Variable votingNumber entschieden,
     * welche Direktive nach dem Vote eingeblendet werden soll.
     * Sobald das entsprechende Sammelobjekt ermittelt wurde, wird ueber die Firebase-Datenbank
     * ein bzw. zwei Punkt(e) fuer den Benutzer gesetzt.
     * Anschließend ehraehlt das Tooltip eine passende Nachricht.
     * Weiterhin werden der Direktive die noetigen Daten fuer die Darstellung uebermittelt.
     * Sind alle Operationen durchgefuehrt, wird die entsprechende Direktive ueber
     * votingActions angezeigt.
     * 
     * @param {type} votingNumber
     * @returns {undefined}
     */
    srv.setVotingAction = function(votingNumber){
        votingNumber = parseInt(votingNumber);
        this.votingActions.votingVote = false;
        if(votingNumber === 1){
            getRandomQuote()
                .success(function(data){
                    console.log(data['success']);
                    if(data['success']){
                        console.log("FIREBASE");
                        FirebaseService.setCredits(1);
                        SystemMentorTooltipService.setMentorTooltip("firstVote", {});
                        srv.votingValues.votingQuote.text = $sce.trustAsHtml(data['quote_text']);
                        srv.votingValues.votingQuote.author = $sce.trustAsHtml(data['quote_author']);
                        srv.votingActions.votingQuote = true;
                    } else {
                        
                        AlertsService.generateAlert(AlertMsgs.randomQuoteError.type, AlertMsgs.randomQuoteError.msg + " " + data['msg']);
                    }
                })
                .error(function(data){
                    AlertsService.generateAlert(AlertMsgs.randomQuoteError.type, AlertMsgs.randomQuoteError.msg + " " + data['msg']);
                });
        } else if(votingNumber === 2){
            srv.votingValues.votingCredit.credit2 = false;
            setBonusCredit()
                .success(function(data){
                    if(data['success']){
                        console.log("FIREBASE");
                        FirebaseService.setCredits(2);
                        SystemMentorTooltipService.setMentorTooltip("secondVote", {});
                        srv.votingActions.votingCredit = true;
                        srv.votingValues.votingCredit.credit2 = true;
                    } else {
                        AlertsService.generateAlert(AlertMsgs.randomQuoteError.type, AlertMsgs.randomQuoteError.msg + " " + data['msg']);
                    }
                })
                .error(function(data){
                    AlertsService.generateAlert(AlertMsgs.randomQuoteError.type, AlertMsgs.randomQuoteError.msg + " " + data['msg']);
                });
        } else if(votingNumber === 3){
            getRandomSmiley()
                .success(function(data){
                    if(data['success']){
                        console.log("FIREBASE");
                        FirebaseService.setCredits(1);
                        SystemMentorTooltipService.setMentorTooltip("thirdVote", {});
                        srv.votingValues.votingSmiley.url = URIAssetsConstants.baseImgSmilies + data['url'];
                        srv.votingActions.votingSmiley = true;
                    } else {
                        AlertsService.generateAlert(AlertMsgs.randomSmileyError.type, AlertMsgs.randomSmileyError + " " + data['msg']);
                    }
                })
                .error(function(data){
                    AlertsService.generateAlert(AlertMsgs.randomSmileyError.type, AlertMsgs.randomSmileyError + " " + data['msg']);
                });            
            
        }
    };

    return srv;
});


