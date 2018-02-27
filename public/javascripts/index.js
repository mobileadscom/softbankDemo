import jammer from './jammer';
import transitions from './transitions';
import '../stylesheets/style.css';
import '../stylesheets/miniSelect.css';

var survey = {
	answers: [],
	currentQuestion: 1,
	init: function() {
		var _this = this;
		var nextBtns = document.getElementsByClassName('next-btn');
		var backBtns = document.getElementsByClassName('back-btn');
		var pages = document.getElementsByClassName('page');
    var answers = document.getElementsByClassName('answer');

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
      		_this.answers[_this.currentQuestion - 1] = this.innerHTML + ": " + document.getElementById(this.dataset.target).value;
      	}
      	else {
      		_this.answers[_this.currentQuestion - 1] = this.innerHTML;
      	}
        console.log(_this.answers);
      }
    }

		for (var b = 0; b < nextBtns.length; b++) {
			nextBtns[b].onclick = function() {
				if (_this.currentQuestion == 3) {
					_this.answers[2] = document.getElementById('prefectures').value;
				}
				if (_this.answers[_this.currentQuestion - 1]) {
					if (!jammer.isJammed(this)) {
	          jammer.jam(this);
	          _this.changeQuestion(1);
					}
				}
				else {
          alert('Please answer this question to proceed.');
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

		var joinBtn = document.getElementById('toCampaign');
		joinBtn.onclick = function() {
			var cPage = document.getElementById('page9');
		  transitions.switch({
		  	outEle: document.getElementById('page9'),
		  	inEle: document.getElementById('page11'),
		  	inCallback: _this.showResult(_this.answers)
		  });
		};

		for (var p = 0; p < pages.length; p++) {
			if (pages[p].id != 'page1') {
				pages[p].style.display = 'none';
			}
		}
	},
	changeQuestion: function(i) {
		var cPage = document.getElementById('page' + this.currentQuestion.toString());
    if (i > 0) {
    	this.currentQuestion++;
    }
    else {
    	this.currentQuestion--;
    }
		var nPage = document.getElementById('page' + this.currentQuestion.toString());
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
	}
}

window.survey = survey;