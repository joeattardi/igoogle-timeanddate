
var FORMAT_12_HOUR = 0;
var FORMAT_24_HOUR = 1;

var showDate = true;
var blinkSeparator = true;
var clockFormat = FORMAT_12_HOUR;

var userDateFormat = "fullDate"; 
var predefinedDateFormats = ["fullDate", "shortDate", "stdDate", "mm/dd/yyyy", "euroStdDate", "mediumDate", "longDate", "euroLongDate"];   
   
function initClock() {       
    // Start the clock
    updateClock();
    setInterval(updateClock, 1000);
}  
   
/**
 * Updates the clock to display the current time and date.
 */
function updateClock() {
    var now = new Date();    
    updateTimeDisplay(now);
    updateDateDisplay(now);   
}

function updateTimeDisplay(now) {
    var separatorDisplay = document.getElementById("separator");
    if (blinkSeparator) {
        var seconds = now.getSeconds();
        separatorDisplay.innerHTML = (seconds % 2 == 0) ? " " : ":";
    } else {
        separatorDisplay.innerHTML = ":";
    }

    var hours = now.getHours();
    var hoursDisplay = document.getElementById("hours");
    hoursDisplay.innerHTML = formatHours(hours);
    
    var minutesDisplay = document.getElementById("minutes");
    minutesDisplay.innerHTML = formatMinutes(now.getMinutes());
    
    var amPmDisplay = document.getElementById("ampm");    
    amPmDisplay.innerHTML = formatAmPm(hours);        
}

function updateDateDisplay(now) {   
    var dateDisplay = document.getElementById("date");
    dateDisplay.innerHTML = showDate ? now.format(userDateFormat) : "";
}

function formatHours(hours) {
    if (clockFormat == FORMAT_24_HOUR) {
        return (hours < 10) ? ("0" + hours) : hours;
    } else {
        if (hours == 0) {
            return 12;
        } else if (hours <= 12) {
            return hours;
        } else {
            return (hours - 12);
        }
    }
}

function formatMinutes(minutes) {
    return (minutes < 10) ? ("0" + minutes) : minutes;
}

function formatAmPm(hours) {
    if (clockFormat == FORMAT_12_HOUR) {
        return (hours >= 12) ? " PM" : " AM";
    } else {
        return "";
    }
}

function updateShowDate(theCheckbox) {    
    var dateFormatSelect = document.getElementById("predefinedDateFormats");
    var dateFormatLabel = document.getElementById("dateFormatLabel");    
    dateFormatSelect.disabled = !theCheckbox.checked;
    dateFormatLabel.className = theCheckbox.checked ? "" : "disabled";           
}

function showSettings() {
    var settingsContainer = document.getElementById("settings");
    settingsContainer.className = "";
    
    var clockBody = document.getElementById("clockBody");
    clockBody.className = "hidden";
}

function saveChanges() {
    var settingsContainer = document.getElementById("settings");
    settingsContainer.className = "hidden";
        
    var settingsForm = document.forms['clockSettings'];
            
    blinkSeparator = settingsForm.blinkSeparator.checked;    
    showDate = settingsForm.showDate.checked;
    
    // Set the clock format
    if (settingsForm.format[FORMAT_12_HOUR].checked) {
        clockFormat = FORMAT_12_HOUR;
    } else if (settingsForm.format[FORMAT_24_HOUR].checked) {
        clockFormat = FORMAT_24_HOUR;
    }
        
    // Set the date format
    userDateFormat = settingsForm.predefinedDateFormats.options[settingsForm.predefinedDateFormats.selectedIndex].value;
    
    updateClock();
    
    var clockBody = document.getElementById("clockBody");
    clockBody.className = "";    
}

function cancelChanges() {
    var settingsContainer = document.getElementById("settings");
    settingsContainer.className = "hidden";
    
    var clockBody = document.getElementById("clockBody");
    clockBody.className = "";    
}

/*
	Date Format 1.1
	(c) 2007 Steven Levithan <stevenlevithan.com>
	MIT license
	With code by Scott Trenda (Z and o flags, and enhanced brevity)
*/

/*** dateFormat
	Accepts a date, a mask, or a date and a mask.
	Returns a formatted version of the given date.
	The date defaults to the current date/time.
	The mask defaults ``"ddd mmm d yyyy HH:MM:ss"``.
*/
var dateFormat = function () {
	var	token        = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloZ]|"[^"]*"|'[^']*'/g,
		timezone     = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (value, length) {
			value = String(value);
			length = parseInt(length) || 2;
			while (value.length < length)
				value = "0" + value;
			return value;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask) {
		// Treat the first argument as a mask if it doesn't contain any numbers
		if (
			arguments.length == 1 &&
			(typeof date == "string" || date instanceof String) &&
			!/\d/.test(date)
		) {
			mask = date;
			date = undefined;
		}

		date = date ? new Date(date) : new Date();
		if (isNaN(date))
			throw "invalid date";

		var dF = dateFormat;
		mask   = String(dF.masks[mask] || mask || dF.masks["default"]);

		var	d = date.getDate(),
			D = date.getDay(),
			m = date.getMonth(),
			y = date.getFullYear(),
			H = date.getHours(),
			M = date.getMinutes(),
			s = date.getSeconds(),
			L = date.getMilliseconds(),
			o = date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4)
			};

		return mask.replace(token, function ($0) {
			return ($0 in flags) ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":       "ddd mmm d yyyy HH:MM:ss",
	shortDate:       "m/d/yy",
    stdDate:         "mm/dd/yy",
    euroStdDate:     "dd/mm/yyyy",
	mediumDate:      "mmm d, yyyy",
	longDate:        "mmmm d, yyyy",
    euroLongDate:    "d mmmm yyyy",
	fullDate:        "dddd, mmmm d, yyyy",
	shortTime:       "h:MM TT",
	mediumTime:      "h:MM:ss TT",
	longTime:        "h:MM:ss TT Z",
	isoDate:         "yyyy-mm-dd",
	isoTime:         "HH:MM:ss",
	isoDateTime:     "yyyy-mm-dd'T'HH:MM:ss",
	isoFullDateTime: "yyyy-mm-dd'T'HH:MM:ss.lo"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames:   [
		"Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask) {
	return dateFormat(this, mask);
}
