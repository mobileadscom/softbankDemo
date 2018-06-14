var jammer = {
	'duration': 500,
	'jamList': [],
	'isJammed': function(el) {
        var j = this.jamList.indexOf(el);
        if ( j > -1 ) {
        	return true;
        }
        else {
            return false;
        }
	},
	'jam' : function(el) {
		var _this = this;
		this.jamList.push(el);
		el.blur();
        setTimeout( function() {
            _this.jamList.splice(_this.jamList.indexOf(el), 1);
        }, _this.duration);
	}
}

export default jammer;