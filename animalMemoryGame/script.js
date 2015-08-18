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
  var imageArray = ['url("https://boldlyproclaimingchrist.files.wordpress.com/2009/09/wolf.jpg?w=600")',
  'url("https://boldlyproclaimingchrist.files.wordpress.com/2009/09/wolf.jpg?w=600")',
  'url("http://cdn4.list25.com/wp-content/uploads/2011/11/dangerousanimals.png")',
  'url("http://cdn4.list25.com/wp-content/uploads/2011/11/dangerousanimals.png")',
  'url("http://www.planetdeadly.com/wp-content/uploads/grizzly-bear-420x347.jpg")',
  'url("http://www.planetdeadly.com/wp-content/uploads/grizzly-bear-420x347.jpg")',
  'url("http://www.hd-wallpapersdownload.com/upload/bulk-upload/ferocious-tiger-images.jpg")',
  'url("http://www.hd-wallpapersdownload.com/upload/bulk-upload/ferocious-tiger-images.jpg")',
  'url("http://www.freemalaysiatoday.com/wp-content/uploads/2013/12/Sun-Bears-300x224.jpg")',
  'url("http://www.freemalaysiatoday.com/wp-content/uploads/2013/12/Sun-Bears-300x224.jpg")',
  'url("http://www.awesomelycute.com/gallery/2011/09/awesomely-cute-animals-245.jpg")',
  'url("http://www.awesomelycute.com/gallery/2011/09/awesomely-cute-animals-245.jpg")',
  'url("http://i00.i.aliimg.com/wsphoto/v0/1904821646_1/ferocious-panther-diamond-painting-set-for-embroidery-diamond-cross-stitch-kit-Inlaid-decorative-painting-handmade-craft.jpg")',
  'url("http://i00.i.aliimg.com/wsphoto/v0/1904821646_1/ferocious-panther-diamond-painting-set-for-embroidery-diamond-cross-stitch-kit-Inlaid-decorative-painting-handmade-craft.jpg")',
  'url("http://3.bp.blogspot.com/-6EQqAX2Sqec/TvpEs6R6B8I/AAAAAAAAAZo/GJvvR4mO2eA/s1600/piranha+1.jpg")',
  'url("http://3.bp.blogspot.com/-6EQqAX2Sqec/TvpEs6R6B8I/AAAAAAAAAZo/GJvvR4mO2eA/s1600/piranha+1.jpg")'];

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

