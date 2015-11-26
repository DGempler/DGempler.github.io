# Roadside Peddler App

<a href="http://dgempler.github.io/leafletProject/index.html" target="\_blank">App Link</a>

This is a purely front-end app that I created 4 weeks after starting the [6-month full-stack web developer course at Galvanize](http://www.galvanize.com/courses/full-stack/). The 3-day assignment was to pick a Javascript library, learn it, and create a small demo app using that library.

I created an app that allows a user to mark locations of various street vendors they see on a map, and then save some basic information (items offered for sale & prices).

Within the 3 days I had built a working app but my attempts to save markers to localStorage via geoJSON were not entirely successful. Markers were being restored on the map upon a page refresh, but I was unable to associate those markers to their layer (i.e., marker type or category), so they were just showing up as generic markers. After learning a little more about geoJSON objects and javascript in general, I went back and added that functionality as well as the ability to save the input form data.

## Technologies

- Javascript
- jQuery
- LeafletJS
- Mapbox

## Things left to do

- Bring the styling into the 21st century
- Add some tests

## P.S.

- Hitting the "Clear All Peddlers" button (or shift + delete) will clear your localStorage once you're done exploring.
- For some fun, try: Shift ⇧ + Control ⌃ + Option ⌥ + P
