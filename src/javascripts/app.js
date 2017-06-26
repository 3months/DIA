// The user object where we store results
var user_obj = {}

// Import all JS here
// This file serves as the entry point for our webpack config
var $ = require("jquery");
require('bootstrap-loader');
require('../../src/stylesheets/styles.scss');
require('../../src/javascripts/bootstrap-switch.min.js')
require('../../src/stylesheets/bootstrap-switch.min.scss')

$(document).ready(function() {
  $("[name='setting-anonymous']").bootstrapSwitch();

  $('#debugModal').on('show.bs.modal', function (event) {
    $('.user-obj tbody').html('');
    $.each(user_obj, function(key, value) {
      var view_data = {
        requirement_name: returnRequirementKey(key),
        requirement_value: value,
        id: key
      }
      var row = Mustache.to_html($('#userObjRowTpl').html(), view_data);
      $('.user-obj tbody').append(row);
    });
  });

  $('.user-obj').on('click', '.user-obj-delete', function() {
    delete user_obj[$(this).attr('data-req-id')];
    $(this).closest('tr').remove();
  });

  $('#applyModal').on('show.bs.modal', function (event) {
    console.log('oew')
    $('.panel-heading-bizRule').each(function(){
      if($(this).hasClass('green')) {
        var view_data = {
          bizRuleName: $(this).find('.panel-title').text()
        }
        var row = Mustache.to_html($('#applyRowTpl').html(), view_data);
        $('.user-apply tbody').append(row)
      }
    })
  })
  $('.user-apply').on('click', '.user-obj-apply', function() {
    $(this).addClass('animate');
  });


});

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
  var counter = 0;
  for (var rule_num in obj) {
    business_rule = obj[rule_num];

    var rule_id = business_rule.name + counter;
    createRulePanel(business_rule, rule_id);

    for (var requirement_name in business_rule['requirements']) {
      if (business_rule['requirements'].hasOwnProperty(requirement_name)) {
        var requirement = business_rule['requirements'][requirement_name]
        createChildren(requirement_name, requirement, rule_id)
      }
    }
    counter++
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
      requirement_data_attr: requirement_name
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

// Split our json titles into individual words
function returnTitle(text) {
  return text.replace(/([a-z])([A-Z])/g, "$1 $2");
}

// Grab json text and use them as a key to render text blocks
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
    case "InGoodHealth?":
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
    case "applyOnline":
      return "Please apply online"

    // Retirement
    case "QualifyingOperationService":
      return "Has the applicant participated in Operational Services?"
    case "NeedsAssessmentCompleted?":
      return "Have you completed a needs assessment?"
    case "Before1April1974?":
      return "Did the applicant participate in Military service before 1 April 1974?"
    case "eligableForPublicHealthOrDisabilityServices?":
      return "Is the application eligable for public health or disability services?"
    case "WarVeteransAllowance":
      return "Is the applicant receiving a war veterans allowance?"
    case "WarServicePension":
      return "Is the applicant receiving a war service pension?"
    case "EconomicPension":
      return "Is the applicant receiving an economic pension?"
    case "AssetsBelowAssetTestThreshold":
      return "Is the applicants assets below the threshold specified by the asset test?"
    case "WeeklyIncomeCompensation":
      return "Is the applicant receiving weekly income compensation?"
    case "VeteransPension":
      return "Is the applicant currently receiving a veterans pension?"
    case "WeeklyCompensation":
      return "Is the applicant currently receiving a weekly compensation?"
    case "65AfterDec2014?":
      return "Did the applicant turn 65 after Dec 2014?"
    case "ServiceRelatedHearingLoss?":
      return "Does the applicant have hearing loss related to their military service?"
    case "ReceivingIncomeCompensationDueToHearingLoss?":
      return "Is the applicant receiving income compensation due to hearing loss?"
    case "RequireSupportToStayIndependent?":
      return "Does the application require support to stay independent?"
    case "CurrentlyLivingAtHome?":
      return "Is the applicant currently living at home?"
    case "applicantMinimumAgeIs65?":
      return "Is the applicant currently 65 or over?"
    case "5yearsInNzSince50":
      return "Has the applicant spent 5 or more years in NZ since turning 50?"
    case "10yearsInNzSince20":
      return "Has the applicant spent 10 or more years in NZ since turning 20?"
    case "applicantMinimumAge65?":
      return "Is the applicant 65 or older?"

    // healthcare
    case "numberOfChildren":
      return "Do you have any children?"
    default:
      return text;
  }
}

