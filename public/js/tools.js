module.exports = {
	currentTime: function () {
		
		var monthDate = new Array();
		monthDate[0] = "01";
		monthDate[1] = "02";
		monthDate[2] = "03";
		monthDate[3] = "04";
		monthDate[4] = "05";
		monthDate[5] = "06";
		monthDate[6] = "07";
		monthDate[7] = "08";
		monthDate[8] = "09";
		monthDate[9] = "10";
		monthDate[10] = "11";
		monthDate[11] = "12";
		
		var date = new Date();
		var second = ("0" + date.getSeconds()).slice(-2);
		var minute = ("0" + date.getMinutes()).slice(-2);
		var hour = ("0" + date.getHours()).slice(-2);
		var day = ("0" + date.getDate()).slice(-2);
		var month = monthDate[date.getMonth()];
		var year = date.getFullYear();

		exact_time = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
		rough_time = year + month + day;
		
		return [exact_time, rough_time];
	}
};









