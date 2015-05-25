/**
 * AdminController
 * 
 * @param {service} $cookieStore - Zur Verwaltung der Cookies.
 * @param {service} $scope - ViewModel fuer die Datenbindung.
 * @param {filter} $filter - Filter für die Datumsform.
 * @param {service} LoginService - verwaltet die Authentifizierung.
 * @param {service} AdminService - verwaltet die Darstellung des Liniendiagramms.
 * @param {constant} AlertMsgs - beinhaltet alle Fehlermeldungen.
 * @param {constant} URILocationConstants - beinhaltet alle URLs der Routen.
 * @param {service} AlertsService - verwaltet die Warnmeldungen. 
 */
bmtApp.controller('AdminController',  function($cookieStore, $scope, $filter, 
                                               LoginService, AdminService, AlertMsgs, 
                                               URILocationConstants, AlertsService){
    /* Sollte die Route direkt aufgerufen werden oder das Browserfenster manuell
     * neugeladen werden, wird das System erneut auf 'angemeldet' gesetzt, damit
     * die Animationen nicht neu abgespielt werden.
     */
    LoginService.setIsInSystem(0);
    
    /* Ist der Benutzer kein Administrator, wird dieser zum Dashboard weiter-
     * geleitet.
     */
    if($cookieStore.get('user_role_id') > 0){
        $location.url(URILocationConstants.dashboard).replace();
    }       
   
    /**
     * Ermittelt anhand eines Tages die Statistikdaten und legt die Darstellung
     * des Liniendiagramms damit fest. (Mit Berechnung des Durchschnitts der Daten)
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
        AdminService.getStatisticSelectedDay(date)
            .success(function(data){
                if(data['success']){
                    if(data['statistic'].length > 0){
                        $scope.chartMsg = AdminService.getChartMsg('day', [$filter('date')($scope.dt, 'dd.MM.yyyy')]);
                        console.log(data['statistic']);
                        globalData = AdminService.calcGlobalDataDay(data['statistic']);
                        $scope.xAxisTickValuesFunction = function() { return AdminService.xAxisTickValues(globalData); };
                        $scope.xAxisTickFormatFunction = function() { return AdminService.xAxisTickFormatDay(globalData); }; 
                        $scope.chartData = AdminService.getStatisticFormatDay(globalData, date);
                    } else {
                        $scope.chartMsg = AdminService.getChartMsg('noData', []);
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
        
        start_week = AdminService.getPastDate(start, 'yyyy-MM-dd');
        end_week = AdminService.getPastDate(end, 'yyyy-MM-dd');
        date_from = AdminService.getPastDate(start, 'dd.MM.yyyy');
        date_to = AdminService.getPastDate(end, 'dd.MM.yyyy');
        AdminService.getStatisticWeek(start_week, end_week)
            .success(function(data){
                if(data['success']){
                    if(data['statistic'].length > 0){
                        $scope.chartMsg = AdminService.getChartMsg('week', [date_from, date_to]);
                        globalData = AdminService.calcGlobalDataWeek(data['statistic']);
                        $scope.xAxisTickValuesFunction = function() { return AdminService.xAxisTickValues([]); };
                        $scope.xAxisTickFormatFunction = function() { return AdminService.xAxisTickFormatWeek(); };
                        $scope.chartData = AdminService.getStatisticFormatWeek(globalData);
                    } else {
                        $scope.chartMsg = AdminService.getChartMsg('noData', []) + " " + date_from + " " + date_to;
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
    $scope.statisticWeekRange(13, 6);

    /**
     * Setzt das Format fuer die X-Achse
     */
    $scope.yAxisTickFormatFunction = function(){
        return AdminService.yAxisTickValues();
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