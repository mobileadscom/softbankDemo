var getPos = function(el) {
  var xPos = 0;
  var yPos = 0;
 
  while (el) {
    if (el.tagName == "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;
 
      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    } else {
      // for all other non-BODY elements
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }
 
    el = el.offsetParent;
  }
  return {
    left: xPos,
    top: yPos
  };
}

var transitions = {
  'slideIn': function(ele, callback) {
    ele.style.transition = 'none';
    var pos = getPos(ele);
    ele.style.zIndex = "100";
    ele.style.display = 'block';
    ele.style.transform = 'translate(-100%)';
    setTimeout(function () {
        ele.style.transition = '0.3s all';
        ele.style.transform = 'translate(0)';
        ele.style.opacity = '1';
        setTimeout(function () {
            if (callback) {
              callback();
            }
        }, 300);
    }, 100);
  },
  'fadeOut': function(ele, callback) {
    var pos = getPos(ele);
    ele.style.transition = '0.3s all';
    setTimeout(function () {
        ele.style.opacity = '0';
        setTimeout(function () {
            ele.style.display = 'none';
            if (callback) {
              callback();
            }
        }, 300);
    }, 100);
  },
  'switch': function(options) {
    if (options.outEle && options.inEle) {
      var _this = this;
      if (options.outCallback) {
        _this.fadeOut(options.outEle, options.outCallback);
      }
      else {
        _this.fadeOut(options.outEle);
      }
      setTimeout(function() {
        if (options.inCallback) {
          _this.slideIn(options.inEle, options.inCallback);
        }
        else {
          _this.slideIn(options.inEle); 
        }
      }, 410);
    }
  }
};

export default transitions;