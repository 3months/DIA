// Load our JSON file
var myjson = {};
$.ajax({
    url: 'regulation.json',
    dataType: 'json',
    success: function(json) {
      recursiveLoop(json)
    }
});

// Recursively loop through JSON file
function recursiveLoop(obj) {
  for (var k in obj) {
    var i = 0;
    if (obj[k].hasOwnProperty("name")) {
      // console.log(obj[k])
      createDiv(obj[k], i)
      recursiveLoop(obj[k])
    }
    if (obj[k].hasOwnProperty("requirements")) {
      recursiveLoop(obj[k].requirements)
      var child = obj[k].requirements
      createChildElement(obj[k], child, i)
    }
    if (typeof obj[k] == "object" && obj[k] !== null){
      recursiveLoop(obj[k])
    }
    i++
  }
}

// Create a new div for each business Rule
function createDiv(obj, counter){
  text = obj.name
  $("#list").append("<div class='col-lg-3'><div class='panel panel-default' id="+ text+"><div class='panel-heading'>" + "<h2 class='panel-title'> <a data-toggle='collapse' href='#" + text+counter + "'>"+ text+ "</a></h2></div>" + "</div>")
}

// Create a new child element for nested properties
function createChildElement(obj, child, counter){
  var parent = document.getElementById(obj.name)
  console.log(obj)
  $(parent).append("<div id="+obj.name+ counter+" class='panel-collapse collapse'><div class='panel-body' id='panel"+obj.name+ counter+"'></div></div></div>")
  for (var key in child) {
    console.log(key)
    var panel_body_id = "panel" + obj.name+counter
    var panel_body = document.getElementById(panel_body_id)
    if (child.hasOwnProperty(key)) {
      var text = "<p>" + key + ':' + child[key] + "</p>"
      $(panel_body).append(text)
    }
  }
}

function appendToParent(obj){

}

// $(function() {
//   $.each(obj, function(key, values) {
//       var $li = $('<li></li>').appendTo(".list"),
//           $a  = $("<a>", {text: 'Row ' + key}).appendTo($li),
//           $ol = $('<ol></ol>').appendTo($li);
//
//       $.each(values, function(i, val) {
//          $("<li>", {text: val}).appendTo($ol);
//       });
//   });
// })
