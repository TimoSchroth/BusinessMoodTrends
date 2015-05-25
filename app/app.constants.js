/* Konstante: Referenz zur Firebase Datenbank
 */
bmtApp.constant('FirebaseConstant', {
    url: 'https://bmt.firebaseio.com/'
});

/* Konstante: Name und URL der ANvigationselemente
 */
bmtApp.constant('NavigationConstants', [
    {name: 'Dashboard', url: 'dashboard'},
    {name: 'Voting', url: 'voting'},
    {name: 'Zitatenliste', url: 'quotelist'},
    {name: 'Smileyliste', url: 'smileylist'},
    {name: 'Punkteliste', url: 'creditslist'}
]);

/* Konstante: Pfade zu den assets Ordnern (Bilder)
 */
bmtApp.constant('URIAssetsConstants', {
    baseImgMentors: './assets/img/mentoren/',
    baseImgMoods: './assets/img/moods/',
    baseImgSmilies: './assets/img/smilies/',
    imgMentorsPlaceholder: 'mentor_placeholder.png'
});

/* Konstante: Pfade zu den Applikationselementen
 * -shared: Applikationselemente fuer den allgemeinen Aufbau der Applikation
 * -components: Applikationselemente der einzelnen Routen
 */
bmtApp.constant('URIViewConstants', {
    shared: 'app/shared/',
    components: 'app/components/'
});

/* Konstante: URLs der einzelnen Routen
 */
bmtApp.constant('URILocationConstants', {
    base: '/',
    logIn: '/login',
    logOut: '/logout',
    signUp: '/signup',
    dashboard: '/dashboard',
    admin: '/admin'
});

/* Konstante: URLs zum Back-End
 */
bmtApp.constant('URIBackendConstants', {
    base: 'http://bmt.onedev.de/backend/',
    ping: 'system/ping/',
    logIn: 'login/login_user/',
    logOut: 'system/logout_user/',
    signUp: 'signup/signup_user/',
    getTotalQuotes: 'dashboard/get_total_quotes/',
    getTotalSmilies: 'dashboard/get_total_smilies/',
    getTotalBonuscredits: 'dashboard/get_total_bonuscredits',
    getRandomMentorImg: 'signup/get_random_mentor_img/',
    getStatisticSelectedDay: 'dashboard/get_statistic_selected_day/',
    getStatisticWeekRange: 'dashboard/get_statistic_week_range/',
    vote: 'voting/vote/',
    getRandomQuote: 'voting/get_random_quote/',
    setBonusCredit: 'voting/set_bonus_credit/',
    getRandomSmiley: 'voting/get_random_smiley/',
    getQuoteList: 'quote_list/get_quote_list/',
    getSmileyList: 'smiley_list/get_smiley_list/',
    getTotalVotesToday: 'voting/get_total_votes_today/',
    getCreditsList: 'credits_list/get_credits_list/',
    getUserList: 'system/get_user_list/',
    getAdminStatisticSelectedDay: 'admin/get_statistic_selected_day/',
    getAdminStatisticWeekRange: 'admin/get_statistic_week_range/'
});

/* Konstante: Werte der Gemuetszustaende fuer die Skala (Smilies)
 */
bmtApp.constant('MoodValueConstants', [
    {name:'-3', moodValue:-3, class:'first_element'},
    {name:'-2', moodValue:-2, class:''},
    {name:'-1', moodValue:-1, class:''},
    {name:'1', moodValue:1, class:''},
    {name:'2', moodValue:2, class:''},
    {name:'3', moodValue:3, class:''}
]);

/* Konstante: Bezeichnungen fuer die Direktive votingVote
 */
bmtApp.constant('VotingLabels',{
    labelBad: 'schlecht',
    labelGood: 'gut',
    totalVotesToday: '. Voting am ',
    dayGoal: 'Tagesziel erreicht.'
});

/* Konstante: Bezeichnungen fuer die Route /#/dashboard
 */
bmtApp.constant('DashboardLabels',{
    quotes: 'Gesammelte<br>Zitate',
    smilies: 'Gesammelte<br>Smilies',
    bonuscredits: 'Gesammelte<br>Bonuspunkte'
});

/* Wert: Dynamsiche Bezeichnungen für das Liniendiagram
 */
bmtApp.value('ChartMsgs', {
    noData: {
        msg : function(){
            return 'Keine Daten vorhanden.';
        }
    },    
    day: {
        msg_val: [0],
        msg : function(){
            return 'Tagsestatistik am ' + this.msg_val[0];
        }
    },
    week: {
        msg_val: [0, 0],
        msg : function(){
            return 'Wochenstatistik von ' + this.msg_val[0] + ' bis ' + this.msg_val[1];
        }
    }    
});

/* Konstante: Bezeichnungen/Nachrichten für Nachrichten des Systems (Fehlermeldung)
 */
