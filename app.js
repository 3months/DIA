// load our JSON file

function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
  xobj.open('GET', 'regulation.json', true);
  xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
          callback(xobj.responseText);
        }
  };
  xobj.send(null);
 }

// On Initialize parse JSON and construct panels
function init() {
  loadJSON(function(response) {
    var data = JSON.parse(response);
    for(var i = 0; i < data.agencies.length; i++){
      var agency = data.agencies[i]
      var container_div = document.createElement('div');
      container_div.className = "container-fluid"
      var title_header = document.createElement('div');
      var title_text = '<h1>' + data.agencies[i].title + '</h1>';
      title_header.innerHTML = title_text;
      container_div.appendChild(title_header)
      document.getElementById('output').appendChild(container_div)
      for(var j = 0; j < agency.businessRules.length; j++){
        var businessRule = agency.businessRules[j]
        var body = document.createElement('div');
        body.className = "col-lg-3 panel panel-default"
        container_div.appendChild(body)
        var ruleName = document.createElement('div')
        ruleName.className = "panel-header"
        var rule_title = "<h4>" + businessRule.title + "</h4>";
        ruleName.innerHTML = rule_title;
        body.appendChild(ruleName)
        for(var r=0, l = businessRule.requirements.length; r < l; r++){
          var requirements = businessRule.requirements[r]
          var requirement_div = document.createElement('div')
          requirement_div.className = "panel-body text-left"
          body.append(requirement_div)
          for (var prop in requirements) {
              var requirement_visual = prop + ' : ' + requirements[prop]
              requirement_div.innerHTML = requirement_visual
          }
        }
      }
    }
  })
};

document.addEventListener("DOMContentLoaded", function(event) {
  init()
});
