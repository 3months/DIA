/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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
  var view_data = {
    text: text,
    counter: counter,
    title: title,
    type: category
  }
  var template = $('#bizRuleCardTpl').html();
  $("#list").append(Mustache.to_html(template, view_data));
}

// Create a new child element for nested properties
function createChildElement(obj, child, counter) {
  var parent = document.getElementById(obj.name);
  var view_data = {
    id: obj.name + counter
  }
  var template = $('#benefitPanelTpl').html();
  $(parent).append(Mustache.to_html(template, view_data));
  for (var key in child) {
    var panel_body_id = "panel" + obj.name + counter;
    var panel_body = document.getElementById(panel_body_id);
    if (child.hasOwnProperty(key)) {
      var view_data = {
        id: key,
        requirement_name: returnRequirementKey(key),
        requirement_value: child[key]
      }
      var template = $('#requirementTpl').html();
      $(panel_body).append(Mustache.to_html(template, view_data));
    }
  }
}

function createNestedChildElement(obj, child, parent) {
  var parentPanel = "panel" + parentCategory;
  var parent = document.getElementById(parentPanel);
  for (var key in child) {
    if (child.hasOwnProperty(key)) {
      var view_data = {
        id: key,
        requirement_value: returnRequirementKey(key),
        requirement_name: child[key]
      }
      var template = $('#requirementTpl').html();
      $(parent).append(Mustache.to_html(template, view_data));
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
      return "How old are you?";
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
    // Find most common requirement
    // Ask question related to most common requirement
    askQuestion(returnTopRequirement());

    $(".biz-rule-card").each(function showRequirementCount(i, card) {
      var view_data = {
        id: $(card).attr('id'),
        count: $(card).find('.requirement').length
      }
      var template = $('#requirementsNumTpl').html();
      $(card).find('.card-preview').append(Mustache.to_html(template, view_data));
    });
  } else {
    $('[data-event-type="' + eventType + '"].biz-rule-card').remove();
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
      console.log(question);
      var view_data = {
        key: returnRequirementKey(key),
        num_requirements: question[key]
      }
      var template = $('#questionTpl').html();
      $("#criteria1").html(Mustache.to_html(template, view_data));
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


/***/ })
/******/ ]);