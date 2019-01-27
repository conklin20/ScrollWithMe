'use strict';

$(document).ready(function(){
  // userId & resumeId are global vars defined in /js/build-resume/index.js
  const url = '/api/u/' + userId + '/r/' + resumeId + '/interests'; 
  
  //load section data
  $('#nav-interests').on('click', function(){
    rebuildInterestList(url);
  })
  
  $('#btn-interests-settings').on('click', function(){
    saveSettings(url, $("#interests-settings :input"));
  })
  
  $('#btn-add-interest').on('click', function($e){
    $e.preventDefault(); //prevents scroll to top of page
    addInterest(url);
  });
  
  $('.interests').on('click', '#interest-cat-del', function(){
    if(confirm('Are you sure you want to delete this interest category and all interests?')){
      removeInterestCat($(this).parent(), url);
    }
  });
  
  $('.interests').on('click', '#interest-cat-dn', function(){
      moveInterestCat($(this).parent(), url, 'down');
  });
  
  $('.interests').on('click', '#interest-cat-up', function(){
      moveInterestCat($(this).parent(), url, 'up');
  });
  
  $('.interests').on('click', '#interest-del', function(){
    if(confirm('Are you sure you want to delete this interest?')){
      removeInterest($(this).parent(), url);
    }
  });
  
  $('.interests').on('click', '#interest-dn', function(){
      moveInterest($(this).parent(), url, 'down');
  });
  
  $('.interests').on('click', '#interest-up', function(){
      moveInterest($(this).parent(), url, 'up');
  });
  
  $('.dropdown-toggle').dropdown();
  $('#existing-interests li').on('click', function() {
    $('#interest-cat-dropdown').html($(this).find('a').html());
  });
  
  
  $('.interests').on('click', '.toggle-vision', function(){
    toggleInterestVision($(this).parent(), url);
  });
  
});

function displayInterests(interests){
  //add interests to the page 
  let catBtns   = ` | <span id="interest-cat-del"><i class="fa fa-trash"></i> | </span> 
                        <span id="interest-cat-dn"><i class="fa fa-chevron-down"></i> | </span> 
                        <span id="interest-cat-up"><i class="fa fa-chevron-up"></i></span> `;
  
  let toggleVisBtns = ""; 
                       
  const interestBtns = ` | <span id="interest-del"><i class="fa fa-trash"></i> | </span> 
                        <span id="interest-dn"><i class="fa fa-chevron-down"></i> | </span>
                        <span id="interest-up"><i class="fa fa-chevron-up"></i></span> `;
  
  interests.forEach(function(interestCat, interestIdx){
  toggleVisBtns = interestCat.hideOnPrint ?  
             ' | <span class="toggle-vision"><i class="fas fa-eye" title="Make visible on the printable version of your resume."></i></span> ' :
             ' | <span class="toggle-vision"><i class="fas fa-eye-slash" title="Hide on the printable version of your resume."></i></span> ' ;  
    
    let interestsListHTML = '<li data-catid=' + interestCat._id + '>' + interestCat.category + catBtns + toggleVisBtns;

    interestCat.interest.forEach(function(interest, idx){
      if(idx === 0) { interestsListHTML += '<ul>' }
      
      interestsListHTML += '<li data-catid=' + interestCat._id + ' data-idx=' + idx + '>' + interest.interest + interestBtns + '</li>';
      
      if(idx === interestCat.interest.length - 1) { interestsListHTML += '</ul>' }
    });
    
    interestsListHTML +=  '</li>';
    $('.interests').append(interestsListHTML);
  });
}

function addInterest(url){
  let newInterestCategory = $('#new-interest-category').val() ? true : false
  let selectedCategory = $('#interest-cat-dropdown').html($(this).find('a').html());

  let newInterest = {
    newInterestCategory:  newInterestCategory, 
    category:             newInterestCategory ? $('#new-interest-category').val() : selectedCategory[0].textContent,
    categoryIcon:         $('#new-interest-category').val() ? $('#new-interest-category-icon').val() : null,
    hideOnPrint:          $('#hideOnPrint').is(':checked'),
    interest:             $('#new-interest').val()
  };
  
  if(newInterest.category && newInterest.interest){
    $.post(url, { newInterest: newInterest })
    .then(function(interest){
      rebuildInterestList(url);
      resetForm([$('#new-interest-category'), $('#new-interest-category-icon'), $('#new-interest')]);   
      
      if(newInterestCategory){
        //if user added a new category, add it to the dropdown 
        $('#existing-interests').prepend('<li><a href="#">' + interest.category + '</a></li>');
        $('.dropdown-toggle').dropdown();
        $('#existing-interests li').on('click', function() {
          $('#interest-cat-dropdown').html($(this).find('a').html());
        });
      }
    })
    .catch(function(err){
        throwErr(err);
    });
  }
}

function removeInterestCat(interestCat, url){
  let deleteUrl = url + '/ic/' + interestCat.data('catid');

  // AJAX Call to remove array element from db
  $.ajax({
    method: 'DELETE',
    url:  deleteUrl
  })
  .then(function(data){
    //remove the element from the list 
    interestCat.remove();
    // remove the item from the dropdown
    
  })
  .catch(function(err){
    throwErr(err);
  });
}

function moveInterestCat(interestCat, url, direction){
  let updateUrl = url + '/ic/' + interestCat.data('catid') + '/' + direction;

  $.ajax({
    method: 'PUT',
    url:  updateUrl
  })
  .then(function(){
    rebuildInterestList(url); 
  })
  .catch(function(err){
    throwErr(err);
  });
}

function removeInterest(interest, url){
  let deleteUrl = url + '/ic/' + interest.data('catid') + '/i/' + interest.data('idx');
  
  $.ajax({
    method: 'DELETE',
    url:  deleteUrl
  })
  .then(function(data){
    // interest.remove();
    //cant just call interest.remove() because we're deleting from the db based on arr index, noy _id
    rebuildInterestList(url);
  })
  .catch(function(err){
    throwErr(err);
  });
}

function moveInterest(interest, url, direction){
  let updateUrl = url + '/ic/' + interest.data('catid') + '/i/' + interest.data('idx') + '/' + direction;

  $.ajax({
    method: 'PUT',
    url:  updateUrl
  })
  .then(function(){
    rebuildInterestList(url);
  })
  .catch(function(err){
    throwErr(err);
  });
}


function rebuildInterestList(url){
  //remove the interests list
  $('.interests').empty();
  //rebuild the interests list
  $.getJSON(url)
  .then(displayInterests)
  .catch(function(err){
      throwErr(err);
  });
}


function toggleInterestVision(interest, url){
  let updateUrl = url + '/ic/' + interest.data('catid');
  console.log(updateUrl)
  
  // AJAX Call to toggle visibility
  $.ajax({
    method: 'PUT',
    url:  updateUrl
  })
  .then(function(){
    rebuildInterestList(url);
  })
  .catch(function(err){
    throwErr(err);
  });
}