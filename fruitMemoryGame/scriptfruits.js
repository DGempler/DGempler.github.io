(function() {

  var body = document.querySelector('body');
  var container = document.getElementById('container');
  var score = document.getElementById('score');
  var div;
  var counter = 0;
  var clicked = [];
  var results = [];
  var button = document.querySelector('button');
  var lastClicked;
  var breakTrigger = false;

  var images = {};
  var imageArray = ['url("http://www.culinaryschools.org/clipart/fruit/apple-clipart.gif")',
  'url("http://www.culinaryschools.org/clipart/fruit/apple-clipart.gif")',
  'url("http://images.clipartpanda.com/fruit-border-clipart-fruits-and-vegetables-clip-art-border-336.jpg")',
  'url("http://images.clipartpanda.com/fruit-border-clipart-fruits-and-vegetables-clip-art-border-336.jpg")',
  'url("http://images.clipartpanda.com/strawberry-clip-art-Gerald_G_Simple_Fruit_(FF_Menu)_1.png")',
  'url("http://images.clipartpanda.com/strawberry-clip-art-Gerald_G_Simple_Fruit_(FF_Menu)_1.png")',
  'url("http://www.culinaryschools.org/clipart/fruit/bananna.gif")',
  'url("http://www.culinaryschools.org/clipart/fruit/bananna.gif")',
  'url("http://www.clipartlord.com/wp-content/uploads/2013/03/lemon.png")',
  'url("http://www.clipartlord.com/wp-content/uploads/2013/03/lemon.png")',
  'url("http://www.clipartbest.com/cliparts/yio/aqq/yioaqq6iE.gif")',
  'url("http://www.clipartbest.com/cliparts/yio/aqq/yioaqq6iE.gif")',
  'url("http://cliparts.co/cliparts/Rki/Mb6/RkiMb64cj.png")',
  'url("http://cliparts.co/cliparts/Rki/Mb6/RkiMb64cj.png")',
  'url("http://www.webweaver.nu/clipart/img/misc/food/fruit/kiwi.png")',
  'url("http://www.webweaver.nu/clipart/img/misc/food/fruit/kiwi.png")'];

  function shuffleImages() {
    imageArray = _.shuffle(imageArray);
    for (var i = 0; i < 17; i++) {
      images["div" + (i+1)] = imageArray[i];
    }

  }
  shuffleImages();

  button.addEventListener('click', function() {
    counter = 0;
    clicked = [];
    results = [];
    scoreTally();
    for (var i = 0; i < div.length; i ++) {
      div[i].style.backgroundImage = '';
    }
      shuffleImages();
  });



  function scoreTally() {
    score.innerHTML = 'Your current score is ' + results.length / 2;

    if (results.length == 16) {
      alert('YOU WON!');
    }
  }


  (function board() {

    for (var i = 1; i < 17; i++) {
      var checker = document.createElement('div');


      checker.style.float = "left";
      checker.style.paddingBottom = '150px';
      checker.style.width = '150px';
      checker.style.border = 'solid 1px black';
      checker.style.backgroundColor = 'teal';
      checker.setAttribute('id', 'div' + i);




      checker.addEventListener("click", function() {
        if (counter === 2) {
          for (var i = 0; i < div.length; i ++) {
            div[i].style.backgroundImage = '';
            for (var j = 0; j < results.length; j ++) {
              if(div[i].getAttribute('id') === results[j]) {
                div[i].style.backgroundImage = images[results[j]];
              }
            }
          }
          counter = 0;
        }
        else if (this.style.backgroundColor === "teal") {
          for (var key in images) {
            if (key === this.getAttribute('id')) {
              this.style.backgroundImage = images[key];
              this.style.backgroundSize = "150px 150px";
              counter ++;
              clicked.push(images[key]);
              results.push(key);
              if (counter == 2) {
                if (clicked[0] === clicked[1]) {
                  for (var j = 0; j < results.length-2; j++) {
                    if(results[results.length-1] === results[j] || results[results.length-2] === results[j]) {
                      breakTrigger = true;
                      break;
                    }
                  }
                  if (breakTrigger === false && results[results.length-1] !== results[results.length-2]) {
                    clicked = [];
                    scoreTally();
                  }
                   else {
                    results.pop();
                    results.pop();
                    clicked = [];
                    breakTrigger = false;
                  }
                }
                else {
                  results.pop();
                  results.pop();
                  clicked = [];
                  breakTrigger = false;
                }
              }
            }
          }
        }
      });
  container.appendChild(checker);
  }
  })();
  div = document.querySelectorAll('div');
  scoreTally();

})();

