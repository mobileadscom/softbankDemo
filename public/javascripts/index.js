import axios from 'axios';
import jammer from './jammer';
import transitions from './transitions';
import '../stylesheets/style.css';

// var domain = 'https://www.mobileads.com';
var domain = 'http://192.168.99.100';
var twitDomain = '';

var survey = {
  answers: [],
  currentQuestion: 1,
  player: null,
  params: {},
  userInfo: {},
  twitUserToken: '',
  twitUserSecret: '',
  loginMethod: 'email',
  executeWin: 0, // youtube state change api keep firing (BUG), track to run only one time
  couponsLeft: {
    A: 0,
    B: 0
  },
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
          _this.answers[_this.currentQuestion - 1] = this.getAttribute('value');
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
            /* req */
            // save answer
            if (_this.userInfo.id) {
              var ansForm = new FormData();
              ansForm.append('id', _this.userInfo.id);
              ansForm.append('questionNo', _this.currentQuestion);
              ansForm.append('answer', _this.answers[_this.currentQuestion - 1])
              axios.post(domain + '/api/coupon/softbank/user_answer_save', ansForm, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function(response) {
                console.log(response);
              }).catch(function(error) {
                console.log(error);
              });
            }
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
        _this.currentQuestion = 1;
      }
      else {
        alert('利用規約に同意ください。');
        this.blur();
      }
    };

    for (var p = 0; p < pages.length; p++) {
      if (pages[p].id != 'loadingPage') {
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
        playerVars: {'rel': 0,'showinfo': 0, 'controls': 0, 'playsinline': 1},
        videoId: '6kpZW8oQ9tw',
        events: {
          'onStateChange': function(event){
            if (event.data == YT.PlayerState.ENDED) {
              if (_this.executeWin == 0) {
                _this.showResult(_this.answers, _this.params, _this.couponsLeft);
                _this.executeWin++;
              }
            }
          }
        }
      });
    }
    
    //Retrieve Coupons Count
    /*req*/
    axios.get(domain + '/api/coupon/softbank/coupons_check').then(function(response) {
      console.log(response);
      _this.couponsLeft.A = response.data.A;
      _this.couponsLeft.B = response.data.B;
    }).catch(function(error) {
      console.log(error);
      _this.couponsLeft.A = 0;
      _this.couponsLeft.B = 0;
    });

    if (this.params.id) {
      if (/\D/.test(this.params.id)) { // id is email
        this.getUserInfo(this.params.id);
      }
      else { // id is twitter id
        setTimeout(function() {
          transitions.switch({
            outEle: document.getElementById('loadingPage'),
            inEle: document.getElementById('regPage')
          });
        }, 1000);
      }
    }
    else {
      if (this.params.q) {
        var qNO = parseInt(_this.params.q) + 1;
        setTimeout(function() {
          transitions.switch({
            outEle: document.getElementById('loadingPage'),
            inEle: document.getElementById('page' + qNO.toString())
          });
        }, 2000);
      }
      else {
        setTimeout(function() {
          transitions.switch({
            outEle: document.getElementById('loadingPage'),
            inEle: document.getElementById('regPage')
          });
        }, 1000);
      }
    }
  },
  continue: function(data, currentPage, isFollowing) {
    var _this = this;

    if (data.user.state == 'win') {
      this.showWin(data.user.couponLink);
        transitions.switch({
          outEle: currentPage,
          inEle: document.getElementById('page11'),
      });
    }
    else if (data.user.state == 'lose') {
      transitions.switch({
        outEle: currentPage,
        inEle: document.getElementById('page11'),
      });
    }
    else {
      this.userInfo = {
        id: data.user.id,
        answered: data.user.noQuestionAnswered,
        answers: []
      }

      var answersObject = JSON.parse(data.user.Answers);
      for ( var i in answersObject) {
        var no = parseInt(i) - 1;
        this.userInfo.answers[no] = answersObject[i];
      }
      
      var getCheckPointPage = function(answeredNo) {
        if (answeredNo == 0) {
          return document.getElementById('page1');
        }
        else {
          var qNO = answeredNo + 2;
          return document.getElementById('page' + qNO.toString());
        }
      };
       
      var toPage = document.getElementById('page1');
       
      if (isFollowing == true) {
        var toPage = getCheckPointPage(this.userInfo.answered);
      }
      else {
        toPage = document.getElementById('followPage');
        axios.post(twitDomain + '/listenFollow', {
          id: data.user.id
        }).then(function(response) {
          console.log(response);
          if (response.data == 'followed!') {
            var conPage = getCheckPointPage(_this.userInfo.answered);
            transitions.switch({
              outEle: toPage,
              inEle: conPage
            });
          }
        }).catch(function(error) {
          console.log(error);
        });
      }
      
      this.currentQuestion = this.userInfo.answered + 1;
      this.answers = this.userInfo.answers;
      transitions.switch({
        outEle: currentPage,
        inEle: toPage,
        inCallback: this.applyAnswers(_this.answers)
      });
    }
  },
  getUserInfo: function(userId) {
    /*req*/
    var _this = this;
    axios.get(domain + '/api/coupon/softbank/user_info?', {
      params: {
        id: userId
      }
    }).then(function(response) {
      console.log(response);
      if (!response.data.status) {
        setTimeout(function() {
          transitions.switch({
            outEle: document.getElementById('loadingPage'),
            inEle: document.getElementById('regPage')
          });
        }, 1000);
      }
      else {
        _this.loginMethod = 'email';
        _this.continue(response.data, document.getElementById('loadingPage'), true);
      }
    }).catch(function(error) {
      console.log(error);
    });
  },
  applyAnswers: function(ans) {
    console.log(ans);
    for (var a = 0; a < ans.length; a++) {
      var q = a + 1;
      var ansWrapper = document.getElementById('answer' + q.toString());
      var ansText = ans[a].indexOf('その他') > -1 ? 'その他' : ans[a];
      if (q != 3) {
        var ansBlock = ansWrapper.childNodes
        for (var b = 0; b < ansBlock.length; b++) {
          if (ansBlock[b].nodeType == 1) {
            if (ansBlock[b].getAttribute('value') == ansText) {
              ansBlock[b].classList.add('selected');
            }
            if (ansText == 'その他') {
              document.getElementById('q' + q.toString() + 'a').value = ans[a].split(': ')[1];
            }
          }
        }
      }
      else if (q == 3) {
        var selectEl = document.getElementById('prefectures');
        var ansDis = ansWrapper.getElementsByClassName('miniSelect-selected')[0];
        selectEl.value = ans[a];
        ansDis.innerHTML = ans[a];
      }
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
  showWin: function(couponLink) {
    document.getElementById('result').innerHTML = 'おめでとうございます';
    document.getElementById('resultMsg').innerHTML = '綾鷹クーポンが当たりました！';
    document.getElementById('winnerPic').style.display = 'block';
    document.getElementById('getCoupon').style.display = 'block';
    document.getElementById('couponLink').setAttribute('href', couponLink);
  },
  showResult: function(answers, params, couponsLeft) {
    var win = false;
    var group = 'A';
    var no7_answers = ['伊右衛門', 'おーいお茶', '生茶'];

    /* Winning Logic */
    if (answers[3] == '毎日' && no7_answers.indexOf(answers[6]) > -1) {
      if (couponsLeft.A > 0) {
        group = 'A';
        win = true;
      }
      else if (couponsLeft.B > 0) {
        group = 'B';
        win = true;
      }
      else {
        win = false;
      }
    }
    else if (answers[3] == '毎日') {
      if (couponsLeft.A > 0) {
        win = true;
        group = 'A';
      }
      else {
        win = false;
      }
    }
    else if (no7_answers.indexOf(answers[6]) > -1) {
      if (couponsLeft.B > 0) {
        win = true;
        group = 'B';
      }
      else {
        win = false;
      }
    }
    else {
      win = false;
    }
    console.log(couponsLeft);
    console.log(win, group);

    var result = document.getElementById('result');
    var resultMsg = document.getElementById('resultMsg');
    if (win) {
      var _this = this;
      // Mark User as winner and Get Coupon Link from BE
      /* req */
      if (_this.userInfo.id) {
        var markForm = new FormData();
        markForm.append('id', _this.userInfo.id);
        markForm.append('state', 'win');
        markForm.append('couponGroup', group);
        axios.post(domain + '/api/coupon/softbank/mark_user', markForm, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function(response) {
          console.log(response);
          _this.showWin(response.data.couponLink);

          if (_this.loginMethod == 'email') {
            var formData = new FormData();
            formData.append('sender', 'contact@o2otracking.com');
            formData.append('subject', 'SoftBank Survey Coupon Link');
            formData.append('recipient', _this.userInfo.id);
            formData.append('content','<head><meta charset="utf-8"></head><div style="text-align:center;font-weight:600;color:#FF4244;font-size:28px;">おめでとうございます</div><br><br><div style="text-align:center;font-weight:600;">綾鷹クーポンが当たりました！</div><a href="' + response.data.couponLink + '" target="_blank" style="text-decoration:none;"><button style="display:block;margin:20px auto;margin-bottom:40px;border-radius:5px;background-color:#E54C3C;border:none;color:white;width:200px;height:50px;font-weight:600;">クーポンを受取る</button></a>');
            axios.post(domain + '/mail/send', formData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function(resp) {
              console.log(resp);
            }).catch(function(error) {
              console.log(error)
            });
          }
          else if (_this.loginMethod == 'twitter') {
            axios.post(twitDomain + '/sendMessage', {
              token: _this.twitUserToken,
              tokenSecret: _this.twitUserSecret,
              recipientId: _this.userInfo.id,
              text: '綾鷹クーポンが当たりました！ ' + response.data.couponLink
            }).then(function(resp) {
              console.log(resp);
            }).catch(function(error) {
              console.log(error);
            });
          }
        }).catch(function(error) {
          console.log(error);
        });
      }
      else {
        console.log('email not found');
      }
    }
    else {
      // Mark user as loser
      /* req */
      if (_this.userInfo.id) {
        var markForm = new FormData();
        markForm.append('id', _this.userInfo.id);
        markForm.append('state', 'lose');
        axios.post(domain + '/api/coupon/softbank/mark_user', markForm, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function(response) {
          console.log(response);
        }).catch(function(error) {
          console.log(error);
        })
      }
      console.log('loser, no email sent');
    }
    transitions.switch({
      outEle: document.getElementById('page10'),
      inEle: document.getElementById('page11')
    });
  }
}

var registration = {
  init: function() {
    var form = document.getElementById('regFor');
    var spinner = document.getElementById('formWorking');
    var donePage = document.getElementById('doneSec');
    var regPage = document.getElementById('regSec');

    form.onsubmit = function(event) {
      event.preventDefault();
      var userId = document.getElementById('emailInput').value;
      form.style.display = 'none';
      spinner.style.display = 'block';
      /* req */
      var regForm = new FormData();
      regForm.append('id', userId);
      axios.post(domain + '/api/coupon/softbank/register', regForm, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function(response) {
        console.log(response);
        spinner.style.display = 'none';
        if (response.data.status == true) {
           transitions.switch({
            outEle: regSec,
            inEle: doneSec
          });
          var formData = new FormData();
          formData.append('sender', 'contact@o2otracking.com');
          formData.append('subject', 'SoftBank Survey Demo Link');
          formData.append('recipient', userId);
          formData.append('content', '<head><meta charset="utf-8"></head>ご登録ありがとうございました。下記にあるリンクをクリックしてください。その後キャンペーンへの参加をお願いします<br><br><a href="https://s3.amazonaws.com/rmarepo/o2odemo/index.html?id=' + userId + '" target="_blank">https://s3.amazonaws.com/rmarepo/o2odemo/index.html?id=' + userId + '</a>');
          axios.post(domain + '/mail/send', formData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function(resp) {
            console.log(resp);
          }).catch(function(error) {
            console.log(error);
          });
        }
        else if (response.data.message == 'user exist.') {
          survey.loginMethod = 'email';
          window.modal.closeAll();
          survey.continue(response.data, document.getElementById('regPage'), true);
          // window.location.href = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + window.location.pathname + '?id=' + userId;
        }
      }).catch(function(error) {
        console.log(error);
        form.style.display = 'block';
        spinner.style.display = 'none';
      });
    }

    var regT = document.getElementById('regTwitter');
    regT.onclick = function() {
      var provider = new firebase.auth.TwitterAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        // You can use these server side with your app's credentials to access the Twitter API.
        var token = result.credential.accessToken;
        var secret = result.credential.secret;
        survey.twitUserToken = token;
        survey.twitUserSecret = secret;
        // The signed-in user info.
        var user = result.user;
        var twitterId = result.additionalUserInfo.profile.id_str;
        console.log(twitterId);
        var isFollowing = false;
        var isNew = false;
        var userData = {};

        var twitForm = new FormData();
        twitForm.append('id', twitterId);
        axios.post(domain + '/api/coupon/softbank/register', twitForm, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function(response) {
          console.log(response);
          if (response.data.status == true) {
            console.log('new user');
            isNew = true;
            userData.user = {
              Answers: "{}",
              couponLink: "",
              id: twitterId,
              noQuestionAnswered: 0,
              state: '-'
            }
          }
          else {
            console.log('existing user, continue');
            isNew = false;
            userData = response.data;
          }

          survey.loginMethod = 'twitter';  
          
          axios.post(twitDomain + '/getUser', {
              token: token,
              tokenSecret: secret,
              id: twitterId
            }).then(function(resp) {
              console.log(resp);
              if (resp.data == 'following') {
                survey.continue(userData, document.getElementById('regPage'), true);
              }
              else {
                survey.continue(userData, document.getElementById('regPage'), false);
              }
            }).catch(function(error) {
              console.log(error);
            });
          
        }).catch(function(err) {
          console.log(err);
        });
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ..
      });
    }
  }
}

window.survey = survey;
window.registration = registration;