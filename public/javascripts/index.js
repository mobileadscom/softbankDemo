import jammer from './jammer';
import transitions from './transitions';
import '../stylesheets/style.css';

var survey = {
	answers: [],
	currentQuestion: 1,
	player: null,
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
            	_this.showResult(_this.answers);
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
	showResult: function(answers) {
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
    }
    transitions.switch({
	  	outEle: document.getElementById('page10'),
	  	inEle: document.getElementById('page11')
	  });
	}
}

window.survey = survey;