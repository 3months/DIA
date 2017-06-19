// Load our JSON file
var myJson = {};
$.ajax({
  url: "regulation.json",
  dataType: "json",
  success: function(json) {
    myJson = json;
  }
});

function getObjects(obj, key, val) {
  var objects = [];
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (typeof obj[i] == "object") {
      objects = objects.concat(getObjects(obj[i], key, val));
    } else if (i == key && obj[key] == val) {
      objects.push(obj);
    }
  }
  return objects;
}

// Recursively loop through JSON file
function recursiveLoop(obj) {
  for (var k in obj) {
    var i = 0;
    if (obj[k].hasOwnProperty("name")) {
      createDiv(obj[k], i);
      recursiveLoop(obj[k]);
    }
    if (obj[k].hasOwnProperty("requirements")) {
      recursiveLoop(obj[k].requirements);
      var child = obj[k].requirements;
      createChildElement(obj[k], child, i);
    }
    if (obj[k].hasOwnProperty("alreadyReceiving")) {
      recursiveLoop(obj[k].alreadyReceiving);
      var child = obj[k].alreadyReceiving;
      createNestedChildElement(obj[k], child);
    }
    if (typeof obj[k] == "object" && obj[k] !== null) {
      recursiveLoop(obj[k]);
    }
    i++;
  }
}
var parentCategory = "";
// Create a new div for each business Rule
function createDiv(obj, counter) {
  text = obj.name;
  category = obj.category;
  parentCategory = text + counter;
  var title = returnTitle(text);
  var type = category;
  var list_view = {
    text: text,
    counter: counter,
    title: title,
    type: type
  }
  var template = $('#listTpl').html();
  $("#list").append(Mustache.to_html(template, list_view));
}

// Create a new child element for nested properties
function createChildElement(obj, child, counter) {
  var parent = document.getElementById(obj.name);
  var benefit_panel = {
    id: obj.name + counter
  }
  var template = $('#benefitPanelTpl').html();
  $(parent).append(Mustache.to_html(template, benefit_panel));
  for (var key in child) {
    var panel_body_id = "panel" + obj.name + counter;
    var panel_body = document.getElementById(panel_body_id);
    if (child.hasOwnProperty(key)) {
      var requirement = {
        key: key,
        requirementKey: returnRequirementKey(key),
        child: child[key]
      }
      var template = $('#requirementTpl').html();
      $(panel_body).append(Mustache.to_html(template, requirement));
    }
  }
}

function createNestedChildElement(obj, child, parent) {
  var parentPanel = "panel" + parentCategory;
  var parent = document.getElementById(parentPanel);
  for (var key in child) {
    if (child.hasOwnProperty(key)) {
      var requirement = {
        key: key,
        requirementKey: returnRequirementKey(key),
        child: child[key]
      }
      var template = $('#requirementTpl').html();
      $(parent).append(Mustache.to_html(template, requirement));
      removeAlreadyReceiving();
    }
  }
}

// If the p tag rendered is the nested property alreadyReceiving, which as properies itself\
// Then don't render it
function removeAlreadyReceiving() {
  if ($('.requirement:contains("alreadyReceiving")').length > 0) {
    $('.requirement:contains("alreadyReceiving")').remove();
  }
}

