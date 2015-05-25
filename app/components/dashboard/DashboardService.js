/**
 * DashboardService
 * 
 * @param {provider} $http - Wird fuer die AJAX-Aufrufe verwendet.
 * @param {filter} $filter - Wird fuer die Umwandlung eines Datums verwendet.
 * @param {contstant} URIBackendConstants - Beinhaltet alle URLs fuer das Back-End.
 * @param {value} ChartMsgs - Beinhaltet alle Bezeichnungen für das Liniendiagramm.
 */
bmtApp.factory('DashboardService', function($http, $filter, URIBackendConstants, ChartMsgs){
    var srv = {};

    /**
     * Setzt die dynamischen Nachrichten des Linendiagramms mit Werten.
     * 
     * @param {String} type - Welcher Typ Nachricht ermittelt werden soll.
     *                        (z.B. 'tag')
     * @param {Array} data  - Die zu setzenden Werte
     *                        (z.B. [0] = '24.09.2014')
     * @param {String} ChartMsgs.msg() - Die zusammengesetzte Nachricht
     *                                   (z.B. Tagestatisitk am 24.09.1986)
     */
    srv.getChartMsg = function(type, data){
            for (var i = 0; i < data.length; i++) {
                ChartMsgs[type]['msg_val'][i] = data[i];
            }
            return ChartMsgs[type].msg();
    };

    /**
     * Liefert ueber einen AJAX-Aufruf die Anzahl der gesammelten Zitate.
     * @returns {object}
     */
    srv.getTotalQuotes = function(){
        return $http.post(URIBackendConstants.base + URIBackendConstants.getTotalQuotes);
    };

    /**
     * Liefert ueber einen AJAX-Aufruf die Anzahl der gesammelten Smilies.
     * @returns {object}
     */
    srv.getTotalSmilies = function(){
        return $http.post(URIBackendConstants.base + URIBackendConstants.getTotalSmilies);
    };

    /**
     * Liefert ueber einen AJAX-Aufruf die Anzahl der gesammelten Bonuspunkte.
     * @returns {object}
     */
    srv.getTotalBonuscredits = function(){
        return $http.post(URIBackendConstants.base + URIBackendConstants.getTotalBonuscredits);
    };

    /**
     * Liefert ueber einen AJAX-Aufruf die abgegebenen Votes zu einem gewaehlten Tag.
     * Von dem aktuell angemeldeten Benutzer.
     * 
     * @param {MySQL Datum} date - Gewaehlter Tag
     * @returns {object} - Votes von einem bestimmten tag (Wert, Datum)
     */
    srv.getStatisticSelectedDay = function(date){
        var day = {day: date};
        return $http.post(URIBackendConstants.base + URIBackendConstants.getStatisticSelectedDay, day);
    };

    /**
     * Liefert ueber einen AJAX-Aufruf die abgegebenen Votes in einer bestimmten Woche.
     * Von dem aktuell angemeldeten Benutzer.
     * 
     * @param {MySQL Datum} week_start
     * @param {MySQL Datum} week_end
     * @returns {object} - Votes von einer Woche (Wert, Datum)
     */
    srv.getStatisticWeek = function(week_start, week_end){
        return $http.post(URIBackendConstants.base + URIBackendConstants.getStatisticWeekRange , {week_start: week_start, week_end: week_end});
    };  
 
    /**
     * Wandelt eine Liste von Votes eines gewaehlten Tages in ein leserliches Format fuer
     * die Liniendiagramm Direktive um.
     * 
     * @param {array} data - Liste mit Votes eines Tages (calcGlobalDataDay())
     * @param {type} date - Datum eines aktuellen Tages
     * @returns {array} - Array in einem leserlichen Format fuer Liniendiagram 
     */    
    srv.getStatisticFormatDay = function(data, date){
        var statisticFormat = [{
            key: 'Wohlbefinden am ' + date,
            values: []
        }];
        for(i = 0; i < data.length; i++){
            element = [(i+1), parseInt(data[i]['mood'])];
            statisticFormat[0]['values'].push(element);
        } 
        
        return statisticFormat;
        
    };

    /**
     * Wandelt eine Liste von Votes einer Woche in ein leserliches Format fuer
     * die Liniendiagramm Direktive um.
     * 
     * @param {array} data - Liste mit Votes einer Woche (calcGlobalDataWeek())
     * @returns {array} - Array in einem leserlichen Format fuer Liniendiagram 
     */      
    srv.getStatisticFormatWeek = function(data){
        var statisticFormatLastWeek = [];
    
        statisticValue = [];
        for(var i = 0; i < 7; i++){
            statisticValue[i] = {};
        }

        for(i = 0; i < data.length; i++){
            var time = new Date(data[i]['date']).getTime();
            var jsDate = new Date(data[i]['date']).toISOString();
            var weekDay = getWeekNumber($filter('date')(jsDate, 'EEEE'));
            var date = $filter('date')(jsDate, 'yyyy-MM-dd');
            if(Object.keys(statisticValue[weekDay]).length == 0){
                statisticValue[weekDay] = {'moods': [], date: date};
            }
            statisticValue[weekDay]['moods'][parseInt(time)] = parseInt(data[i]['mood']);
        } 
        
        for(i = 0; i < statisticValue.length; i++){
            var index = 0;
            for(key in statisticValue[i]['moods']){
                var chartValue = [];
                if(statisticFormatLastWeek[index] == undefined){
                    statisticFormatLastWeek[index] = {
                        key: (index + 1) + '. Vote',
                        values: []
                    };
                }
                chartValue[0] = i + 1;
                chartValue[1] = statisticValue[i]['moods'][key];

                statisticFormatLastWeek[index]['values'].push(chartValue);
                index = index + 1;
            }
        }
        
        return statisticFormatLastWeek; 
    };    

    /**
     * Funktion die eine Anzahl der Elemente der X-Achsenbeschriftung des Liniendiagramms bestimmt.
     * 7 fuer eine Wochenansicht und dynamisch fuer eine Tagesansicht.
     * 
     * @param {array} data - Anzahl der Werte die auf der X-Achse angezeigt werden.
     * @param {array} d - Aktuelle Anzahl der vorhandenen Punkte auf der X-Achse.
     * @returns {Function} - liefert die Funktion fuer die Berechnung.
     */    
    srv.xAxisTickValues = function(data){
        return function(d){
            
            var countTicks = 7;
            if(data.length > 1){
                countTicks = data.length;
            }
            
            tickVals = [];           
            for(i = 0; i < countTicks; i++){
                tickVals.push(i + 1);
            }

            return tickVals;
        };
    };

    /**
     * Funktion die eine Anzahl der Elemente der Y-Achsenbeschriftung des Liniendiagramms bestimmt.
     * Beschriftung wird mit einem Bild ausgetauscht (Smilies)
     * 
     * @param {array} d - Aktuelle Anzahl der vorhandenen Punkte auf der Y-Achse.
     * @returns {Function} - liefert die Funktion fuer die Berechnung.
     */ 
    srv.yAxisTickValues = function(){
        return function(d){
            var p = d3.select(this.parentNode);
            p.append("image")
            .attr({"xlink:href": "./assets/img/moods/mood_" + d + ".png",
                   "width": 31,
                   "height": 40,
                   "transform":"translate(-60, -21)",
                   "data-toggle": "tooltip",
                   "data-placement": "right",
                   "title": d
            });            
            
         return d;
        };
    };

    /**
     * Funktion, die die Beschriftung der X-Achse des Liniendiagramms eines Tages bestimmt.
     * Beschriftung fuer die Tagesansicht: 08:00, 13:12, ...usw.
     * 
     * @param {array} d - Aktuelle Anzahl der vorhandenen Punkte auf der X-Achse.
     * @returns {Function} - liefert die Funktion fuer die Beschriftung.
     */     
    srv.xAxisTickFormatDay = function(data){
        return function(d){
            jsDate = new Date(data[d-1]['date']).toISOString();
            return $filter('date')(jsDate, 'HH:mm'); 
        };
    };

    /**
     * Funktion, die die Beschriftung der X-Achse des Liniendiagramms einer Woche bestimmt.
     * Beschriftung fuer die Wochenansicht: Monta, Dienstag, ...usw.
     * 
     * @param {array} d - Aktuelle Anzahl der vorhandenen Punkte auf der X-Achse.
     * @returns {Function} - liefert die Funktion fuer die Beschriftung.
     */      
    srv.xAxisTickFormatWeek = function(){
        return function(d){
            var weekDay = "";
            if(d == 1){
                weekDay = "Montag";
            } else if(d == 2){
                weekDay = "Dienstag";
            } else if(d == 3){
                weekDay = "Mittwoch";
            } else if(d == 4){
                weekDay = "Donnerstag";
            } else if(d == 5){
                weekDay = "Freitag";
            } else if(d == 6){
                weekDay = "Samstag";
            } else if(d == 7){
                weekDay = "Sonntag";
            }
            return weekDay; 
        };
    };   

    /**
     * Liefert ein Datum aus der Vergangenheit anhand einer ubergebenen Zahl,
     * die die Anzahl der zurueckliegenden Tage repräsentiert.
     * 
     * Wird für die Wochenansicht verwendet (letzte Woche, diese Woche)
     * 
     * @param {type} days - Wieviel Tage das Datum in der Vergangenheit liegen soll.
     * @param {type} format - Format in das das Datum zurueck gegeben werden soll.
     * @returns {date} - Datum aus der Vergangenheit.
     */
    srv.getPastDate = function(days, format){
        var d = new Date();
        if(days != "today"){
            d.setTime(d.getTime() - (d.getDay() ? d.getDay() : 7) * 24 * 60 * 60 * 1000);
            d.setTime(d.getTime() - days * 24 * 60 * 60 * 1000);
        }
        
        return $filter('date')(d, format); 
    };

    /**
     * Liefert die Tageszahl anhand eines Wochentags.
     * 
     * @param {number} weekDay
     * @returns {Number}
     */
    getWeekNumber = function(weekDay){
        var weekNumber = 0;
        if(weekDay == 'Monday'){
            weekNumber = 0;
        } else if(weekDay == 'Tuesday'){
            weekNumber = 1;
        } else if(weekDay == 'Wednesday'){
            weekNumber = 2;
        } else if(weekDay == 'Thursday'){
            weekNumber = 3;
        } else if(weekDay == 'Friday'){
            weekNumber = 4;
        } else if(weekDay == 'Saturday'){
            weekNumber = 5;
        } else if(weekDay == 'Sunday'){
            weekNumber = 6;
        }
        
        return weekNumber;
    };

    return srv;
});