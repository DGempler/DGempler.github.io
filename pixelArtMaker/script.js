/*
First create multiple divs using checkerboard as template
  create 2 kinds of boxes - one with attribute of class color & one with class box
  class color assign each of different colors
    use rgb to set colors

  set reset button - total and individual boxes (terniary)

  Here's the order of steps that I would implement:

Get 10 or so small divs on the screen
Add an event listener to each so that when I click on a pixel it turns red
Add a color palette div with 2 colors(red and purple)which allows the user to set the current "paintbrush" color instead of it always being set to red
Add the rest of the standard rainbow colors to the color palette
Add enough divs to fill up the entire screen
Bonus Challenges:

Add a color picker which allows the user to select any color. Look into the HTML5 color input.
Add the ability to click and drag to paint multiple pixels at once
Add a paintbucket tool which allows a user to drag a box across the screen and paint all pixels that fall inside that box
*/


(function() {
  var section = document.querySelector('#wrapper');
  var colorPicker = document.querySelector('#colorPicker');
  var chosenColor = "rgb(0,255,255)";
  var colorPalette = document.querySelector('.color');
  var input = document.querySelector('input');
  var divider;
  var mouseDown = false;
  var resetButton = document.querySelector('#reset');

  function divCreator() {
    var newDiv = document.createElement('div');
    newDiv.style.width = "10px";
    newDiv.style.paddingBottom = "10px";
    newDiv.style.cssFloat = "left";
    newDiv.style.backgroundColor = "rgb(255,255,255)";
    newDiv.style.border = "1px solid rgb(240,240,240)";
    newDiv.setAttribute("class", "divider");
    return section.appendChild(newDiv);
  }

  for (var i = 0; i < 3984; i++) {
    divCreator();
  }

  divider = document.querySelectorAll(".divider");

  function colorDivCreator(rgbCode) {
    var newDiv = document.createElement('div');
    newDiv.style.width = "39px";
    newDiv.style.paddingBottom = "38px";
    newDiv.style.cssFloat = "left";
    newDiv.style.backgroundColor = rgbCode;
    newDiv.style.border = "1px solid rgb(240,240,240)";
    newDiv.addEventListener("click", function() {
      chosenColor = this.style.backgroundColor;
    });
    return colorPicker.appendChild(newDiv);
  }

  for (var j = 0; j < 240; j+=10) {
    colorDivCreator("rgb(" + (10 + j) + "," + (250 - j) + "," + j + ")");
  }


  section.onmousedown = function() {
    mouseDown = true;
  };
  section.onmouseup = function() {
    mouseDown = false;
  };

  for (var k = 0; k < divider.length; k++) {
    divider[k].addEventListener("click", function() {
      var color = this.style.backgroundColor === chosenColor ? "rgb(255,255,255)" : chosenColor;
      this.style.backgroundColor = color;
    });
    divider[k].addEventListener("mouseover", function() {
      if (mouseDown) {
        var color = this.style.backgroundColor === chosenColor ? "rgb(255,255,255)" : chosenColor;
        this.style.backgroundColor = color;
      }
    })
  }

  colorPalette.onchange = function() {
    chosenColor = "#" +colorPalette.value;
  };

  resetButton.addEventListener("click", function() {
    for (var l = 0; l < divider.length; l++) {
      divider[l].style.backgroundColor = "white";
    }
  });

})();