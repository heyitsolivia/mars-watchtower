// Join the chat http://zippychat.com/room/xisev

$(function() {
    
    // Start with no items
    $('.item').hide();
    
    $('.btn').on('click', function() { 
        var $this = $(this);
        $this.toggleClass('active');
        $('.item[data-button="' + $this.data('button') + '"]').fadeToggle(200);
    });
    
    function toggleUnits(force) {
        var globalUnit = 0;
        
        $('.units').each(function(index, unit) {
            var $unit = $(unit),
                newUnit = +$unit.data('unit');
            if (force === null) {
                newUnit = (newUnit + 1) % 2;
            } else {
                newUnit = force;
            }
            $unit.text($unit.data(newUnit + ''));
            $unit.data('unit', newUnit);
            globalUnit = newUnit;
        });
        if (force === null) {
            console.warn('setting global');
            $('.dataContainer').attr('data-units', globalUnit);
        }
    }
    
    $('[data-button="unit"]').on('click', function() { toggleUnits(null) });
    
    var $body = $('body'),
        $marsDate = $('.marsDate'),
        $tempDiv = $('.tempDiv'),
        $celsius = $('.celsius'),
        $farhenheit = $('.farhenheit'),
        maxTempC,
        maxTempF,
        minTempC,
        minTempF,
        $windDiv = $('.windDiv'),
        $pressureDiv = $('.pressureDiv');
    
    /**
     * Possible fields are: 
     *      terrestrial_date, sol, ls, min_temp, min_temp_fahrenheit, max_temp, max_temp_fahrenheit, 
     *      pressure, pressure_string abs_humidity, wind_speed, wind_direction, atmo_opacity, season, sunrise, sunset
     * 
     * This basically says how we want to render a field in a report. All you need to do is 
     * add the field name as a function. The parameter being passed is the value retrieved from the report!
     * 
     * If you append elements, make sure you clear them inside renderLatestData() so that the next
     * report has a clean slate to render.
     */
    var reportRender = {
        terrestrial_date: function(terrestrialDate) {
            var d = terrestrialDate.split('-'),
                date = new Date(d[0], +d[1] - 1, d[2]),
                name = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; 
            $('.currentDate').text(name[date.getMonth()].toUpperCase() + ' ' + date.getDate() + ', ' + date.getFullYear() + " | Gale Crater");
        },
        
        sol: function(sol) {
            var $div = $('<span>', { 'class': 'sol' }).text('SOL ' + sol);  
            $marsDate.append($div);
        },
        
        max_temp: function(maxTemp) {
            var text = 'HI ' + Math.round(maxTemp) +'°',
                $div = $('<span>', {'class':'maxTemp temp units', 'data-0': text, 'data-unit': '0'}).text(text);
            $tempDiv.append($div);
        },
        
        min_temp: function(minTemp) {
            var text = 'LO ' + Math.round(minTemp) +'°',
                $div = $('<span>', {'class':'minTemp temp units', 'data-0': text, 'data-unit': '0'}).text(text);
            $tempDiv.append($div);
        },
        
        min_temp_fahrenheit: function(minTempFahrenheit) {
            $('.minTemp').data('1', 'LO ' + Math.round(minTempFahrenheit) +'°');
        },
        
        max_temp_fahrenheit: function(maxTempFahrenheit) {
            $('.maxTemp').data('1', 'HI ' + Math.round(maxTempFahrenheit) +'°');
        },
        
        wind_speed: function(windSpeed) {
            var windSpeedKMH = (windSpeed / 1000) * 3600,
                mphText = (Math.round((windSpeedKMH / 1.609344) * 100) / 100) + ' mph',
                msText = windSpeed + ' m/s',
                $div = $('<span>', { 'class':'windSpeed units', 'data-0': msText, 'data-1': mphText, 'data-unit': '0' }).text(windSpeed + 'm/s');
            $windDiv.append($div);
        },
        
        wind_direction: function(windDirection) {
            var $div;
                switch (windDirection) {
                    case "N":
                        $div = $('<span>', {'class':'windDirection'}).text(" North");
                        $windDiv.append($div);
                        break;
                    case "E":
                        $div = $('<span>', {'class':'windDirection'}).text(" East");
                        $windDiv.append($div);
                        break;
                    case "S":
                        $div = $('<span>', {'class':'windDirection'}).text(" South");
                        $windDiv.append($div);
                        break;
                    case "W":
                        $div = $('<span>', {'class':'windDirection'}).text(" West");
                        $windDiv.append($div);
                        break;
                    default:
                        $div = $('<span>', {'class':'windDirection'}).text("");
                        $windDiv.append($div);
                }
        },
        
        pressure: function(pressure) {
            var $div = $('<div>', {'class':'pressure'}).text(pressure.toFixed(2) + " Pa");
            $pressureDiv.append($div);
        },
        
        pressure_string: function(pressureString) {
            var $div = $('<div>', {'class':'pressureString'}).text(pressureString + " than normal");
            $pressureDiv.append($div);
        }

    };
    
    /** 
     * ===========
     * See http://mars-watchtower.heyitsolivia.c9.io/data for details on what is available.
     * You don't need to add anything here anymore. Look up at reportRender.
     * ===========
     */
    function renderLatestData(report) {
        // Clean up any lingering data from previous renders
        $marsDate.empty();
        $tempDiv.empty();
        $celsius.empty();
        $farhenheit.empty();
        $windDiv.empty();
        $pressureDiv.empty();
        $('.gauss-graph').remove();
        
        renderChart(report['max_temp_fahrenheit'], report['min_temp_fahrenheit']);
        
        // Render the fields specified in the report renderer.
        for (var field in reportRender) {
            if (reportRender.hasOwnProperty(field)) {
                reportRender[field](report[field]);
            }
        }
        
        renderAvgTemp(report['max_temp'], report['min_temp'], report['max_temp_fahrenheit'], report['min_temp_fahrenheit']);
        
        toggleUnits($('.dataContainer').attr('data-units'));
    }

    function renderAvgTemp(maxCTemp, minCTemp, maxTemp, minTemp) {
        var fText = Math.round((minTemp + maxTemp) / 2) + '°F',
            cText = Math.round((minCTemp + maxCTemp) / 2) + '°C',
            $div = $('<span>', {'class':'avgTemp temp units', 'data-0': cText, 'data-1': fText, 'data-unit': '0'}).text(cText);
        $div.insertBefore($('.maxtemp'));
    }
    
    // Has array of report data sorted in ascending order.
    function renderHistoricalData(reports) {
        var $body = $('body'),
            $container = $('.dateContainerInterior'),
            $div,
            i;
        
        for (i = 0; i < reports.length; i++) {
            $div = $('<div>', { 'class': 'report' }).text('sol: ' + reports[i]['sol'] + " ");
            $container.append($div);
        }
    }
    
    function renderChart(maxTemp, minTemp) {
        var t_diff = maxTemp - minTemp,
            e_bot = 2 * Math.pow(5.4, 2),
            f_bot = Math.sqrt(2 * Math.PI),
            i,
            values = [];
        
        // Calculate a gaussian bell curve based on min and max temp.
        for (i = 0; i <= 24; i = i + 0.5) {
            var e_top = -1 * Math.pow(i - 12.29, 2),
                e_x = Math.pow(Math.E, (e_top / e_bot)),
                frac = (1 / 5.4) * (f_bot * e_x) - 0.03482,
                calc = ((frac / 0.4292) * t_diff) + minTemp;
            values.push({ x: i, y: calc });
        }
                
        var margin = {top: 100, right: 60, bottom: 30, left: 50},
            documentWidth = $(document).width(),
            width = documentWidth - margin.left - margin.right,
            height = 250 - margin.top - margin.bottom;
        
        var x = d3.scale.linear()
            .range([0, width]);
        
        var y = d3.scale.linear()
            .range([height, 0]);
        
        var xAxis = d3.svg.axis()
            .scale(x)
            .ticks(0)
            .tickSize(0)
            .orient("bottom");
        
        var yAxis = d3.svg.axis()
            .scale(y)
            .ticks(2)
            .tickSize(0)
            .tickValues([minTemp, maxTemp])
            .orient("right");
        
        var line = d3.svg.line()
            .x(function(d) { return x(d.x); })
            .y(function(d) { return y(d.y); });
        
        var svg = d3.select(".tempGraph").append("svg")
            .attr('class', 'gauss-graph')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        x.domain(d3.extent(values, function(d) { return d.x; }));
        y.domain(d3.extent(values, function(d) { return d.y; }));
        
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + y(0) + ")")
            .style("stroke-dasharray", ("6, 8"))
            .call(xAxis);
        
        svg.append("g")
            .attr("class", "y axis")
            .attr('transform', 'translate(-3, 12)')
            .call(yAxis)
            .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em");
        
        svg.append("path")
            .datum(values)
            .attr("class", "line")
            //.attr('d', line);
            .attr('d', line(values[0]))            
            .transition()
            .duration(1400)
            .delay(800)
            .attrTween('d', pathTween);
            
        function pathTween() {
            var interpolate = d3.scale.quantile()
                    .domain([0,1])
                    .range(d3.range(1, values.length + 1));
            return function(t) {
                return line(values.slice(0, interpolate(t)));
            };
        }
    }
    
    function renderSlider(reports) {
        var $select = $('#timeline'),
            $option,
            i;
        
        for (i = 1; i <= reports.length; i++) {
            $option = $('<option>');
            $option
                .attr('value', i)
                .text(i)
                .data('report', reports[i - 1]);
            $select.append($option);
        }
        $select.val(reports.length);
        renderLatestData(reports[reports.length - 1]);
        
        var $slider = $('<div id="slider"></div>');
        $slider.insertAfter($select);
        $slider.slider({
            min: 1,
            max: reports.length,
            range: "min",
            value: $select[ 0 ].selectedIndex + 1,
            slide: function( event, ui ) {
                var select = $select[0],
                    selected = ui.value - 1,
                    report = $(select.options[selected]).data('report');
                select.selectedIndex = selected;
                $('.ui-slider-handle').attr('data-content', 'SOL ' + report['sol']);
                renderLatestData(report);
            }
        });
        $('.ui-slider-handle').attr('data-content', 'SOL ' + reports[reports.length - 1]['sol']);
    }
    
    /**
     * ======================================================================
     * You shouldn't have to edit anything below this point!
     * This is just grabbing data to send to the 2 functions above.
     * ======================================================================
     */
    
    /**
     * This grabs the latest report data from marsweather.ingenology.com.
     */
    //$.get('/data', function(data) {
        //renderLatestData(data['report']);
    //});
        
    /**
     * Grab 30 historical data points.
     */
    
    var minSol = 1,
        maxSol = 13,
        sol, requests = [], sols = [], allReports = [];
     
    for (sol = minSol; sol < maxSol; sol++) {
        if (sol == 4) {
            continue;
        }
        sols.push(sol);
    }
    
    requests = $.map(sols, function(index) {
       return $.get('/historical?page=' + index, function(data) {
            var i;
            if (data['count'] > 0) {
                for (i = 0; i < data['results'].length; i++) {
                    allReports.push(data['results'][i]);
                }
            }
        });
    });
    
    $.when.apply(this, requests).done(function() { 
        var data = allReports.sort(function(a, b) {
            return a['sol'] - b['sol'];
        });
        
        renderHistoricalData(data);
        renderSlider(data);
        setTimeout(function() {
            $('.icon-geomicon-091').trigger('click');
        }, 1)
        
    });

});
