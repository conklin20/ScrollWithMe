'use strict';

$(document).ready(function(){
  // userId & resumeId are global vars defined in /js/build-resume/index.js
  const url = '/api/u/' + userId + '/r/' + resumeId + '/tags'; 
  
  //load section data
  $('#nav-tags').on('click', function(){
    rebuildTagList(url);
  })
  
  $('#btn-add-new-tag').on('click', function($e){
    $e.preventDefault(); //prevents scroll to top of page
    addTag($(".new-tag"), url);
  });
  
  $('.tags').on('click', '#tag-del', function(){
    removeTag($(this).parent(), url);
  });
  
});

function displayTags(tags){
  const tagBtns = ` | <span id="tag-del"><i class="fa fa-trash"></i> </span> `;
  
  tags.forEach(function(tag, tagIdx){
    var tagsHTML = '<li data-tagidx=' + tagIdx + '>' + tag + tagBtns +'</li>';

    $('.tags').append(tagsHTML);
  });
}

function addTag(tag, url){

  if(tag[0].value){
    $.post(url, { tag: tag[0].value })
    .then(function(addedTag){
      
      resetForm(tag);
      
      rebuildTagList(url);
    })
    .catch(function(err){
        throwErr(err);
    });
  }
}

function removeTag(tag, url){
  var deleteUrl = url + '/' + tag.data('tagidx');

  // AJAX Call to remove array element from db
  $.ajax({
    method: 'DELETE',
    url:  deleteUrl
  })
  .then(function(data){
    rebuildTagList(url); 
  })
  .catch(function(err){
    throwErr(err);
  });
}

function rebuildTagList(url){
  
  $('.tags').empty();
  
  $.getJSON(url)
  .then(displayTags)
  .catch(function(err){
      throwErr(err);
  });
}