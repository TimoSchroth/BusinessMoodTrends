/* Service fuer den Admin-Bereich.
 * 
 * @param {provider} $http - Wird fuer die AJAX-Aufrufe verwendet.
 * @param {filter} $filter - Wird fuer die Umwandlung eines Datums verwendet.
 * @param {contstant} URIBackendConstants - Beinhaltet alle URLs fuer das Back-End.
 * @param {value} ChartMsgs - Beinhaltet alle Bezeichnungen für das Liniendiagramm.
 */
bmtApp.factory('AdminService', function($http, $filter, URIBackendConstants, ChartMsgs){
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
     * Liefert ueber einen AJAX-Aufruf die abgegebenen Votes zu einem gewaehlten Tag.
     * Von allen Benutzern
     * 
     * @param {MySQL Datum} date - Gewaehlter Tag
     * @returns {object} - Votes von einem bestimmten tag (Wert, Datum)
     */
    srv.getStatisticSelectedDay = function(date){
        var day = {day: date};
        return $http.post(URIBackendConstants.base + URIBackendConstants.getAdminStatisticSelectedDay, day);
    };

    /**
     * Liefert ueber einen AJAX-Aufruf die abgegebenen Votes in einer bestimmten Woche.
     * Von allen Benutzern
     * 
     * @param {MySQL Datum} week_start
     * @param {MySQL Datum} week_end
     * @returns {object} - Votes von einer Woche (Wert, Datum)
     */
    srv.getStatisticWeek = function(week_start, week_end){
        return $http.post(URIBackendConstants.base + URIBackendConstants.getAdminStatisticWeekRange , {week_start: week_start, week_end: week_end});
    };  
  
    /**
     * Berechnet fuer jeden Vote-Typ (1. Vote, 2. Vote, 3. Vote) eines gewaehlten
     * Tages den durchschnitt aus allen Benutzer Votes.
     * 
     * @param {array} data - Enthält eine Liste von Votes
     *                       mood_type: 1., 2., 3. Vote
     *                       date: Datum der Abgabe des Votes
     *                       mood: Wert des Votes (Gemuetszustand)
     * @returns {array} - mood: Durchschnitt eines Votes
     */
    srv.calcGlobalDataDay = function(data){
        var newData = [];
        
        for(var i = 0; i < data.length; i++){
            var nd = newData[data[i].mood_type - 1];
            if(typeof(nd) == 'undefined'){
                newData[data[i].mood_type - 1] = {mood: 0, total: 0, count: 0, voteLine: ''};
                nd = newData[data[i].mood_type - 1];
            }
            nd['total'] = parseInt(nd['total']) + parseInt(data[i]['mood']);
            nd['count'] = parseInt(nd['count']) + 1;
            nd['mood'] = nd['total'] / nd['count'];
            //nd['voteLine'] = nd['voteLine'] + "/" + data[i]['mood'];
        }
        
        return newData;
    };
    
    /**
     * Berechnet fuer jeden Vote-Typ (1. Vote, 2. Vote, 3. Vote) eine gewaehlten
     * Woche den durchschnitt aus allen Benutzer Votes.
     * 
     * @param {array} data - Enthält eine Liste von Votes
     *                       mood_type: 1., 2., 3. Vote
     *                       date: Datum der Abgabe des Votes
     *                       mood: Wert des Votes (Gemuetszustand)
     * @returns {array} - mood: Durchschnitt eines Votes
     */    
    srv.calcGlobalDataWeek = function(data){
        var newData = {};
        
        for(var i = 0; i < data.length; i++){
            var jsDate = new Date(data[i]['date']).toISOString();
            var date = $filter('date')(jsDate, 'yyyy-MM-dd');
            if(!(date in newData)){
                newData[date] = [];
            }
            var nd = newData[date][parseInt(data[i].mood_type - 1)];
            if(typeof(nd) == 'undefined'){
                newData[date][parseInt(data[i].mood_type - 1)] = {mood: 0, total: 0, count: 0, voteLine: ''};
                nd = newData[date][parseInt(data[i].mood_type - 1)];
            }
            nd['total'] = parseInt(nd['total']) + parseInt(data[i]['mood']);
            nd['count'] = parseInt(nd['count']) + 1;
            nd['mood'] = nd['total'] / nd['count'];
            nd['voteLine'] = nd['voteLine'] + "/" + data[i]['mood'];
        }
        console.log(newData);
        return newData;
    };    
    
    /**
     * Wandelt eine Liste aus calcGlobalDataDay() in ein leserliches Format fuer
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
            element = [(i+1), data[i]['mood']];
            statisticFormat[0]['values'].push(element);
        } 
        
        console.log(statisticFormat);
        
        return statisticFormat;
        
    };
    
    
    /**
     * Wandelt eine Liste aus calcGlobalDataWeek() in ein leserliches Format fuer
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

        for (var key in data) {
            var jsDate = new Date(key).toISOString();
            var weekDay = getWeekNumber($filter('date')(jsDate, 'EEEE'));
            
            var date = $filter('date')(jsDate, 'yyyy-MM-dd');
            statisticValue[weekDay] = {'moods': [], date: date};
            statisticValue[weekDay]['moods'] = [];
            for(var i = 0; i < data[key].length; i++){
                statisticValue[weekDay]['moods'].push(parseFloat(data[key][i]['mood']));
            }
            
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
     * Beschriftung fuer die Tagesansicht: 1. Vote, 2. Vote, ...usw.
     * 
     * @param {array} d - Aktuelle Anzahl der vorhandenen Punkte auf der X-Achse.
     * @returns {Function} - liefert die Funktion fuer die Beschriftung.
     */ 
    srv.xAxisTickFormatDay = function(data){
        return function(d){
            return (d) + ". Vote"; 
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
            d.setTime(d.getTime() - days * 24 * 60 * 60 * 1000 - 1);
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