import miniPages from './miniPages';
import {singleAnswerQuestion, multipleAnswerQuestion, dropdownQuestion} from './questions';
import miniSelect from './miniSelect';
import modal from './modal';
import {winningLogic, coupon} from './winningLogic';
import user from './userDemo';
import '../stylesheets/miniSelect.css';
import '../stylesheets/style.css';
import '../stylesheets/miniCheckbox.css';
import '../stylesheets/modal.css';
import '../stylesheets/regForm.css';

var app = {
	storage: 'o2odemo_en',
	pages: null, // array of pages
	params: {}, // params in query string
	q: [], // array of questions
	player: null, //youtube player
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
	initResult(state, couponLink) {
		if (state == 'win') {
			document.getElementById('resultTitle').innerHTML = "Congratulations.";
			document.getElementById('resultDescription').innerHTML = "You are qualified for our offer.";
			if (user.isWanderer) {
				document.getElementById('couponLink').style.display = 'none';
				document.getElementById('resultInstruction').style.display = 'none;'
			}
			else {
				document.getElementById('resultInstruction').innerHTML = "Please click the button below to get your coupon";
			}

			if (couponLink) {
				document.getElementById('couponLoader').style.display = 'none';
				document.getElementById('couponLink').href = couponLink;
				document.getElementById('couponLink').setAttribute('target', '_blank');
			  document.getElementById('getCoupon').innerText = 'Here is your coupon.';
			}
		}
		else {
			document.getElementById('resultTitle').innerHTML = "Unfortunately, you are not qualified. Thank you for your time. <br>You may exit by closing this page";
			document.getElementById('resultImage').style.display = 'none';
			document.getElementById('couponLink').style.display = 'none';
		}
	},
	processResult() {
		var resultProperties = winningLogic.process(this.q, !user.isWanderer);
		console.log(resultProperties);
		var state = resultProperties.trackingResult;
		var actualResult = resultProperties.actualResult;
		var group = resultProperties.group;
		var flag = resultProperties.flag;

		if (!user.isWanderer) {
			if (actualResult == 'win') {
  			user.win(user.info.id, group, user.source).then((response) => {
					console.log(response);
					if (response.data.couponLink) {
						this.initResult('win', response.data.couponLink);
						var message = '綾鷹クーポンが当たりました！ ' + response.data.couponLink;
						user.messageTwitter(message);

						if (user.info.id.indexOf('@') > -1) { // login via email
		        	var emailContent = '<head><meta charset="utf-8"></head><div style="text-align:center;font-weight:600;color:#FF4244;font-size:28px;">Congratulations. You are qualified for our offer.</div><br><br><div style="text-align:center;font-weight:600;">Please click the button below to get your coupon.</div><a href="' + response.data.couponLink + '" target="_blank" style="text-decoration:none;"><button style="display:block;margin:20px auto;margin-bottom:40px;border-radius:5px;background-color:#E54C3C;border:none;color:white;width:200px;height:50px;font-weight:600;">Coupon</button></a>';
	        	  user.sendEmail(user.info.id, 'MobileAds Coupon Link', emailContent);
						}
						// user.passResult(user.info.id, flag, user.source, response.data.couponLink);
					}
					else {
						this.initResult('lose');
						// user.passResult(user.info.id, flag, user.source);
					}
  			}).catch((error) => {
  				console.log(error);
	  			this.initResult('win');
  			});
  		}
  		else {
  			user.lose(user.info.id, user.source).then((response) => {
  				console.log(response);
  				// user.passResult(user.info.id, flag, user.source);
  			}).catch((error) => {
  				console.log(error);
  			});
  			this.initResult('lose');
  		}

  		if (state == 'win') {
  			//track win
  			// user.trackWin(user.info.id);
  		}
  		else {
  			// user.trackLose(user.info.id);
  			// track lose
  		}
		}
		else {
			this.initResult(state);
		}	
	},
	continue: function() {
		var answerJson = '{}';
		if (localStorage.getItem('localAnswers')) {
			var temp = JSON.parse(localStorage.getItem('localAnswers'));
			if (temp[this.storage] != 'undefined') {
				answerJson = temp[this.storage];
			}
		}

		var localAnswers = answerJson;
		var userAnswers = [];
		var noQuestionAnswered = 0;
		if (localAnswers) {
			if (localAnswers.hasOwnProperty(user.info.id)) {
				userAnswers = localAnswers[user.info.id];
				noQuestionAnswered = userAnswers.length - 1;
			}
		}
		
		if (!userAnswers) {
			userAnswers = JSON.parse(user.info.Answers);
			noQuestionAnswered = user.info.noQuestionAnswered;
		}

		/*apply answer to answered question */
		for (var w = 1; w < this.q.length; w++) {
			if (userAnswers[w]) {
			  this.q[w].setAnswer(userAnswers[w]);
			}
		}

		if (user.info.state == 'win') {
			this.initResult('win', user.info.couponLink);
			this.pages.toPage('resultPage');
		}
		else if (user.info.state == 'lose') {
			this.initResult('lose');
			this.pages.toPage('resultPage');
		}
		else {
			if (noQuestionAnswered > 0) {
				if (noQuestionAnswered < this.q.length - 1) {
					this.pages.toPage('page' + (noQuestionAnswered + 1).toString());
				}
				else {
					this.pages.toPage('page' + (this.q.length - 1).toString());
				}
			}
			else {
				this.pages.toPage('termsPage');
			}
		}
	},
	events: function() {
		/* ==== Event Listeners ==== */
	  /* enabled terms agree checkbox when scrolled tnc to bottom */
	 /* var enableAgreeCheckbox = false;
	  document.getElementById('tnc').addEventListener('scroll', function(event) {
	  	if (!enableAgreeCheckbox) {
	  		var element = event.target;
		    if (element.scrollHeight - element.scrollTop < element.clientHeight + 50) {
		    	document.getElementById('startSurvey').disabled = false;*/
		      /*document.getElementById('agreeCheck').disabled = false;
		      enableAgreeCheckbox = true;*/
		 //    }
	  // 	}
	  // });
	  
	  /* enable start survey button when terms agree checkbox is checked */
	  document.getElementById('agreeCheck').onchange = function() {
	    if (this.checked) {
				document.getElementById('startSurvey').disabled = false;
	    }
	    else {
	    	document.getElementById('startSurvey').disabled = true;
	    }
	  }
	  
	  /* Finished Answering Questions, process result */
	  /*var processed = false;
	  document.getElementById('toResult').addEventListener('click', () => {
	  	if (!processed) {
	  		processed = true;
	  		this.processResult();
	  	}
	  });*/

		/* email registration */
	  var form = document.getElementById('regForm');
	  form.onsubmit = (event) => {
	    var spinner = document.getElementById('formWorking');
	    var donePage = document.getElementById('doneSec');
	    var regPage = document.getElementById('regSec');
		  form.style.display = 'none';
	    spinner.style.display = 'block';
      event.preventDefault();
      var email = document.getElementById('emailInput').value;
			user.register(email).then((response) => {
				console.log(response);
        spinner.style.display = 'none';
        if (response.data.status == true) {
        	this.formSections.toPage('doneSec');
        	var emailContent = '<head><meta charset="utf-8"></head>Thank you for registering. Please click the link below to complete your registration and join the questionnaire<br><br><a href="https://rmarepo.richmediaads.com/o2o/demo/en/index.html?userId=' + email + '" target="_blank">https://rmarepo.richmediaads.com/o2o/demo/en/index.html?userId=' + email + '</a>';
        	user.sendEmail(email, 'MobileAds Survey Link', emailContent);
        	// user.trackRegister();
        }
        else if (response.data.message == 'user exist.') {
        	user.info = response.data.user;
        	this.enableSaveAnswer();
        	this.continue();
					modal.closeAll();
        }

			}).catch((error) => {
				console.log(error);
				form.style.display = 'block';
        spinner.style.display = 'none';
			});
    };

    /* twitter registration / login */
    var twitReg = document.getElementById('regTwitter');
    twitReg.onclick = () => {
      var regLoader = document.getElementById('regWorking');
      var regButtons = document.getElementById('regButtons');
      regLoader.style.display = 'block';
      regButtons.style.display = 'none';
			user.registerTwitter().then((result) => {
        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        // You can use these server side with your app's credentials to access the Twitter API.
        user.twitter.token = result.credential.accessToken;
        user.twitter.secret = result.credential.secret;
        var twitterId = result.additionalUserInfo.profile.id_str;
        this.initUser(twitterId, true, true);
      }).catch((error) => {
      	regLoader.style.display = 'none';
        regButtons.style.display = 'block';
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        alert(errorMessage);
        // ..
      });
    };

    var followBtn = document.getElementById('followBtn');
    followBtn.onclick = () => {
    	followBtn.style.display = 'none';
    	user.followTwitter().then((response) => {
				console.log(response);
	        if (response.data == 'followed!') {
	          var sMsg = document.getElementById('successFollow');
	          sMsg.style.display = 'block';
	          setTimeout(() => {
	            this.continue();
	          }, 2000);
	        }
    	}).catch((error) => {
				console.log(error);
				followBtn.style.display = 'block';
    	});
    }

    document.getElementById('toVideo').addEventListener('click', () => {
			setTimeout(() => {
				this.player.playVideo();
			}, 300);
    });
	  /* ==== Event Listeners End ==== */
	},
	checkTwitter: function() { // Check if user is following official page
		user.isFollowingTwitter().then((resp) => {
      console.log(resp);
    //   if (resp.data == 'following') {
				// this.continue();
    //   }
    //   else {
		  //    this.pages.toPage('followPage');
    //   }
    this.continue();
    }).catch((error) => {
      console.log(error);
      document.getElementById('regWorking').style.display = 'none';
      document.getElementById('regButtons').style.display = 'block';
    });
	},
	initUser: function(userId, autoRegister, isTwitter) {
		/* check if user is registered, if no, then register user, if yes, continue on where the user left off */
		user.get(userId).then((response) => {
			console.log(response);
    	if (response.data.status == false) { // user is not registered
	    	if (autoRegister) {
	    		user.register(userId).then((res) => { // auto register user
						console.log(res);
						user.isWanderer = false;
						user.info.id = userId;
						user.source = this.params.source;
						if (isTwitter) {
							this.checkTwitter();
						}
						else {
							this.continue();
						}
					  this.enableSaveAnswer();
					  // user.trackRegister();
	    		}).catch((err) => {
	    			user.isWanderer = true;
	    			console.log(err);
	    			this.pages.toPage('termsPage');
	    		});
	    	}
	    	else {
	    		this.pages.toPage('regPage');
	    		this.enableSaveAnswer();
	    	}
    	}
    	else { // user is registered
    		user.isWanderer = false;
				user.info = response.data.user;
				user.source = this.params.source;
				
				if (isTwitter) {
					this.checkTwitter();
				}
				else {
					this.continue();
				}
				this.enableSaveAnswer();
    	}
    }).catch((error) => {
    	user.isWanderer = true;
			console.log(error);
			this.pages.toPage('termsPage');
    });
	},
	enableSaveAnswer: function() {
    /* Auto save answer for every questions*/
	  var saveBtns = document.getElementsByClassName('saveQuestion');
	  console.log('enableSaveAnswer');
	  for (var s = 0; s < saveBtns.length; s++ ) {
	  	saveBtns[s].addEventListener('click', (e) => {
	  		if (typeof(Storage) !== "undefined") {
					var answerJson = '{}';
	  			if (localStorage.getItem('localAnswers')) {
	  				answerJson = localStorage.getItem('localAnswers');
	  			}
	  			var localAnswers = JSON.parse(answerJson);
	  			if (!localAnswers) {
	  				localAnswers = {};
		  		}
			  	var qArray = [];
			  	for (var n = 1; n < this.q.length; n++) {
						if (this.q[n].selectedAnswer) {
							qArray[n] = this.q[n].selectedAnswer;
						}
			  	}

			  	if (typeof localAnswers[this.storage] == 'undefined') {
			  		localAnswers[this.storage] = {};
			  	}

			  	localAnswers[this.storage][user.info.id] = qArray;
			  	localStorage.setItem('localAnswers', JSON.stringify(localAnswers));
	  		}
	  		var qNo = parseInt(e.target.dataset.question);
	  		// user.trackAnswer(this.params.userId, qNo, this.q[qNo].selectedAnswer);
			  /*user.saveAnswer(user.info.id, qNo, this.q[qNo].selectedAnswer).then((response) => {
			  	console.log(response);
			  }).catch((error) => {
			  	console.log(error);
			  });*/
	  	})
	 }
	},
	setQuestions() {
		/* ==== Set Questions ==== */
	  this.q[1] = new singleAnswerQuestion({
	  	wrapper: document.getElementById('q1'),
	  	question: '<span class="red">QUESTION 1</span><br>Please tell me your gender',
	  	answers: [{
	    	value: 'Male',
	    	text: 'Male',
	    }, {
	    	value: 'Female',
	    	text: 'Female'
	    }],
	    nextBtn: document.getElementById('toQ2')
	  });
	  
	  this.q[2] = new singleAnswerQuestion({
	  	wrapper: document.getElementById('q2'),
	  	question: '<span class="red">QUESTION 2</span><br>Please tell me your age',
	  	answers: [{
	    	value: 'Below 19',
	    	text: 'Below 19',
	    }, {
	    	value: '20 ~ 24',
	    	text: '20 ~ 24'
	    }, {
	    	value: '25 ~ 29',
	    	text: '25 ~ 29'
	    }, {
	    	value: '30 ~ 34',
	    	text: '30 ~ 34'
	    }, {
	    	value: '35 ~ 39',
	    	text: '35 ~ 39'
	    }, {
	    	value: '40 ~ 44',
	    	text: '40 ~ 44'
	    }, {
	    	value: '45 ~ 49',
	    	text: '45 ~ 49'
	    }, {
	    	value: '50 ~ 54',
	    	text: '50 ~ 54'
	    }, {
	    	value: '55 ~ 59',
	    	text: '55 ~ 59'
	    }, {
	    	value: '60 and above',
	    	text: '60 and above'
	    }],
	    nextBtn: document.getElementById('toQ3')
	  });

	  this.q[3] = new dropdownQuestion({
	  	wrapper: document.getElementById('q3'),
	  	question: '<span class="red">QUESTION 3</span><br>Where do you live?',
	  	answers: [
				{ value:'Argentina', text:'Argentina'},
				{ value:'Australia', text:'Australia'},
				{ value:'Belgium', text:'Belgium'},
				{ value:'Brazil', text:'Brazil'},
				{ value:'China', text:'China'},
				{ value:'Myanmar/Burma', text:'Myanmar/Burma'},
				{ value:'Cambodia', text:'Cambodia'},
				{ value:'Canada', text:'Canada'},
				{ value:'Denmark', text:'Denmark'},
				{ value:'Egypt', text:'Egypt'},
				{ value:'France', text:'France'},
				{ value:'Germany', text:'Germany'},
				{ value:'Great Britain', text:'Great Britain'},
				{ value:'Indonesia', text:'Indonesia'},
				{ value:'Italy', text:'Italy'},
				{ value:'Japan', text:'Japan'},
				{ value:'Malaysia', text:'Malaysia'},
				{ value:'Netherlands', text:'Netherlands'},
				{ value:'Philippines', text:'Philippines'},
				{ value:'Singapore', text:'Singapore'},
				{ value:'South Korea', text:'South Korea'},
				{ value:'Thailand', text:'Thailand'},
				{ value:'United States', text:'United States'},
				{ value:'Vietnam', text:'Vietnam'},
	  	],
	  	nextBtn: document.getElementById('toQ4')
	  });

	  this.q[4] = new singleAnswerQuestion({
	  	wrapper: document.getElementById('q4'),
	  	question: '<span class="red">QUESTION 4</span><br>Please tell me how often do you drink green tea in plactic bottle?',
	  	answers: [{
	    	value: 'Almost every day',
	    	text: 'Almost every day',
	    }, {
	    	value: '4 - 5 times a week',
	    	text: '4 - 5 times a week'
	    }, {
	    	value: '2 - 3 times a week',
	    	text: '2 - 3 times a week'
	    }, {
	    	value: '1 - 2 times a week',
	    	text: '1 - 2 times a week'
	    }, {
	    	value: 'Biweekly',
	    	text: 'Biweekly'
	    }, {
	    	value: 'Less than once a month',
	    	text: 'Less than once a month'
	    }],
	    nextBtn: document.getElementById('toQ5')
	  });

	  this.q[5] = new multipleAnswerQuestion({
	  	wrapper: document.getElementById('q5'),
	  	question: '<span class="red">QUESTION 5</span><br>Which type of store you visited frequently?',
	  	answers: [{
	    	value: 'Convenience Store',
	    	text: 'Convenience Store',
	    }, {
	    	value: 'Supermarket',
	    	text: 'Supermarket'
	    }, {
	    	value: 'Pharmacy',
	    	text: 'Pharmacy'
	    }, {
	    	value: 'Online Store',
	    	text: 'Online Store'
	    }, {
	    	text: 'Other',
	      type: 'text'
	    }],
	    nextBtn: document.getElementById('toQ6')
	  });

	  this.q[6] = new singleAnswerQuestion({
	  	wrapper: document.getElementById('q6'),
	  	question: '<span class="red">QUESTION 6</span><br>Have you heard of our coffee brand before?',
	  	answers: [{
	    	value: 'Yes',
	    	text: 'Yes',
	    }, {
	    	value: 'No',
	    	text: 'No'
	    }, {
	    	value: 'I knew but never purchased',
	    	text: 'I knew but never purchased'
	    }, {
	    	value: 'I don\'t know the product',
	    	text: 'I don\'t know the product'
	    }],
	    nextBtn: document.getElementById('toApply')
	  });
	  /* ==== Questions End ==== */
	},
	init: function() {
		var vidWidth = document.getElementById('vid').clientWidth;
    var vidHeight = document.getElementById('vid').clientHeight;

		/* init pagination */
		this.params = this.getParams();
		this.params.source = 'source1'; // dummy source
		this.pages = new miniPages({
	  	pageWrapperClass: document.getElementById('page-wrapper'),
	  	pageClass: 'page',
	  	initialPage: document.getElementById('loadingPage'),
	  	pageButtonClass: 'pageBtn'
	  });

	  /* init registration form sections */
	  this.formSections = new miniPages({
	  	pageWrapperClass: document.getElementById('formSecWrapper'),
	  	pageClass: 'sec',
	  	initialPage: document.getElementById('regSec')
	  });
    
    this.setQuestions();
    this.events();
    /* apply mini select to <select> */
	  miniSelect.init('miniSelect');

	  /* User Info */
	  if (!this.params.userId || !this.params.source) {
		  user.isWanderer = true;
	    setTimeout(() => {
		    this.pages.toPage('regPage');
		    // this.pages.toPage('termsPage');
		  }, 1000);
	  }
	  else {
			this.initUser(this.params.userId, false);
		}

    /* get coupons */
		coupon.get(this.params.source);
	  
	  var processed = false; // check if result has been processed to avoid double result processsing

		//youtube api
    var ytScript = document.createElement('script');
    ytScript.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(ytScript, firstScriptTag);
    
    window.onYouTubeIframeAPIReady = () => {
      this.player = new YT.Player('vid', {
        height: vidHeight.toString(),
        width: vidWidth.toString(),
        playerVars: {'rel': 0,'showinfo': 0, 'controls': 0, 'playsinline': 1},
        videoId: '6kpZW8oQ9tw',
        events: {
          'onStateChange': (event) => {
            if (event.data == YT.PlayerState.ENDED) {
            	if (!processed) {
	            	processed = true;
	            	this.processResult();
								this.pages.toPage('resultPage');
							}
            }
          }
        }
      });
    }
	}
}

document.addEventListener('DOMContentLoaded', function() {
  app.init();
  modal.init();
  window.q = app.q;
  window.params = app.params;
});

export {
	user,
	coupon,
}