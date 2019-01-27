'use strict';

$(document).ready(function(){
  // userId & resumeId are global vars defined in /js/build-resume/index.js
  const url = '/api/u/' + userId + '/r/' + resumeId + '/quotes'; 
  
  //load section data
  $('#nav-quotes').on('click', function(){
    rebuildQuotesList(url);
  })
  
  $('#btn-quotes-settings').on('click', function(){
    saveSettings(url, $("#quotes-settings :input"));
  })
  
  $('#btn-add-new-quote').on('click', function($e){
    $e.preventDefault(); //prevents scroll to top of page
    addQuote($(".new-quote"), url);
  });
  
  $('.quotes').on('click', '#quote-del', function(){
    if(confirm('Are you sure you want to delete this quote?')){
      removeQuote($(this).parent(), url);
    }
  });
  
  $('.quotes').on('click', '#quote-dn', function(){
      moveQuote($(this).parent(), url, 'down');
  });
  
  $('.quotes').on('click', '#quote-up', function(){
      moveQuote($(this).parent(), url, 'up');
  });
  
  $('.quotes').on('click', '.toggle-vision', function(){
    toggleQuoteVision($(this).parent(), url);
  });
});

function displayQuotes(quotes){
  const quoteBtns = ` | <span id="quote-del"><i class="fa fa-trash"></i> | </span> 
                        <span id="quote-dn"><i class="fa fa-chevron-down"></i> | </span>
                        <span id="quote-up"><i class="fa fa-chevron-up"></i></span> `;
  let toggleVisBtns = ""; 
  quotes.forEach(function(quote, quoteIdx){
    toggleVisBtns = quote.hideOnPrint ?  
           ' | <span class="toggle-vision"><i class="fas fa-eye" title="Make visible on the printable version of your resume."></i></span> ' :
           ' | <span class="toggle-vision"><i class="fas fa-eye-slash" title="Hide on the printable version of your resume."></i></span> ' ;
    
    let quotesHTML = '<li data-quoteid=' + quote._id + '>' + quote.quote + ' - ' + quote.by + quoteBtns + toggleVisBtns +'</li>';

    $('.quotes').append(quotesHTML);
  });
}

function addQuote(quote, url){

  let newQuote = {
    by:           quote[0].value, 
    quote:        quote[1].value, 
    hideOnPrint:  quote[2].checked ? true : false,
  };
  
  if(newQuote.quote && newQuote.by){
    $.post(url, { newQuote: newQuote })
    .then(function(addedQuote){
      rebuildQuotesList(url);
      
      resetForm(quote); 
    })
    .catch(function(err){
        throwErr(err);
    });
  }
}

function removeQuote(quote, url){
  let deleteUrl = url + '/q/' + quote.data('quoteid');

  // AJAX Call to remove array element from db
  $.ajax({
    method: 'DELETE',
    url:  deleteUrl
  })
  .then(function(data){
    // REFACTOR THIS SO IT DOESNT REBUILD THE ENTIRE LIST EVERY TIME
    rebuildQuotesList(url); 
  })
  .catch(function(err){
    throwErr(err);
  });
}

function moveQuote(quote, url, direction){
  let updateUrl = url + '/q/' + quote.data('quoteid') + '/' + direction;
  
  // AJAX Call to remove array element
  $.ajax({
    method: 'PUT',
    url:  updateUrl
  })
  .then(function(){
    rebuildQuotesList(url); 
  })
  .catch(function(err){
    throwErr(err);
  });
}


function rebuildQuotesList(url){
  //remove the interests list
  $('.quotes').empty();
  //rebuild the interests list
  $.getJSON(url)
  .then(displayQuotes)
  .catch(function(err){
      throwErr(err);
  });
}

function toggleQuoteVision(quote, url){
  let updateUrl = url + '/q/' + quote.data('quoteid');
  
  // AJAX Call to toggle visibility
  $.ajax({
    method: 'PUT',
    url:  updateUrl
  })
  .then(function(){
    rebuildQuotesList(url); 
  })
  .catch(function(err){
    throwErr(err);
  });
}