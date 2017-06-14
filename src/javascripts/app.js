(function(global,e){typeof exports==="object"&&typeof module!=="undefined"?module.exports=e():typeof define==="function"&&define.amd?define(e):global.DeepDiff=e()})(this,function(){"use strict";var e;var t;var n=[];if(typeof global==="object"&&global){e=global}else if(typeof window!=="undefined"){e=window}else{e={}}t=e.DeepDiff;if(t){n.push(function(){if("undefined"!==typeof t&&e.DeepDiff===c){e.DeepDiff=t;t=undefined}})}function r(e,t){e.super_=t;e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:false,writable:true,configurable:true}})}function i(e,t){Object.defineProperty(this,"kind",{value:e,enumerable:true});if(t&&t.length){Object.defineProperty(this,"path",{value:t,enumerable:true})}}function a(e,t,n){a.super_.call(this,"E",e);Object.defineProperty(this,"lhs",{value:t,enumerable:true});Object.defineProperty(this,"rhs",{value:n,enumerable:true})}r(a,i);function f(e,t){f.super_.call(this,"N",e);Object.defineProperty(this,"rhs",{value:t,enumerable:true})}r(f,i);function u(e,t){u.super_.call(this,"D",e);Object.defineProperty(this,"lhs",{value:t,enumerable:true})}r(u,i);function l(e,t,n){l.super_.call(this,"A",e);Object.defineProperty(this,"index",{value:t,enumerable:true});Object.defineProperty(this,"item",{value:n,enumerable:true})}r(l,i);function s(e,t,n){var r=e.slice((n||t)+1||e.length);e.length=t<0?e.length+t:t;e.push.apply(e,r);return e}function h(e){var t=typeof e;if(t!=="object"){return t}if(e===Math){return"math"}else if(e===null){return"null"}else if(Array.isArray(e)){return"array"}else if(Object.prototype.toString.call(e)==="[object Date]"){return"date"}else if(typeof e.toString==="function"&&/^\/.*\//.test(e.toString())){return"regexp"}return"object"}function o(e,t,n,r,i,c,p){i=i||[];var d=i.slice(0);if(typeof c!=="undefined"){if(r){if(typeof r==="function"&&r(d,c)){return}else if(typeof r==="object"){if(r.prefilter&&r.prefilter(d,c)){return}if(r.normalize){var b=r.normalize(d,c,e,t);if(b){e=b[0];t=b[1]}}}}d.push(c)}if(h(e)==="regexp"&&h(t)==="regexp"){e=e.toString();t=t.toString()}var y=typeof e;var v=typeof t;var g=y!=="undefined"||p&&p[p.length-1].lhs.hasOwnProperty(c);var k=v!=="undefined"||p&&p[p.length-1].rhs.hasOwnProperty(c);if(!g&&k){n(new f(d,t))}else if(!k&&g){n(new u(d,e))}else if(h(e)!==h(t)){n(new a(d,e,t))}else if(h(e)==="date"&&e-t!==0){n(new a(d,e,t))}else if(y==="object"&&e!==null&&t!==null){p=p||[];if(!p.filter(function(t){return t.lhs===e}).length){p.push({lhs:e,rhs:t});if(Array.isArray(e)){var m,w=e.length;for(m=0;m<e.length;m++){if(m>=t.length){n(new l(d,m,new u(undefined,e[m])))}else{o(e[m],t[m],n,r,d,m,p)}}while(m<t.length){n(new l(d,m,new f(undefined,t[m++])))}}else{var j=Object.keys(e);var D=Object.keys(t);j.forEach(function(i,a){var f=D.indexOf(i);if(f>=0){o(e[i],t[i],n,r,d,i,p);D=s(D,f)}else{o(e[i],undefined,n,r,d,i,p)}});D.forEach(function(e){o(undefined,t[e],n,r,d,e,p)})}p.length=p.length-1}else if(e!==t){n(new a(d,e,t))}}else if(e!==t){if(!(y==="number"&&isNaN(e)&&isNaN(t))){n(new a(d,e,t))}}}function c(e,t,n,r){r=r||[];o(e,t,function(e){if(e){r.push(e)}},n);return r.length?r:undefined}function p(e,t,n){if(n.path&&n.path.length){var r=e[t],i,a=n.path.length-1;for(i=0;i<a;i++){r=r[n.path[i]]}switch(n.kind){case"A":p(r[n.path[i]],n.index,n.item);break;case"D":delete r[n.path[i]];break;case"E":case"N":r[n.path[i]]=n.rhs;break}}else{switch(n.kind){case"A":p(e[t],n.index,n.item);break;case"D":e=s(e,t);break;case"E":case"N":e[t]=n.rhs;break}}return e}function d(e,t,n){if(e&&t&&n&&n.kind){var r=e,i=-1,a=n.path?n.path.length-1:0;while(++i<a){if(typeof r[n.path[i]]==="undefined"){r[n.path[i]]=typeof n.path[i]==="number"?[]:{}}r=r[n.path[i]]}switch(n.kind){case"A":p(n.path?r[n.path[i]]:r,n.index,n.item);break;case"D":delete r[n.path[i]];break;case"E":case"N":r[n.path[i]]=n.rhs;break}}}function b(e,t,n){if(n.path&&n.path.length){var r=e[t],i,a=n.path.length-1;for(i=0;i<a;i++){r=r[n.path[i]]}switch(n.kind){case"A":b(r[n.path[i]],n.index,n.item);break;case"D":r[n.path[i]]=n.lhs;break;case"E":r[n.path[i]]=n.lhs;break;case"N":delete r[n.path[i]];break}}else{switch(n.kind){case"A":b(e[t],n.index,n.item);break;case"D":e[t]=n.lhs;break;case"E":e[t]=n.lhs;break;case"N":e=s(e,t);break}}return e}function y(e,t,n){if(e&&t&&n&&n.kind){var r=e,i,a;a=n.path.length-1;for(i=0;i<a;i++){if(typeof r[n.path[i]]==="undefined"){r[n.path[i]]={}}r=r[n.path[i]]}switch(n.kind){case"A":b(r[n.path[i]],n.index,n.item);break;case"D":r[n.path[i]]=n.lhs;break;case"E":r[n.path[i]]=n.lhs;break;case"N":delete r[n.path[i]];break}}}function v(e,t,n){if(e&&t){var r=function(r){if(!n||n(e,t,r)){d(e,t,r)}};o(e,t,r)}}Object.defineProperties(c,{diff:{value:c,enumerable:true},observableDiff:{value:o,enumerable:true},applyDiff:{value:v,enumerable:true},applyChange:{value:d,enumerable:true},revertChange:{value:y,enumerable:true},isConflict:{value:function(){return"undefined"!==typeof t},enumerable:true},noConflict:{value:function(){if(n){n.forEach(function(e){e()});n=null}return c},enumerable:true}});return c});

var diff = (DeepDiff).diff;
var observableDiff = (DeepDiff).observableDiff,
applyChange        = (DeepDiff).applyChange;

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
  var immigration = '<div class="appended-immigration"><h3>How long are you planning to stay in New Zealand?</h3><div class="col-lg-3"><div class="[ form-group ]"><input type="checkbox" name="fancy-checkbox-permanent" id="fancy-checkbox-permanent" autocomplete="off" /><div class="[ btn-group ]"><label for="fancy-checkbox-permanent" class="[ btn btn-default ]"><span class="[ glyphicon glyphicon-ok ]"></span><span> </span></label><label for="fancy-checkbox-permanent" class="[ btn btn-default active ]">permanently</label></div></div></div><div class="col-lg-3"><div class="[ form-group ]"><input type="checkbox" name="fancy-checkbox-temporary" id="fancy-checkbox-temporary" autocomplete="off" /><div class="[ btn-group ]"><label for="fancy-checkbox-temporary" class="[ btn btn-default ]"><span class="[ glyphicon glyphicon-ok ]"></span><span> </span></label><label for="fancy-checkbox-temporary" class="[ btn btn-default active ]">temporary</label></div></div></div>'
  var parentRetirementVisa = '<div class="col-lg-3" id="BusinessRulePermanent""><div class="panel-group"><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" href="#collapse1">Parent Retirement Resident Visa</a></h4></div><div id="collapse1" class="panel-collapse collapse"><ul class="list-group text-left"><li class="list-group-item">Apply for Entry Permission</li><li class="list-group-item">Invest in New Zealand</li><li class="list-group-item">$500 000 to live on</li></ul><div class="panel-footer">Once you’ve completed the 4-year investment period, you’ll be eligible for permanent residence.</div></div></div></div></div>'
  var parentGrandparentTempVisa = '<div class="col-lg-3" id="BusinessRuleTemporary""><div class="panel-group"><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" href="#collapse1">Parent or Grandparent Visitor Visa</a></h4></div><div id="collapse1" class="panel-collapse collapse"><ul class="list-group text-left"><li class="list-group-item">Provide Proof of Identity</li><li class="list-group-item">Are in good health</li><li class="list-group-item">of good character</li><li class="list-group-item">Intend to meet visa conditions</li><li class="list-group-item">Sponsored by child/grandchild/parent</li><li class="list-group-item">Sponsor is an NZ citizen or Resident</li><li class="list-group-item">Sponsor is a relation</li><li class="list-group-item">Cover your own healthcare costs</li></ul><div class="panel-footer">Once you’ve completed the 4-year investment period, you’ll be eligible for permanent residence.</div></div></div></div></div>'
  var pets = '<div class="col-lg-3" id="visaPets""><div class="panel-group"><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" href="#Pets">Immigration and Pets</a></h4></div><div id="Pets" class="panel-collapse collapse"><ul class="list-group text-left"><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" href="#unapproved">Unapproved Countries</a></h4></div><div id="unapproved" class="panel-collapse collapse"><ul class="list-group text-left"><li class="list-group-item">Provide a vet certificate</li><li class="list-group-item">Pet should have spent 6 months in approved country</li></ul></div></div><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" href="#approved">From Australia</a></h4></div><div id="approved" class="panel-collapse collapse"><ul class="list-group text-left"><li class="list-group-item">Post arrival inspection</li></ul></div></div><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" href="#permit">From Approved Countries</a></h4></div><div id="permit" class="panel-collapse collapse"><ul class="list-group text-left"><li class="list-group-item">Provide an import permit</li></ul><div class="panel-footer">Once you’ve completed the 4-year investment period, you’ll be eligible for permanent residence.</div></div></div></div></div>'
  $('#fancy-checkbox-immigration').change(
    function(){
      if ($(this).is(':checked')) {
        $("#criteria1").append(immigration).hide().fadeIn(250);
        $('#fancy-checkbox-permanent').change(
          function(){
            if ($(this).is(':checked')) {
              $('#fancy-checkbox-temporary').prop('checked', false)
              $("#BusinessRuleTemporary").fadeOut(150, function() { $(this).remove(); } );
              $("#results").append(parentRetirementVisa).hide().fadeIn(250);
              if ($("#visaPets").length == 0) {
                $("#results").append(pets).hide().fadeIn(250);
              }
            } else {
              $('#fancy-checkbox-permanent').prop('checked', false)
              $("#BusinessRulePermanent").fadeOut(250, function() { $(this).remove(); } );
              $("#visaPets").fadeOut(50, function() { $(this).remove(); });
            }
          }
        );
        $('#fancy-checkbox-temporary').change(
          function(){
            if ($(this).is(':checked')) {
              $('#fancy-checkbox-permanent').prop('checked', false)
              $("#BusinessRulePermanent").fadeOut(150, function() { $(this).remove(); });
              $("#results").append(parentGrandparentTempVisa).hide().fadeIn(250);
              if ($("#visaPets").length == 0) {
                $("#results").append(pets).hide().fadeIn(250);
              }
            } else {
              $("#BusinessRuleTemporary").fadeOut(150, function() { $(this).remove(); });
              $("#visaPets").fadeOut(50, function() { $(this).remove(); });
            }
          }
        );
      } else {
        $(".appended-immigration").fadeOut(150)
        $("#results").fadeOut(150)
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
        recursiveLoop(getObjects(myJson, 'category', 'hardship'))
      }
    }
  );
  $('#fancy-checkbox-childcare').change(
    function(){
      if ($(this).is(':checked')) {
        recursiveLoop(getObjects(myJson, 'category', 'hardship'))
      }
    }
  );
})

