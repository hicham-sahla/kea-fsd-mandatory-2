// Progressive web enhancement. When JavaScript is disabled this function doesnt work and the noscript tag will be shown with a different input field

// initializing Color with some parameters
Coloris({
  el: '.coloris',
  swatches: [
    '#264653',
    '#2a9d8f',
    '#e9c46a',
    '#f4a261',
    '#e76f51',
    '#d62828',
    '#023e8a',
    '#0077b6',
    '#0096c7',
    '#00b4d8',
    '#48cae4',
  ],
  theme: 'large',
  themeMode: 'light', // light, dark, auto
  clearButton: {
    show: false,
    label: 'Clear' 
  },
});

let my_elem = document.getElementById("personalColorLabel");

let input = document.createElement("input");
input.type = "text";
input.name = "personalColor";
input.id = "personalColor";
input.value = "#00a5cc";



my_elem.parentNode.insertBefore(input, my_elem);

// When everything is load iam adding a class to the color input so that its recognized by Coloruis
document.addEventListener("DOMContentLoaded", function() {
  let element = document.getElementById("personalColor");
  element.classList.add("coloris");
});