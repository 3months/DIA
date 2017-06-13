// Load our JSON file
var myJson = {}
$.ajax({
    url: 'regulation.json',
    dataType: 'json',
    success: function(json) {
      myJson = json
    }
});

$(function(){
  $('#fancy-checkbox-childcare').change(
    function(){
      if ($(this).is(':checked')) {
        console.log(myJson)
        recursiveLoop(getObjects(myJson, 'category', 'hardship'))
      }
    }
  );
  $('#fancy-checkbox-immigration').change(
    function(){
      if ($(this).is(':checked')) {
        console.log(myJson)
        recursiveLoop(getObjects(myJson, 'category', 'hardship'))
      }
    }
  );
  $('#fancy-checkbox-retired').change(
    function(){
      if ($(this).is(':checked')) {
        console.log(myJson)
        recursiveLoop(getObjects(myJson, 'category', 'retirement'))
      }
    }
  );
  $('#fancy-checkbox-health').change(
    function(){
      if ($(this).is(':checked')) {
        console.log(myJson)
        recursiveLoop(getObjects(myJson, 'category', 'hardship'))
      }
    }
  );
})

function getObjects(obj, key, val) {
  var objects = [];
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (typeof obj[i] == 'object') {
        objects = objects.concat(getObjects(obj[i], key, val));
    } else if (i == key && obj[key] == val) {
        objects.push(obj);
    }
  }
  return objects;
}

function recursiveFunction(key, val) {
  actualFunction(key, val);
  var value = val['businessRules'];
  console.log(value)
  if (value instanceof Object) {
    $.each(value, function(key, val) {
      console.log(key + val)
      recursiveFunction(key, val)
    });
  }
}
function actualFunction(key, val) {
  // console.log(key,val)
}

















// Recursively loop through JSON file
function recursiveLoop(obj) {
  for (var k in obj) {
    var i = 0;
    if (obj[k].hasOwnProperty("name")) {
      createDiv(obj[k], i)
      recursiveLoop(obj[k])
    }
    if (obj[k].hasOwnProperty("requirements")) {
      recursiveLoop(obj[k].requirements)
      var child = obj[k].requirements
      createChildElement(obj[k], child, i)
    }
    // if (obj[k].hasOwnProperty("alreadyReceiving")) {
    //   recursiveLoop(obj[k].alreadyReceiving)
    //   var child = obj[k].alreadyReceiving
    //   createNestedChildElement(obj[k], child)
    // }
    if (typeof obj[k] == "object" && obj[k] !== null){
      recursiveLoop(obj[k])
    }
    i++
  }
}

// Create a new div for each business Rule
function createDiv(obj, counter){
  text = obj.name
  category = obj.category
  var title = returnTitle(text)
  var type = category
  $("#list").append("<div class='col-lg-3'><div class='panel panel-default' id="+ text+"><div class='panel-heading'>" + "<div class='row'><div class='col-lg-12'><div class='col-lg-6'><h2 class='panel-title'> <a data-toggle='collapse' href='#" + text+counter + "'>"+ title+ "</a></h2></div><div class='col-lg-6'><button class='btn btn-info'>"+ type +"</button></div></div></div></div></div>")
}

// Create a new child element for nested properties
function createChildElement(obj, child, counter){
  var parent = document.getElementById(obj.name)
  $(parent).append("<div id="+obj.name+ counter+" class='panel-collapse collapse'><div class='panel-body text-left' id='panel"+obj.name+ counter+"'></div></div></div>")
  for (var key in child) {
    var panel_body_id = "panel" + obj.name+counter
    var panel_body = document.getElementById(panel_body_id)
    if (child.hasOwnProperty(key)) {
      var text = "<p>" + returnRequirementKey(key) + ' :<strong>' + child[key] + "</strong></p>"
      $(panel_body).append(text)
    }
  }
  var requirementsCount = "<p>" + countRequirements(panel_body) + " requirements</p>"
  $(parent).append(requirementsCount)
}

function createNestedChildElement(obj, child){
  console.log(obj)
  var parent = document.getElementById(obj.name)
  for (var key in child) {
    if (child.hasOwnProperty(key))
    var text = "<p>" + returnRequirementKey(key) + ' :<strong>' + child[key] + "</strong></p>"
    $(parent).append(text)

  }
}

function returnTitle(text){
  return text.replace(/([a-z])([A-Z])/g, '$1 $2')
}

function returnRequirementKey(text){
  switch (text) {
    case "applicantMinimumAge": return "Minimum age of applicant"
    case "yearsInNzSince20": return "Years applicant should have spent in NZ since turning 20"
    case "yearsInNzSince50": return "Years applicant should have spent in NZ since turning 50"
    case "citizenOrResident?": return "Is the applicant a citizen or Resident of NZ?"
    case "livingInNZ?": return "Is the applicant currently living in NZ"
    default: return text
  }
}

function countRequirements(div){
  // console.log(div)
  var count = document.getElementById(div.id).childElementCount;
  return count
}
