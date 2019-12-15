function dateCreate() {
    var today = new Date();

    var days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday', 'Sunday'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    
    var day = days[String(today.getDay()) - 1];
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = months[String(today.getMonth()).padStart(2, '0')];
    
    today = day + ' ' + dd + ' ' + mm;
    document.getElementById('date').innerHTML = today;
}


export {dateCreate};