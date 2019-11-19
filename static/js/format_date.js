function formatDate(date) {
    if (date) {
        var currentYear = new Date().getFullYear();
        var initdate = initDate(date);
        var year = initdate.getFullYear();
        var month = initdate.getMonth() < 10 ? '0' + initdate.getMonth()  : initdate.getMonth();
        var day = initdate.getDate() < 10 ? '0' + initdate.getDate() : initdate.getDate();
        var hour = initdate.getHours() < 10 ? '0' + initdate.getHours() : initdate.getHours();
        var minute = initdate.getMinutes() < 10 ? '0' + initdate.getMinutes() : initdate.getMinutes();
        if (currentYear === year) {
            return month + '-' + day + ' ' + hour + ':' + minute;
        } else {
            return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
        }
    }
}
function initDate (date) {
    var dateArr = date.split(' ');
    var arr1 = dateArr[0].split('-');
    var arr2 = dateArr[1].split(':');
    return new Date(arr1[0], arr1[1], arr1[2], arr2[0], arr2[1], arr2[2]);
}
export default{
    formatDate
}