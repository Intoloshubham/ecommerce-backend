import date from 'date-and-time';


const CustomFunction  = {

    currentDate(){
        const now = new Date();
        const current_date = date.format(now, 'YYYY/MM/DD') // => '2015/01/02 23:14:05'
        return current_date;
    },

    currentTime(){
        
        // let time_zone ;
        // let now ;
        // time_zone = new Date().toLocaleString("en-US", {timeZone: "Asia/kolkata"});
        // now = new Date(time_zone);
        // return date.format(now, 'hh:mm A'); // => '11:14 PM

        var time = new Date().toLocaleTimeString("en-US", {hour: '2-digit', minute: "2-digit", hour12: true, timeZone: "Asia/kolkata"});
        return time;
    },

    currentYearMonthDay(date_format){
        const now = new Date();
        const year_month_day = date.format(now, date_format) // date_format = 'YYYY' or 'MM' or 'DD' // 'YYYY/MM/DD'
        return year_month_day;
    },

    monthName(type='short'){
        const now = new Date();  
        const month_name = now.toLocaleString('en-us', { month: type }); // type = 'long', 'short' 
        return month_name;
    },

    dateFormat(inputDate){

        let day, month, year;
        var new_date = new Date(inputDate);

        day = new_date.getDate();
        month = new_date.getMonth() + 1;
        year = new_date.getFullYear();

        if(day < 10) {
            day = '0'+day;
        } 

        if(month < 10) {
            month='0'+month;
        }
        return `${year}/${month}/${day}`; 
    },

    timeFormat(value){
        const pattern = date.compile('hh:mm');
        const formated_time = date.format(new Date(value), pattern);

        return formated_time;
    },

    stringPassword(len){
        var gen_pass = "";
        var charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for( var i=0; i < len; i++ ){
            gen_pass +=charset.charAt(Math.floor(Math.random()*charset.length));
        }
        return gen_pass;
    },

    randomString(len){
        var gen_pass = "";
        var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for( var i=0; i < len; i++ ){
            gen_pass +=charset.charAt(Math.floor(Math.random()*charset.length));
        }
        return gen_pass;
    },

    randomNumber() {
        var minm = 100000;
        var maxm = 999999;
        return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    },

    randomUserId(){
        var ustr = CustomFunction.randomString(2);
        var unum = CustomFunction.randomNumber();
        return ustr+unum;
    },


    capitalize(str){
        if (typeof str !== 'string') return ''
        return str.charAt(0).toUpperCase() + str.slice(1);
        // return str[0].toUpperCase() + str.slice(1);
    }

    // #!/bin/sh
    // git --work-tree=/var/www/intolo/consoftpro --git-dir=/var/repo/consoftpro.git checkout -f
    // git remote add production ssh://ubuntu@107.20.37.104/var/repo/consoftpro.git

}

export default CustomFunction;

