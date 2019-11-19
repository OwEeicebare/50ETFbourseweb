function test() {//生成x轴数据
    var now_date = new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate();//获取年/月/日
    var start_time = new Date(now_date + " 9:30");//开始时间
    var start_time2 = new Date(now_date + " 13:00");//开始时间
    var end_time = new Date(now_date + " 11:30");//结束时间
    var end_time2 = new Date(now_date + " 15:00");//结束时间
    var result = [];
    while (Date.parse(end_time) - Date.parse(start_time) >= 0) {//如果结束时间大于开始时间

        result.push(start_time.getHours().toString().padStart(2, "0") + ":" + start_time.getMinutes().toString().padStart(2, "0"));
        start_time = new Date(start_time.valueOf() + 60 * 1000);
    }
    while (Date.parse(end_time2) - Date.parse(start_time2) >= 0) {//如果结束时间大于开始时间
        result.push(start_time2.getHours().toString().padStart(2, "0") + ":" + start_time2.getMinutes().toString().padStart(2, "0"));
        start_time2 = new Date(start_time2.valueOf() + 60 * 1000);
    }
    return result;

}
function server() {//生成现价测试数据
    var now_date = new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate();//获取年/月/日
    var start_time = new Date(now_date + " 9:30");//开始时间
    var end_time = new Date(now_date + " 11:30");//结束时间
    var start_time2 = new Date(now_date + " 13:00");//下午开始时间
    var end_time2 = new Date(now_date + " 15:00");//下午结束时间
    var result = [];
    while (Date.parse(end_time) - Date.parse(start_time) >= 0) {//如果结束时间大于开始时间
        var ran = (Math.random()).toFixed(4);
        result.push([start_time.getHours().toString().padStart(2, "0") + ":" + start_time.getMinutes().toString().padStart(2, "0"), ran]);
        start_time = new Date(start_time.valueOf() + 60 * 1000);
    }
    while (Date.parse(end_time2) - Date.parse(start_time2) >= 0) {//如果结束时间大于开始时间
        var ran = (Math.random()).toFixed(4)
        result.push([start_time2.getHours().toString().padStart(2, "0") + ":" + start_time2.getMinutes().toString().padStart(2, "0"), ran]);
        start_time2 = new Date(start_time2.valueOf() + 60 * 1000);
    }
    return result;

}
function vol_server() {//生成成交量测试数据
    var now_date = new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate();//获取年/月/日
    var start_time = new Date(now_date + " 9:30");//开始时间
    var end_time = new Date(now_date + " 11:30");//结束时间
    var start_time2 = new Date(now_date + " 13:00");//下午开始时间
    var end_time2 = new Date(now_date + " 15:00");//下午结束时间
    var result = [];
    while (Date.parse(end_time) - Date.parse(start_time) >= 0) {//如果结束时间大于开始时间
        var ran = parseInt(Math.random() * (500 - 1 + 1) + 1, 10);
        result.push([start_time.getHours().toString().padStart(2, "0") + ":" + start_time.getMinutes().toString().padStart(2, "0"), ran]);
        start_time = new Date(start_time.valueOf() + 60 * 1000);
    }
    while (Date.parse(end_time2) - Date.parse(start_time2) >= 0) {//如果结束时间大于开始时间
        var ran = parseInt(Math.random() * (500 - 1 + 1) + 1, 10);
        result.push([start_time2.getHours().toString().padStart(2, "0") + ":" + start_time2.getMinutes().toString().padStart(2, "0"), ran]);
        start_time2 = new Date(start_time2.valueOf() + 60 * 1000);
    }
    return result;
}
function get_data(){
    var data = [
        ['2015-10-16', 18.4233, 9.58, 18.33, 18.79, 67.00], 
        ['2015-10-19', 18.56, 18.25, 18.19, 18.56, 55.00], 
        ['2015-10-20', 18.3, 18.22, 18.05, 18.41, 37.00],
        ['2015-10-21', 18.18, 18.69, 18.02, 18.98, 89.00],
        ['2015-10-22', 18.42, 18.29, 18.22, 18.48, 43.00],
        ['2015-10-23', 18.26, 18.19, 18.08, 18.36, 46.00],
        ['2015-10-26', 18.33, 18.07, 17.98, 18.35, 65.00],
        ['2015-10-27', 18.08, 18.04, 17.88, 18.13, 37.00],
        ['2015-10-28', 17.96, 17.86, 17.82, 17.99, 35.00],
        ['2015-10-29', 17.85, 17.81, 17.8, 17.93, 27.00],
        ['2015-10-30', 17.79, 17.93, 17.78, 18.08, 43.00],
        ['2015-11-02', 17.78, 17.83, 17.78, 18.04, 27.00],
        ['2015-11-03', 17.84, 17.9, 17.84, 18.06, 34.00],
        ['2015-11-04', 17.97, 18.36, 17.85, 18.39, 62.00],
        ['2015-11-05', 18.3, 18.57, 18.18, 19.08, 177.00],
        ['2015-11-06', 18.53, 18.68, 18.3, 18.71, 95.00],
        ['2015-11-09', 18.75, 19.08, 18.75, 19.98, 202.00],
        ['2015-11-10', 18.85, 18.64, 18.56, 18.99, 85.00],
        ['2015-11-11', 18.64, 18.44, 18.31, 18.64, 50.00],
        ['2015-11-12', 18.55, 18.27, 18.17, 18.57, 43.00],
        ['2015-11-13', 18.13, 18.14, 18.09, 18.34, 35.00],
        ['2015-11-16', 18.01, 18.1, 17.93, 18.17, 34.00],
        ['2015-11-17', 18.2, 18.14, 18.08, 18.45, 58.00],
        ['2015-11-18', 18.23, 18.16, 18.0, 18.45, 47.00],
        ['2015-11-19', 18.08, 18.2, 18.05, 18.25, 32.00],
        ['2015-11-20', 18.15, 18.15, 18.11, 18.29, 36.00],
        ['2015-11-23', 18.16, 18.19, 18.12, 18.34, 47.00],
        ['2015-11-24', 18.23, 17.88, 17.7, 18.23, 62.00],
        ['2015-11-25', 17.85, 17.73, 17.56, 17.85, 66.00],
        ['2015-11-26', 17.79, 17.53, 17.5, 17.92, 63.00],
        ['2015-11-27', 17.51, 17.04, 16.9, 17.51, 67.00],
        ['2015-11-30', 17.07, 17.2, 16.98, 17.32, 55.00],
        ['2015-12-01', 17.28, 17.11, 16.91, 17.28, 39.00],
        ['2015-12-02', 17.13, 17.91, 17.05, 17.99, 102.00],
        ['2015-12-03', 17.8, 17.78, 17.61, 17.98, 71.00],
        ['2015-12-04', 17.6, 17.25, 17.13, 17.69, 51.00],
        ['2015-12-07', 17.2, 17.39, 17.15, 17.45, 43.00],
        ['2015-12-08', 17.3, 17.42, 17.18, 17.62, 45.00],
        ['2015-12-09', 17.33, 17.39, 17.32, 17.59, 44.00],
        ['2015-12-10', 17.39, 17.26, 17.21, 17.65, 44.00],
        ['2015-12-11', 17.23, 16.92, 16.66, 17.26, 114.00],
        ['2015-12-14', 16.75, 17.06, 16.5, 17.09, 94.00],
        ['2015-12-15', 17.03, 17.03, 16.9, 17.06, 46.00],
        ['2015-12-16', 17.08, 16.96, 16.87, 17.09, 30.00],
        ['2015-12-17', 17.0, 17.1, 16.95, 17.12, 50.00],
        ['2015-12-18', 17.09, 17.52, 17.04, 18.06, 156.00],
        ['2015-12-21', 17.43, 18.23, 17.35, 18.45, 152.00],
        ['2015-12-22', 18.14, 18.27, 18.06, 18.32, 94.00],
        ['2015-12-23', 18.28, 18.19, 18.17, 18.71, 108.00],
        ['2015-12-24', 18.18, 18.14, 18.01, 18.31, 37.00],
        ['2015-12-25', 18.22, 18.33, 18.2, 18.36, 48.00],
        ['2015-12-28', 18.35, 17.84, 17.8, 18.39, 48.00],
        ['2015-12-29', 17.83, 17.94, 17.71, 17.97, 36.00],
        ['2015-12-30', 17.9, 18.26, 17.55, 18.3, 71.00],
        ['2015-12-31', 18.12, 17.99, 17.91, 18.33, 72.00],
        ['2016-01-04', 17.91, 17.28, 17.16, 17.95, 37.00],
        ['2016-01-05', 17.17, 17.23, 17.0, 17.55, 51.00],
        ['2016-01-06', 17.2, 17.31, 17.06, 17.33, 31.00],
        ['2016-01-07', 17.15, 16.67, 16.51, 17.15, 19.00],
        ['2016-01-08', 16.8, 16.81, 16.61, 17.06, 60.00],
    ]
    // console.log(data.length)
    return data;
}
export {
    test
}
export {
    server
}
export {
    vol_server
}
export{
    get_data
}