// Render business rules specific to life event clicked
var lifeEventClicked = function() {
  var eventType = $(this).attr('data-event-type');
  if ($(this).is(":checked")) {
    recursiveLoop(getObjects(myJson, "category", eventType));
    // Find most common requirement
    // Ask question related to most common requirement
    askQuestion(returnTopRequirement());
    tickRequirements()
    countRequirements()
  } else {
    $('[data-event-type="' + eventType + '"].biz-rule-card').remove();
    askQuestion(returnTopRequirement());
  }
  tickRequirements()
};

$("#fancy-checkbox-immigration, #fancy-checkbox-retired, #fancy-checkbox-health, #fancy-checkbox-childcare").change(lifeEventClicked);

function returnTopRequirement() {
  var requirements_array = []
  // Gather all visible requirements text from DOM and push to array
  var requirements = $('p.requirement').each(function(i, obj) {
    requirements_array.push($(this).data( "requirement" ))
  });
  if (requirements_array.length){
    return findMostCommonRequirement(requirements_array)
  } else {
    return 'error'
  }
}

function findMostCommonRequirement(array){
  var ranked_values_object = {};
  // Loop through array to determine how often a value is repeated
  // Then rank them
  array.forEach(function(x) {
    ranked_values_object[x] = (ranked_values_object[x] || 0) + 1;
  });

  // If user has no object filtered_result_keys = ranked_values_object
  var filtered_result_keys = ranked_values_object

  // If user has object, initialise two objects to compare and filter matches
  var unique_questions_keys = Object.keys(ranked_values_object)
  var user_answers_keys = Object.keys(user_obj)

  // we compare the ranked benefits with the user_obj
  // If we find a match (user has already answered that question)
  // We delete that value from ranked_values_object
  if (user_answers_keys.length){
    unique_questions_keys.forEach(function(key) {
      user_answers_keys.forEach(function(key2){
        if (key === key2){
          delete ranked_values_object[key2]
        }
      })
    })
  }

  // loop through and return the value that is repeated most
  var top_result = Object.keys(ranked_values_object).reduce(function(a, b){
    return ranked_values_object[a] > ranked_values_object[b] ? a : b
  }, 0)
  return top_result
}

function askQuestion(top_result) {
  if ($("#input input:checkbox:checked").length > 0) {
    var divRow = $(document.createElement("div")).addClass("row");
    result_options = determineResultOptions(top_result)
    if (top_result === 0) {
      $("#criteria1").html('')
      renderApplyAll()
    } else {
      renderQuestion(returnRequirementKey(top_result), getValidId(top_result), result_options, top_result)
    }
  } else {
    $("#criteria1").html('')
  }
}

function renderQuestion(value, key, options, question){
  var view_data = {
    value: value,
    key: key,
    value1: options[0],
    value2: options[1]
  }
  var template = $('#questionTpl').html();
  $("#criteria1").html(Mustache.to_html(template, view_data));
  addListeners($('#criteria1'), question)
}

function renderApplyAll(){
  var count_success_benefits = $(".panel-heading-bizRule").find('.checked')
  var view_data = {
    apply_count : count_success_benefits.prevObject.length
  }
  var template = $('#applyAllTpl').html()
  $('#criteria1').html(Mustache.to_html(template, view_data));
}


