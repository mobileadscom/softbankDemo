import axios from 'axios';
import jammer from './jammer';
import transitions from './transitions';
import '../stylesheets/style.css';

var survey = {
	answers: [],
	currentQuestion: 1,
	player: null,
	params: {},
	getParams: function() {
		var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = pair[1];
        // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [ query_string[pair[0]], pair[1] ];
            query_string[pair[0]] = arr;
        // If third or later entry with this name
        } else {
            query_string[pair[0]].push(pair[1]);
        }
    } 
    return query_string;
	},
	init: function() {
		var _this = this;
		var startBtn = document.getElementById('startSurvey');
		var nextBtns = document.getElementsByClassName('next-btn');
		var backBtns = document.getElementsByClassName('back-btn');
		var pages = document.getElementsByClassName('page');
    var answers = document.getElementsByClassName('answer');
    var joinBtn = document.getElementById('toCampaign');
    var inputs = document.getElementsByClassName('input-answer');
    var vidWidth = document.getElementById('vid').clientWidth;
    var vidHeight = document.getElementById('vid').clientHeight;
    this.params = this.getParams();
    console.log(this.params);

    for (var a = 0; a < answers.length; a++) {
      answers[a].onclick = function() {
      	var others = this.parentNode.getElementsByClassName('answer');
      	for (var o = 0; o < others.length; o++) {
      		if (others[o].classList.contains('selected')) {
      			others[o].classList.remove('selected');
      		}
      	}
      	this.classList.add('selected');
      	if (this.dataset.target) {
      		var targetInput = document.getElementById(this.dataset.target);
      		targetInput.focus();
      		_this.answers[_this.currentQuestion - 1] = 'other';
      	}
      	else {
          _this.answers[_this.currentQuestion - 1] = this.innerHTML;
      	}
      }
    }

    for (var i = 0; i < inputs.length; i++) {
    	inputs[i].onfocus = function() {
    		var cAnswer = document.getElementById(this.dataset.target);
    		cAnswer.click();
    	}
    }

		for (var b = 0; b < nextBtns.length; b++) {
			nextBtns[b].onclick = function() {
				if (_this.currentQuestion == 3) {
					_this.answers[2] = document.getElementById('prefectures').value;
					if (_this.answers[2] == 0) {
						_this.answers[2] = null;
					}
				}
				else if (_this.currentQuestion == 5) {
					if (_this.answers[4] == 'other') {
						_this.answers[4] = 'その他: ' + document.getElementById('q5a').value;
					}
				}
				else if (_this.currentQuestion == 7) {
					if (_this.answers[6] == 'other') {
						_this.answers[6] = 'その他: ' + document.getElementById('q7a').value;
					}
				}
				if (_this.answers[_this.currentQuestion - 1]) {
					if (!jammer.isJammed(this)) {
	          jammer.jam(this);
	          _this.changeQuestion(1);
					}
				}
				else {
          alert('この質問にお答えください。');
          this.blur();
				}
			}
		}

		for (var b = 0; b < backBtns.length; b++) {
			backBtns[b].onclick = function() {
				if (!jammer.isJammed(this)) {
          jammer.jam(this);
          _this.changeQuestion(-1);
        }
			}
		}

		joinBtn.onclick = function() {
			var cPage = document.getElementById('page9');
		  transitions.switch({
		  	outEle: document.getElementById('page9'),
		  	inEle: document.getElementById('page10'),
		  	inCallback: _this.player.playVideo()
		  });
		  console.log(_this.answers);
		};

    startBtn.onclick = function() {
      if (document.getElementById('agree').checked) {
      	transitions.switch({
      		outEle: document.getElementById('page1'),
      		inEle: document.getElementById('page2')
      	});
      }
      else {
      	alert('利用規約に同意ください。');
      	this.blur();
      }
    };

		for (var p = 0; p < pages.length; p++) {
			if (pages[p].id != 'page1') {
				pages[p].style.display = 'none';
			}
		}

    //youtube api
		var ytScript = document.createElement('script');
    ytScript.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(ytScript, firstScriptTag);
    
    window.onYouTubeIframeAPIReady = function() {
    	_this.player = new YT.Player('vid', {
        height: vidHeight.toString(),
        width: vidWidth.toString(),
        playerVars: {'rel': 0,'showinfo': 0, 'controls': 0},
        videoId: '6kpZW8oQ9tw',
        events: {
          'onStateChange': function(event){
            if (event.data == YT.PlayerState.ENDED) {
            	_this.showResult(_this.answers, _this.params);
            }
          }
        }
      });
    }
	},
	changeQuestion: function(i) {
		var cPage = document.getElementById('page' + (this.currentQuestion + 1).toString());
    if (i > 0) {
    	this.currentQuestion++;
    }
    else {
    	this.currentQuestion--;
    }
		var nPage = document.getElementById('page' + (this.currentQuestion + 1).toString());
		transitions.switch({
			outEle: cPage,
			inEle: nPage
		});
	},
	showResult: function(answers, params) {
		var win = false;
		var no7_answers = ['伊右衛門', 'おーいお茶', '生茶'];
    if (answers[3] == '毎日' || no7_answers.indexOf(answers[6]) > -1) {
      win = true;
    }
    var result = document.getElementById('result');
    var resultMsg = document.getElementById('resultMsg');
    if (win) {
      document.getElementById('result').innerHTML = 'おめでとうございます';
      document.getElementById('resultMsg').innerHTML = '綾鷹クーポンが当たりました！';
      document.getElementById('winnerPic').style.display = 'block';
      document.getElementById('getCoupon').style.display = 'block';
      if (params.email) {
      	var formData = new FormData();
			  formData.append('sender', 'contact@o2otracking.com');
			  formData.append('subject', 'SoftBank Survey Coupon Link');
			  formData.append('recipient', params.email);
			  formData.append('content','<head><meta charset="utf-8"></head><div style="text-align:center;font-weight:600;color:#FF4244;font-size:28px;">おめでとうございます</div><br><br><div style="text-align:center;font-weight:600;">綾鷹クーポンが当たりました！</div><a href="http://cpn.sbg.jp/coupon/display/951377211132/e14e253f527ccc44e402cd1eacbbb833" target="_blank" style="text-decoration:none;"><button style="display:block;margin:20px auto;margin-bottom:40px;border-radius:5px;background-color:#E54C3C;border:none;color:white;width:200px;height:50px;font-weight:600;">クーポンを受取る</button></a>');
			  axios.post('https://www.mobileads.com/mail/send', formData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function(response) {
			    console.log(response);
			  }).catch(function(error) {
			    console.log(error)
			  });
      }
      else {
      	console.log('email not found');
      }
    }
    else {
    	console.log('loser, no email sent');
    }
    transitions.switch({
	  	outEle: document.getElementById('page10'),
	  	inEle: document.getElementById('page11')
	  });
	}
}

window.survey = survey;