bmtApp.constant('AlertMsgs', {
    
    type :{
        error: 'danger',
        success: 'success'
    },
    logInSuccess:{
        type: 'success',
        msg: 'Du hast dich erfolgreich angemeldet.'
    },
    logOutSuccess:{
        type: 'success',
        msg: 'Du hast dich erfolgreich abgemeldet.'
    },
    logInNameEmpty:{
        type: 'danger',
        msg: 'Name ist erforderlich.'
    },
    logInPasswordEmpty:{
        type: 'danger',
        msg: 'Passwort ist erforderlich.'
    },
    logInWrongCredentials:{
        type: 'danger',
        msg: 'Mentor-Name oder Passwort falsch.'
    },
    signUpNoRandomImg:{
        type: 'danger',
        msg: 'Es konnte kein Mentor-Bild ermittelt werden.'
    },
    signUpNameEmpty:{
        type: 'danger',
        msg: 'Name ist erforderlich.'
    },
    signUpPasswordEmpty:{
        type: 'danger',
        msg: 'Passwort ist erforderlich.'
    },
    signUpPasswordRetypeEmpty:{
        type: 'danger',
        msg: 'Passwortwiederholung ist erforderlich.'
    },
    signUpGenderEmpty:{
        type: 'danger',
        msg: 'Geschlecht ist erforderlich.'
    },
    signUpMentorImgEmpty:{
        type: 'danger',
        msg: 'Aussehen des Mentors ist erforderlich.'
    },
    signUpNoSignUp:{
        type: 'danger',
        msg: 'Account konnte nicht angelegt werden.'
    },
    signUpSuccess:{
        type: 'success',
        msg: 'Dein Mentor wurde angelegt. Du kannst dich jetzt anmelden.'
    },
    dashboardNoQuotes:{
        type: 'danger',
        msg: 'Zitate konnten nicht ermittelt werden.'
    },
    dashboardNoSmilies:{
        type: 'danger',
        msg: 'Smilies konnten nicht ermittelt werden.'
    },
    dashboardNoBonuscredits:{
        type: 'danger',
        msg: 'Bonuspunkte konnten nicht ermittelt werden.'
    },
    dashboardNoData:{
        type: 'danger',
        msg: 'Keine Daten vorhanden.'
    },
    votingError:{
        type: 'danger',
        msg: 'Voting fehlgeschalgen.'
    },
    randomQuoteError:{
        type: 'danger',
        msg: 'Zitat konnte nicht ermittelt werden.'
    },
    randomSmileyError:{
        type: 'danger',
        msg: 'Smiley konnte nicht ermittelt werden.'
    },
    quoteListError:{
        type: 'danger',
        msg: 'Zitate konnten nicht ermittelt werden.'
    },
    smileyListError:{
        type: 'danger',
        msg: 'Smilies konnten nicht ermittelt werden.'
    },
    creditsListError:{
        type: 'danger',
        msg: 'Punkte konnten nicht ermittelt werden.'
    },
    noRankingError:{
        type: 'danger',
        msg: 'Platzierungen konnten nicht ermittelt werden.'
    }
    
});

/* Wert: Dynamsische Nachrichten des Tooltips
 */
bmtApp.value('MentorMsgs', {
    init:{
        msg: function(){
            return "Hallo";
        }
    },
    dashboard:{
        msg_val: [''],
        msg: function() {
            return 'Hallo <span>' + this.msg_val[0] + '</span>. Unter dem  Punkt <b>Voting</b> kannst Du mir deinen Gemütszustand mitteilen.';
        }
    },
    voting:{
        msg: function() {
            return 'Wie fühlst Du dich gerade?';
        }
    },
    firstVote:{
        msg: function() {
            return 'Dein erster Vote, super! Noch zwei Votes und du hast dein Tagesziel erreicht.';
        }
    },
    secondVote:{
        msg: function() {
            return 'Zweiter Vote, sehr gut! Den Bonuspunkt hast Du dir verdient.';
        }
    },
    thirdVote:{
        msg: function() {
            return 'Nicht schlecht, du bist sehr fleißig. Dafür bekommst du einen Smiley.';
        }
    },   
    quoteList:{
        msg_val: [0],
        msg: function() {
            return 'Du besitzt <span>' + this.msg_val[0] + '</span> Zitate. Für jeden 1. Vote bekommst du ein Zitat.';
        }
    },   
    smileyList:{
        msg_val: [0],
        msg: function() {
            return 'Du hast <span>' + this.msg_val[0] + '</span> Smilies gesammelt. Für jeden 3. Vote bekommst du einen Smiley.';
        }
    },
    creditsList:{
        msg_val: [0],
        msg: function() {
            return 'Du hast <span>' + this.msg_val[0] + '</span> Punkte gesammelt. Für jeden 2. Vote bekommst du einen Bonuspunkt.';
        }
    },    
    dayGoal:{
        msg: function() {
            return 'Super! 3 Votes, Du hast heute dein Tagesziel erreicht.';
        }
    } 
});