function returnTitle(text) {
  return text.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function returnRequirementKey(text) {
  switch (text) {
    case "applicantMinimumAge":
      return "Minimum age of applicant";
    case "yearsInNzSince20":
      return "Years applicant should have spent in NZ since turning 20";
    case "yearsInNzSince50":
      return "Years applicant should have spent in NZ since turning 50";
    case "citizenOrResident?":
      return "Is the applicant a citizen or Resident of NZ?";
    case "livingInNZ?":
      return "Is the applicant currently living in NZ";
    case "ServedInMilitaryOrEmergency?":
      return "Applicant Served in Military or in emergency?";
    case "relatedOrGuardian?":
      return "Applicant is family or guardian?";
    case "completedIncomeAndAssetTest?":
      return "Have you completed an income and asset test?";
    case "hasExistingBenefit?":
      return "Are you currently on another benefit?";
    case "organiser?":
      return "Are you the organiser of the event?"
    case "pension?":
      return "Are you currently receiving a pension?"
    case "ongoingCosts?":
      return "Do you have ongoing costs that you cannot currently cover?"
    case "SocialHousingBenefit?":
      return "Are you currently in receivership of a housing benefit?"
    default:
      return text;
  }
}

function countRequirements(div) {
  var count = document.getElementById(div.id).childElementCount;
  return count;
}

var lifeEventClicked = function() {
  var eventType = $(this).attr('data-event-type');
  if ($(this).is(":checked")) {
    recursiveLoop(getObjects(myJson, "category", eventType));
    var panel = $(".panel-body");
    // Find most common requirement
    // Ask question related to most common requirement
    askQuestion(returnTopRequirement());

    $(".panel-body").each(function(key, value) {
      var count = value.childElementCount;
      var parent = $("#" + value.id).parent().parent();
      for (var i = 0; i < parent.length; i++) {
        var test_string = eventType;
        if ($(parent[i]).find(".btn").text().indexOf(test_string) >= 0) {
          if ($("#" + value.id).length != 0) {
            var text = "<p id=" + value.id + ">" + count + " requirements </p>";
            p = $(document.createElement("p")).attr("id", "id-" + value.id);
            $(
              "<p id=" + value.id + ">" + count + " requirements </p>"
            ).appendTo("#" + parent[i].id);
          }
        }
      }
    });
  } else {
    $("button:contains('" + eventType + "')").closest('.regulation-container').remove();
    askQuestion(returnTopRequirement());
  }
};

$("#fancy-checkbox-immigration, #fancy-checkbox-retired, #fancy-checkbox-health, #fancy-checkbox-childcare").change(lifeEventClicked);

function returnTopRequirement() {
  var array = [
    { applicantMinimumAge: $("p[id*='applicantMinimumAge']").length },
    { citizenOrResident: $("p[id*='citizenOrResident?']").length },
    { livingInNZ: $("p[id*='livingInNZ?']").length },
    { yearsInNzSince50: $("p[id*='yearsInNzSince50']").length },
    { yearsInNzSince20: $("p[id*='yearsInNzSince20']").length },
    { pension: $("p[id*='pension?']").length },
    { organiser: $("p[id*='organiser?']").length },
    { pension: $("p[id*='pension?']").length },
    { relatedOrGuardian: $("p[id*='relatedOrGuardian?']").length },
    {
      completedIncomeAndAssetTest: $("p[id*='completedIncomeAndAssetTest?']")
        .length
    },
    {
      ServedInMilitaryOrEmergency: $("p[id*='ServedInMilitaryOrEmergency?']")
        .length
    },
    { organiser: $("p[id*='organiser?']").length }
  ];
  var highest = array.sort(function(a, b) {
    return a.ValueA - b.ValueA;
  });
  return highest[0];
}

function askQuestion(requirementCount) {
  var question = requirementCount;
  for (var key in question) {
    if ($("#input input:checkbox:checked").length > 0) {
      var divRow = $(document.createElement("div")).addClass("row");
      var h2 = $(document.createElement("h2")).text("First Question");
      divRow.append(h2.append());
      var question_view = {
        key: returnRequirementKey(key),
        question_key: question[key]
      }
      var template = $('#questionTpl').html();
      $("#criteria1").html(Mustache.to_html(template, question_view));
      console.log(key + ":" + question[key]);
      if ($("#fancy-checkbox-question1_1").length > 0) {
        $("#fancy-checkbox-question1_1").change(function() {
          if ($(this).is(":checked")){
            console.log('checked 1')
          }
        })
      }
      if ($("#fancy-checkbox-question1_2").length > 0) {
        $("#fancy-checkbox-question1_2").change(function() {
          if ($(this).is(":checked")){
            console.log("checked 2")
          }
        })
      }
    } else {
      $("#criteria1").html("");
    }
  }
}


var user = {}