var difference = function(array){
   var rest = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));

   var containsEquals = function(obj, target) {
    if (obj == null) return false;
    return _.any(obj, function(value) {
      return _.isEqual(value, target);
    });
  };

  return _.filter(array, function(value){ return ! containsEquals(rest, value); });
};



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


// $('#fancy-checkbox-health').change(
//   function(){
//     if ($(this).is(':checked')) {
//       recursiveLoop(getObjects(myJson, 'category', 'hardship'))
//       var remainder = {}
//       filtered = getObjects(myJson, 'category', 'hardship')
//       // console.log(myJson.agencies[0].businessRules)
//       console.log(filtered)
//       // var remainder = diff(myJson.agencies[0].businessRules, filtered)
//       console.log(difference(filtered, originalObject))
//       var obj3 = (function() {
//         result = {};
//         for (var k in originalObject) {
//           if (filtered[k] != originalObject[k]) {
//             result[k] = originalObject[k];
//           }
//         }
//         return result;
//       })();
//
//       // console.log(obj3);
//       function newObj(arr, propValue) {
//         for (var i = arr.length - 1; i > -1; i--) {
//           if (arr[i].category === propValue) arr.splice(i,1)
//         }
//         return arr
//       }
//       // console.log(remainder)
//
//       var props = ['category', 'hardship'];
//       var originalObject = myJson.agencies[0].businessRules
//       var result = originalObject.filter(function(o1){
//           // filter out (!) items in result2
//           return !filtered.some(function(o2){
//               return o1.category === o2.category;
//           });
//       }).map(function(o){
//           // use reduce to make objects with only the required properties
//           // and map to apply this to the filtered array as a whole
//           return props.reduce(function(newo, name){
//               newo[name] = o[name];
//               // console.log(newo)
//               return newo;
//           }, {});
//       });
//     }
//   }
// );
