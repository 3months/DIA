// Import all JS here
// This file serves as the entry point for our webpack config
var $ = require("jquery");
require('bootstrap-loader');
require('../../src/stylesheets/styles.scss');
require('../../src/javascripts/bootstrap-switch.min.js')
require('../../src/stylesheets/bootstrap-switch.min.scss')

$(document).ready(function() {
  $("[name='setting-anonymous']").bootstrapSwitch();
});

// Load our JSON file
var myJson = {};
$.ajax({
  url: "regulation.json",
  dataType: "json",
  success: function(json) {
    myJson = json;
    console.log(myJson)
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
  var counter = 0;
  for (var rule_num in obj) {
    business_rule = obj[rule_num];

    var rule_id = business_rule.name + counter;
    createRulePanel(business_rule, rule_id);

    for (var requirement_name in business_rule['requirements']) {
      if (business_rule['requirements'].hasOwnProperty(requirement_name)) {
        var requirement = business_rule['requirements'][requirement_name];
        createChildren(requirement_name, requirement, rule_id);
      }
    }
    counter++;
  }
}

function createChildren(requirement_name, requirement_value, rule_panel) {
  createRequirementPanel(requirement_name, requirement_value, rule_panel);
  if (typeof requirement_value == "object" && requirement_value !== null) {
    for (var child in requirement_value) {
      if (requirement_value.hasOwnProperty(child)) {
        createChildren(child, requirement_value[child], getValidId(rule_panel + requirement_name));
      }
    }
  }
}

// Create a new div for each business Rule
function createRulePanel(rule, id) {
  text = rule.name;
  var view_data = {
    text: text,
    id: id,
    title: returnTitle(text),
    type: rule.category
  }
  var template = $('#bizRuleCardTpl').html();
  $("#list").append(Mustache.to_html(template, view_data));
}

function getValidId(id) {
  return id.replace(/\?/, '');
}

// Create a new panel for each requirement
function createRequirementPanel(requirement_name, requirement_value, rule_id) {
  var value = '';
  var parent_panel = document.getElementById(rule_id);

  if (typeof requirement_value !== "object" && requirement_value !== null) {
    var view_data = {
      requirement_name: returnRequirementKey(requirement_name),
      requirement_value: requirement_value,
    }
    var template = $('#requirementTpl').html();
    $(parent_panel).append(Mustache.to_html(template, view_data));
    value = requirement_value
  } else {
    var view_data = {
      id: getValidId(rule_id + requirement_name),
      requirement_name: returnRequirementKey(requirement_name),
    }
    var template = $('#benefitPanelTpl').html();
    $(parent_panel).append(Mustache.to_html(template, view_data));
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
      return "What age range are you in?";
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

    // Parent or Grandparent Visitor Visa
    case "ProofOfIdentity?":
      return "Applicant has supplied proof of identity?"
    case "inGoodHealth?":
      return "Applicant is in good health?"
    case "OfGoodCharachter?":
      return "Applicant is of good character?"
    case "IntendToMeetVisaConditions?":
      return "Applicant intends to meet visa conditions?"
    case "SponsorIsChildOrParent?":
      return "Applicant sponsor is a child or Parent?"
    case "SponsorIsResidentOrCitizen?":
      return "Applicant sponsor is a resident or citizen of NZ?"
    case "SponsorIsRelative?":
      return "Applicant sponsor is a relative?"
    case "CoverOwnHealthcareCosts?":
      return "Applicant can afford to cover their own healthcare costs?"
    case "proofOfIdentity?":
      return "Applicant has supplied proof of identity?"

    // Immigration Pet visa
    case "approvedCountry":
      return "If pet is arriving from an approved country"
    case "permitToImport?":
      return "must have permit to import?"
    case "arrivingFromAustralia":
      return "If pet is arriving from Australia"
    case "postArrivalInspection":
      return "Must complete post arrival inspection"
    case "otherCountry":
      return "Other countries"
    case "petSpent6MonthsInApprovedCountry?":
      return "Pet must spend 6 months in an approved country?"
    case "vetCertificateProvided":
      return "Vet certicate provided?"

    // GettingAnIrdNumber
    case "alreadyInNZ?":
      return "Already in New Zealand?"
    case "notInNzYet?":
      return "Not yet in New Zealand?"
    case "migrantOrVisaHolder":
      return "Migrant or Visa holder?"
    case "nzCitizen":
      return "A New Zealand Citizen?"
    case "haveCompletedOffshoreForm?":
      return "Have completed offshore form?"
    case "migrantOrVisaHolder":
      return "Migrant or Visa holder?"

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
        // Count top level requirements
        count: $(card).find('.requirement-panel > .requirement').length
      }
      var template = $('#requirementsNumTpl').html();
      if ($(card).find('.requirement-count').length == 0)
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
