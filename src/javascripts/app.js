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
      return "Participated in Operational Services?"
    case "NeedsAssessmentCompleted":
      return "Have you completed a needs assessment?"

    // healthcare
    case "numberOfChildren":
      return "Do you have any children?"

    // new new new
    case "disabilityMinimum":
      return "XXX";
    case "urgent?":
      return "XXX";
    case "dependentChild?":
      return "XXX";
    case "incomeLessThan":
      return "XXX";
    case "refugeeOrProtectionStatus?":
      return "XXX";
    case "singleCaregiver":
      return "Are you a single caregiver?";
    case "dependentChildMaxAge":
      return "XXX";
    case "applicantStatus":
      return "XXX";
    case "applicantInsufficientFinances?":
      return "XXX";
    case "livingInNzMinimumYears":
      return "How long have you lived in NZ?";
    case "contactWorkandIncome":
      return "Have you contacted work and income?";
    case "alreadyReceiving":
      return "XXX";
    case "OrphansBenefit":
      return "XXX";
    case "UnsupportedChildsBenefit":
      return "XXX";
    case "appliedBetweenMidJanEndFeb":
      return "XXX";
    case "promisingChild?":
      return "XXX";
    case "difficultChild?":
      return "XXX";
    case "mainCaregiver?":
      return "XXX";
    case "childAssessment?":
      return "XXX";
    case "incomeAssesment":
      return "XXX";
    case "familyBreakdownHasOccurred?":
      return "Has a family breakdown occurred?";
    case "childFinanciallyDependent?":
      return "Is your child financially dependent?";
    case "childNeedsAssistance?":
      return "Does your child need assistance?";
    case "MainCaregiverMinimumTimeInMonths":
      return "XXX";
    case "applicantNotNormalCaregiver?":
      return "XXX";
    case "CompleteGuardianshipForm?":
      return "Have you completed a Guardianship form?";
    case "CompleteDeclarationOfParentOfChildForm?":
      return "Have you completed a Declaration of Parent of Child form?";
    case "IncludeCopyOfCriminalRecord?":
      return "Do you have a copy of your criminal record?";
    case "FileApplicationInPerson?":
      return "XXX";
    case "BeingInMilitaryService":
      return "Have you been in Military Service?";
    case "Before1April1974?":
      return "Was your military service before 1 April 1974?";
    case "RequireSupportToStayIndependent?":
      return "XXX";
    case "CurrentlyLivingAtHome?":
      return "Are you currently living at home?";
    case "ServiceRelatedHearingLoss?":
      return "Do you have hearing loss related to your service?";
    case "ReceivingIncomeCompensationDueToHearingLoss?":
      return "XXX";
    case "ConditionRelatedToQualifyingService":
      return "XXX";
    case "HasTreatmentCard?":
      return "Do you have a treatment card?";
    case "DisablementPension?":
      return "Do you receive disablement pension?";
    case "WarDisablementPension?":
      return "Do you receive a War Disablement Pension?";
    case "WeeklyCompensation?":
      return "Do you receive Weekly compensation?";
    case "PermanentImpairmentCompensation?":
      return "Do you receive permanent impairment compensation?";
    case "65AfterDec2014?":
      return "Did you turn 65 after December 2014?";
    case "Beforeturning65":
      return "XXX";
    case "VeteransIncomeSupportFor10YearsVia":
      return "XXX";
    case "VeteransPension":
      return "Do you receive a veterans pension?";
    case "WeeklyIncomeCompensation":
      return "Do you receive weekly income compensation?";
    case "EconomicPension":
      return "Do you receive an economic pension?";
    case "WarServicePension":
      return "Do you receive a war service pension?";
    case "WarVeteransAllowance":
      return "Do you receive a war veterans allowance?";
    case "WhenTurning65":
      return "XXX";
    case "AssetsBelowAssetTestThreshold":
      return "XXX";
    case "eligableForPublicHealthOrDisabilityServices?":
      return "Are you eligable for public health or disability services?";
    case "aged15OrYounger":
      return "Is your dependant child 15 or younger?";
    case "low/MediumIncomeBracket?":
      return "XXX";
    case "aged16to17":
      return "XXX";
    case "financiallyIndependent?":
      return "Are you financially indepedent?";
    case "aged18":
      return "Is your dependent child aged 18 or above?";
    case "attendingSecondaryOrTertiaryInstitution?":
      return "XXX";
    case "notInMarriageCivilUnionorDeFactoRelationship":
      return "XXX";
    case "principalCaregiver?":
      return "Are you the principal caregiver?";
    case "aged16orOver?":
      return "Is your dependent child 16 or older?";
    case "applicantOrChildMeetsResidencyRequirement?":
      return "Do you or your child meet the NZ Residency requirement?";
    case "australianPassportHolder?":
      return "Do you hold an Australian Passport mate?";
    case "residentVisaHolder":
      return "XXX";
    case "studentOrWorkVisa":
      return "Do you have a student or work visa?";
    case "havepassportDetails?":
      return "XXX";
    case "haveMostRecentOverseasTaxNumber?":
      return "Do you have your most recent overseas tax number?";
    case "haveImmigrationNZApplicationNumber?":
      return "Do you have an Immigration NZ Application number?";
    case "haveNzBankAccount?":
      return "Do you have an NZ bank account?";
    case "RseVisaHolder":
      return "XXX";
    case "willBeDoneForApplicantByServices":
      return "XXX";
    case "haveCompletedIrdApplicationForm?":
      return "XXX";

    default:
      return text;
  }
}

// Count the amount of requirements in a business rule
function countRequirements(div) {
  var count = document.getElementById(div.id).childElementCount;
  return count;
}

// Render business rules specific to life event clicked
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
      if ($(card).find('.requirement-count').length == 0) {
        $(card).find('.card-preview').append(Mustache.to_html(template, view_data));
      }
    });
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
  })
  return top_result
}

function askQuestion(top_result) {
  if ($("#input input:checkbox:checked").length > 0) {
    var divRow = $(document.createElement("div")).addClass("row");
    result_options = determineResultOptions(top_result)
    if (result_options[0] == 'binary') {
      var view_data = {
        value: returnRequirementKey(top_result),
        key: getValidId(top_result),
        value1: result_options[1],
        value2: result_options[2],
      }
      var template = $('#questionTpl').html();
      $("#criteria1").html(Mustache.to_html(template, view_data));
      addListeners($('#criteria1'), top_result)
    }
  } else {
    $("#criteria1").html('')
  }
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
        }
      }
    )
    })
  }
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
          console.log('does not have class so append tick')
          $(this).append('<i class="material-icons">&#xE876;</i>')
          $(this).css('background-color', 'green')
        }
      }
      if (answerToBool(user_answer) != answerToBool(question_answer)){
        if ($(this).find( ".material-icons" ).length === 0) {
          $(this).append('<i class="material-icons">&#xE14C;</i>')
          $(this).css('background-color', 'red')
        }
      }
    })
  }
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
  switch (top_result) {
    case "QualifyingOperationService":
      return ['binary', "Yes", "No"]
    case "Before1April1974?":
      return ['binary', "Yes", "No"]
    case "citizenOrResident?":
      return ['binary', "Yes", "No"]
    case "NeedsAssessmentCompleted?":
      return ['binary', "Yes", "No"]
    default:
      return top_result
  }
}
