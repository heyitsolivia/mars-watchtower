// Join the chat http://zippychat.com/room/xisev

(function() {
    
    // See http://mars-watchtower.heyitsolivia.c9.io/data for details on what is available.
    function renderLatestData(report) {
        var $body = $('body'),
            fields = ['terrestrial_date', 'sol', 'ls'],
            detail,
            $div,
            $container,
            i;
            

            
        
        
        for (i = 0; i < fields.length; i++) {
            detail = report[fields[i]];
            $container = $('.marsDate')
            var months = fields[2];
            
            
            switch(i){
            //Switch statement to seperate different data from fields[] into different divs, to simplify layout
            case 0:
                var dateTemp = report[fields[0]],
                    dateArray = dateTemp.split("-"),
                    month = dateArray[1];
                // Convert date into more legible and usable format
                for (i = 0; i < dateArray.length; i++) {
                        var $date = $('.currentDate');
                        switch(i){
                            case 0:
                                $div = $('.year').text(dateArray[i]);  
                                $date.append($div);
                            break;
                            //Can't use array of months because of formatting of json data. Do correct me if I'm wrong.
                            case 1:
                                if(month === "01"){
                                    $div = $('.month').text('January ');  
                                    $date.prepend($div);
                                }else if(month === "02"){
                                    $div = $('.month').text('Feburary ');  
                                    $date.prepend($div);
                                }else if(month === "03"){
                                    $div = $('.month').text('March ');  
                                    $date.prepend($div);
                                }else if(month === "04"){
                                    $div = $('.month').text('April ');  
                                    $date.prepend($div);
                                }else if(month === "05"){
                                    $div = $('.month').text('May ');  
                                    $date.prepend($div);
                                }else if(month === "06"){
                                    $div = $('.month').text('June ');  
                                    $date.prepend($div);
                                }else if(month === "07"){
                                    $div = $('.month').text('July ');  
                                    $date.prepend($div);
                                }else if(month === "08"){
                                    $div = $('.month').text('August ');  
                                    $date.prepend($div);
                                }else if(month === "09"){
                                    $div = $('.month').text('September ');  
                                    $date.prepend($div);
                                }else if(month === 10){
                                    $div = $('.month').text('October ');  
                                    $date.prepend($div);
                                }else if(month === 11){
                                    $div = $('.month').text('November ');  
                                    $date.prepend($div);
                                }else{
                                    $div = $('.month').text('December ');  
                                    $date.prepend($div);
                                }
                            break;
                            // It's ugly, but it works. 
                            case 2:
                                $div = $('.day').text(dateArray[i]+", ");  
                                $div.insertAfter('.month');
                                break;
                        }
                }
                break;
            case 1:
                
                // The additional text (day , month) was put here to make it easier to maintain and change.
                $div = $('<div>',{'class': 'sol'}).text("day " + detail + ", month ");  
                $container.append($div);
                break;
            
            //Transform ls into months, as per http://www-mars.lmd.jussieu.fr/mars/time/solar_longitude.html
            case 2:
                if(months <= 30){
                     $div = $('<div>',{'class': 'ls'}).text('1');
                     $container.append($div);
                }else if(months <= 60){
                    $div = $('<div>',{'class': 'ls'}).text('2');
                    $container.append($div);
                }else if(months <= 90){
                    $div = $('<div>',{'class': 'ls'}).text('3');
                    $container.append($div);
                }else if(months <= 120){
                    $div = $('<div>',{'class': 'ls'}).text('4');
                    $container.append($div);
                }else if(months <= 150){
                    $div = $('<div>',{'class': 'ls'}).text('5');
                    $container.append($div);
                }else if(months <= 180){
                    $div = $('<div>',{'class': 'ls'}).text('6');
                    $container.append($div);
                }else if(months <= 210){
                    $div = $('<div>',{'class': 'ls'}).text('7');
                    $container.append($div);
                }else if(months <= 240){
                    $div = $('<div>',{'class': 'ls'}).text('8');
                    $container.append($div);
                }else if(months <= 270){
                    $div = $('<div>',{'class': 'ls'}).text('9');
                    $container.append($div);
                }else if(months <= 300){
                    $div = $('<div>',{'class': 'ls'}).text('10');
                    $container.append($div);
                }else if(months <= 300){
                    $div = $('<div>',{'class': 'ls'}).text('10');
                    $container.append($div);
                }else if(months <= 330){
                    $div = $('<div>',{'class': 'ls'}).text('11');
                    $container.append($div);
                }else{
                    $div = $('<div>',{'class': 'ls'}).text('12');
                    $container.append($div);
                }
                break;
           
            }
            

            
            
        }
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
    
    /**
     * ======================================================================
     * You shouldn't have to edit anything below this point!
     * This is just grabbing data to send to the 2 functions above.
     * ======================================================================
     */
    
    /**
     * This grabs the latest report data from marsweather.ingenology.com.
     */
    $.get('/data', function(data) {
        renderLatestData(data['report']);
    });
        
    /**
     * Grab 30 historical data points.
     */
    
    var minSol = 200,
        maxSol = 230,
        sol, requests = [], sols = [], allReports = [];
     
    for (sol = minSol; sol < maxSol; sol++) {
        sols.push(sol);
    }
    
    requests = $.map(sols, function(index) {
       return $.get('/historical?sol=' + index, function(data) {
            if (data['count'] == 1) {
                allReports.push(data['results'][0]);
            }
        });
    });
    
    $.when.apply(this, requests).done(function() { 
        renderHistoricalData(allReports.sort(function(a, b) {
            return a['sol'] - b['sol'];
        }));
    });

})();