// This assigns click events to questions
// on click they pop the selected value and the question asked into the user object
function addListeners(string, question){
  if (string.length > 0){
    string.find('input').each(function(index, element){
      $('#'+element.id).change(function(){
        if(this.checked) {
          var value = $(this).data('value')
          user_obj[question] = value
          tickRequirements()
          askQuestion(returnTopRequirement());
          countRequirements()
        }
      }
    )
    })
  }
}

function countRequirements() {
  $(".biz-rule-card").each(function showRequirementCount(i, card) {
    var count_direct_children = $(card).find('.requirement-panel > .requirement > .checked').length
    var count_nested_panels = $(card).find('.requirement-panel > .requirement > .panel-heading > .checked').length
    var view_data = {
      id: $(card).attr('id'),
      // Count top level requirements
      count: $(card).find('.requirement-panel > .requirement').length,
      checked: count_direct_children+count_nested_panels

    }
    var template = $('#requirementsNumTpl').html();
    $(card).find('.card-preview').html('');
    $(card).find('.card-preview').append(Mustache.to_html(template, view_data));
  });
}


function tickRequirements(){
  for (var user_question in user_obj) {
    // Find each element that matches user question
    $("[data-requirement='"+user_question+"']").each(function() {
      var user_answer = user_obj[user_question]
      var question_answer = $(this).children().text()
      // If user answer matches question requirement
      if (answerToBool(user_answer) == answerToBool(question_answer)){
        if ($(this).find( ".material-icons" ).length === 0) {
          $(this).append('<i class="material-icons checked">&#xE876;</i>')
          $(this).css('background-color', 'green')
        }
      }
      if (answerToBool(user_answer) != answerToBool(question_answer)){
        if ($(this).find( ".material-icons" ).length === 0) {
          $(this).append('<i class="material-icons unchecked">&#xE14C;</i>')
          $(this).css('background-color', 'red')
        }
      }
      tickIfAllChildrenTicked($(this))
      tickTopLevelRequirements($(this))
    })
  }
}

function tickIfAllChildrenTicked(item) {
  var all_criteria = item.closest('.panel').find("p").length
  var checked_criteria = item.closest('.panel').find("i.checked").length
  var checked_inner_panels = item.find('.panel > .panel-heading > .checked').length

  var failed_criteria = item.closest('.panel').find("i.unchecked").length
  var parent_panel_header = item.closest('.panel').find(".panel-heading")

  if (checked_criteria  == all_criteria) {
    if (parent_panel_header.find( ".checked" ).length === 0) {
      parent_panel_header.append('<i class="material-icons checked">&#xE876;</i>')
      parent_panel_header.css('background-color', 'green')
    }
  }

  if (failed_criteria > 0) {
    if (parent_panel_header.find( ".unchecked" ).length === 0) {
      parent_panel_header.append('<i class="material-icons unchecked">&#xE14C;</i>')
      parent_panel_header.css('background-color', 'red')
    }
  }
}

function tickTopLevelRequirements(item){
  $('.biz-rule-card').each(function() {
    var children = $(this).find('.panel-body').children()
    var checked_children = children.find(".checked").length
    var failed_children = children.find(".unchecked").length
    var all_children = children.length
    var parent_panel_BizRule = $(this).find('.panel-heading-bizRule')
    if (checked_children == all_children){
      if (parent_panel_BizRule.find( ".checked" ).length === 0) {
        // parent_panel_BizRule.css('background-color', 'green')
        parent_panel_BizRule.addClass("green")
      }
    }
    if (failed_children > 0) {
      if (parent_panel_BizRule.find( ".unchecked" ).length === 0) {
        parent_panel_BizRule.css('background-color', 'red')
      }
    }
  })
}

// Used to convert 'truthy' values to an actual boolean
function answerToBool(string) {
  switch (string.toLowerCase()) {
    case "yes":
    case "true":
    case true:
      return true
    case "no":
    case "false":
    case false:
      return false
    default:
      return false
  }
}

function determineResultOptions(top_result) {
  return ["Yes", "No"]
}
