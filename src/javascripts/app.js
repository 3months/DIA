console.log('pew')

var myjson = { };
$.ajax({
    url: 'regulation.json',
    dataType: 'json',
    success: function(json) {
      recursiveLoop(json)
    }
});

function recursiveLoop(obj) {
  for (var k in obj) {
    if (obj[k].hasOwnProperty("name")) {
      // console.log(obj[k])
      createElement(obj[k])
      recursiveLoop(obj[k])
    }
    if (obj[k].hasOwnProperty("requirements")) {
      recursiveLoop(obj[k].requirements)
      var child = obj[k].requirements
      createChildElement(obj[k], child)
    }
    if (typeof obj[k] == "object" && obj[k] !== null){
      recursiveLoop(obj[k])
    }
  }
}

function createElement(obj){
  text = obj.name
  $("#list").append("<div class='col-lg-3' id=" + text + ">" + "<h2>" + text + "</h2>" + "</div>")
}

function createChildElement(obj, child){
  var parent = document.getElementById(obj.name)
  for (var key in child) {
    console.log(key)
    if (child.hasOwnProperty(key)) {
      var text = "<p>" + key + ':' + child[key] + "</p>"
      $(parent).append(text)
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
