/**
 * DashboardController
 * 
 * @param {service} $window - verwaltet den Zugriff auf das Browsersfenster.
 * @param {service} $cookieStore - verwaltet den Zugriff auf die Cookies.
 * @param {service} $scope - verwaltet den Zugriff auf die View (Datenbindung - ViewModel).
 * @param {filter} $filter - Filter für die Datumsform.
 * @param {service} $sce - Strict Contextual Escaping. Erlaubt HTML in Scopes zu verwenden.
 * @param {service} DashboardService - verwaltet die Daten des Dashbaords.
 * @param {constant} AlertMsgs - beinhaltet alle Fehlermeldungen.
 * @param {service} SystemMentorTooltipService - verwaltet die Nachrichten des Tooltips.
 * @param {service} AlertsService - verwaltet die Warnmeldungen.
 * @param {constant} DashboardLabels - beinhaltet die Bezeichnungen für die Daten des Dashboards.
 */
bmtApp.controller('DashboardController',  function($window, $cookieStore, $scope, 
                                                   $filter, $sce, LoginService, 
                                                   DashboardService, AlertMsgs, 
                                                   SystemMentorTooltipService, 
                                                   AlertsService, DashboardLabels){
    /* Sollte die Route direkt aufgerufen werden oder das Browserfenster manuell
     * neugeladen werden, wird das System erneut auf 'angemeldet' gesetzt, damit
     * die Animationen nicht neu abgespielt werden.
     */
    LoginService.setIsInSystem(0);

    /* Nachricht des Tooltips wird fuer das Dashboard gesetzt.
     */
    SystemMentorTooltipService.setMentorTooltip("dashboard", [$cookieStore.get('username')]);    
    
    /* Bschriftungen fuer die Dashboarddaten werden gesetzt. Die Beschriftungen
     * beinhalten HTML-Befehle. Mit der Funktion trustAsHtml() wird AngularJS
     * mitgeteilt, dass die Texte als HTML behandelt werden sollen.
     */
    $scope.labels = {
        quotesLabel : $sce.trustAsHtml(DashboardLabels.quotes),
        smiliesLabel : $sce.trustAsHtml(DashboardLabels.smilies),
        bonuscreditsLabel : $sce.trustAsHtml(DashboardLabels.bonuscredits)        
    };
    
    /* Ermittelt die Anzahl der gesammelten Zitate und weist Sie der View
     * ueber einen Scope zu.
     */
    DashboardService.getTotalQuotes()
        .success(function(data){
            if(data['success']){
                $scope.totalQuotes = data['total_quotes'];
            } else {
                AlertsService.generateAlert(AlertMsgs.dashboardNoQuotes.type, AlertMsgs.dashboardNoQuotes.msg + " " + data['msg']);
            }
        })
        .error(function(data){
            AlertsService.generateAlert(AlertMsgs.dashboardNoQuotes.type, AlertMsgs.dashboardNoQuotes.msg + " " + data['msg']);
        });

    /* Ermittelt die Anzahl der gesammelten Smilies und weist Sie der View
     * ueber einen Scope zu.
     */
    DashboardService.getTotalSmilies()
        .success(function(data){
            if(data['success']){
                $scope.totalSmilies = data['total_smilies'];
            } else {
                AlertsService.generateAlert(AlertMsgs.dashbaordNoSmilies.type, AlertMsgs.dashbaordNoSmilies.msg + " " + data['msg']);
            }
        })
        .error(function(data){
            AlertsService.generateAlert(AlertMsgs.dashbaordNoSmilies.type, AlertMsgs.dashbaordNoSmilies.msg + " " + data['msg']);
        });

    /* Ermittelt die Anzahl der gesammelten Bonuspunkte und weist Sie der View
     * ueber einen Scope zu.
     */
    DashboardService.getTotalBonuscredits()
        .success(function(data){
            if(data['success']){
                $scope.totalBonuscredits = data['total_bonuscredits'];
            } else {
                AlertsService.generateAlert(AlertMsgs.dashboardNoBonuscredits.type, AlertMsgs.dashboardNoBonuscredits.msg + " " + data['msg']);
            }
        })
        .error(function(data){
            AlertsService.generateAlert(AlertMsgs.dashboardNoBonuscredits.type, AlertMsgs.dashboardNoBonuscredits.msg + " " + data['msg']);
        });        

    /**
     * Ermittelt anhand eines Tages die Statistikdaten und legt die Darstellung
     * des Liniendiagramms damit fest.
     * 
     * Zunächst wird der gewählte Tag ermittelt.
     * Anschließend wird ein AJAX-Aufruf im Service AmindService mit dem ermittelten
     * Datum durchgeführt.
     * Ist die Antwort erfolgreich, wird zunaechst die dynamische Diagram Beschriftung gesetzt.
     * Danach werden die ermittelten Daten der Datenbank sortiert.
     * Anhand der sortierten Daten Werden die Werte und das Format der X-Achse gesetzt.
     * Als letztes werden die, fuer das Diagram formatierten Daten, dem Diagram zugewiesen.
     */
    $scope.statisticSelectedDay = function(){
        var date = $filter('date')($scope.dt, $scope.format);      
        DashboardService.getStatisticSelectedDay(date)
            .success(function(data){
                if(data['success']){
                    if(data['statistic'].length > 0){
                        $scope.chartMsg = DashboardService.getChartMsg('day', [$filter('date')($scope.dt, 'dd.MM.yyyy')]);
                        $scope.xAxisTickValuesFunction = function() { return DashboardService.xAxisTickValues(data['statistic']); };
                        $scope.xAxisTickFormatFunction = function() { return DashboardService.xAxisTickFormatDay(data['statistic']); }; 
                        $scope.chartData = DashboardService.getStatisticFormatDay(data['statistic'], date);
                    } else {
                        $scope.chartMsg = DashboardService.getChartMsg('noData', []);
                    }
                } else {
                    AlertsService.generateAlert(AlertMsgs.dashboardNoData.type, AlertMsgs.dashboardNoData.msg + " " + data['msg']);
                }
            })
            .error(function(data){
                AlertsService.generateAlert(AlertMsgs.dashboardNoData.type, AlertMsgs.dashboardNoData.msg + " " + data['msg']);
            });
    };

    /**
     * Analog zu statisticSelectedDay() nur als Wochenansicht.
     * 
     * @param {number} - Tage in denen das Startdatum zurueckliegt.
     * @param {number} - Tage in denen das Enddatum zurueckliegt.
     */
    $scope.statisticWeekRange = function(start, end){
        
        start_week = DashboardService.getPastDate(start, 'yyyy-MM-dd');
        end_week = DashboardService.getPastDate(end, 'yyyy-MM-dd');
        
        DashboardService.getStatisticWeek(start_week, end_week)
            .success(function(data){
                if(data['success']){
                    if(data['statistic'].length > 0){
                        console.log(data);
                        date_from = DashboardService.getPastDate(start, 'dd.MM.yyyy');
                        date_to = DashboardService.getPastDate(end, 'dd.MM.yyyy');
                        $scope.chartMsg = DashboardService.getChartMsg('week', [date_from, date_to]);
                        $scope.xAxisTickValuesFunction = function() { return DashboardService.xAxisTickValues([]); };
                        $scope.xAxisTickFormatFunction = function() { return DashboardService.xAxisTickFormatWeek(); };
                        $scope.chartData = DashboardService.getStatisticFormatWeek(data['statistic']);
                    } else {
                        $scope.chartMsg = DashboardService.getChartMsg('noData', []);
                    }
                } else {
                    AlertsService.generateAlert(AlertMsgs.dashboardNoData.type, AlertMsgs.dashboardNoData.msg + " " + data['msg']);
                }
            })
            .error(function(data){
                AlertsService.generateAlert(AlertMsgs.dashboardNoData.type, AlertMsgs.dashboardNoData.msg + " " + data['msg']);
        });     
    };  
    
    /**
     * Setzt eine initiale Ansicht fuer das Diagram (letzte Woche).
     */
    $scope.statisticWeekRange(6, 0);

    /**
     * Setzt das Format fuer die X-Achse
     */
    $scope.yAxisTickFormatFunction = function(){
        return DashboardService.yAxisTickValues();
    };
 
    /**
     * Ermittelt das aktuelle Datum fuer den Datepicker. Damit die Kalenderanzeige
     * akteull ist.
     * 
     * @returns {undefined}
     */
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    /**
     * Beschreibt was passieren soll sobald der Kalender geoeffnet wird.
     * Defaultoptions fuer die Anzeige und setzt Kalender auf 'opened'.
     * 
     * @param {type} $event
     * @returns {undefined}
     */    
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    /**
     * Setzt die initialen Werte des Kalenders
     */
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    /**
     * Format fuer den Kalender
     */
    $scope.format = 'yyyy-MM-dd';    
    
});