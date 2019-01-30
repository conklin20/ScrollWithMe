'use strict';

$(document).ready(function(){
  //if cover letter is being shown, add an event listener to close it
  if($('#close-cover-letter').length){
    var closeCoverLetterBtn = document.getElementById('close-cover-letter'); 
    closeCoverLetterBtn.addEventListener('click', function(){
        // var coverLetter = document.getElementById("cover-letter");
        // coverLetter.classList.add('cover-letter-fade-out');
        $('#cover-letter').fadeOut(1500, function() {
          // Animation complete. Remove element from page
          $('#cover-letter').empty();
        });
    });
  }
  
  $('.ui.sticky')
  .sticky({
    context: '#context'
  });
  
  loadIntro()
});


function loadIntro(){
  $('#intro').css({
      fontSize: 48,
      fontFamily: 'system-ui'
  }); 
  let intro = $('#intro').data('intro').split('');
  let randDelay = 1000;
  (function theLoop (i) {
    setTimeout(function () {
      $('#intro').append(intro[i])
      if (i <= intro.length) {
        i++;        
        theLoop(i);       
      }
    }, randDelay);
    randDelay = (i % 2 === 0 ? randDelay = Math.random() * (150 - 0) + 0 : randDelay)
  })(0)
  loadElevator();
}

function loadElevator(){
  $('#elevator').css({
      fontSize: 48,
      fontFamily: 'system-ui'
  });
  let elevator = $('#elevator').data('elevator').split('');
  let randDelay = 6000;
  (function theLoop (i) {
    setTimeout(function () {
      $('#elevator').append(elevator[i])
      if (i <= elevator.length) {
        i++;        
        theLoop(i);       
      }
    }, randDelay);
    randDelay = (i % 2 === 0 ? randDelay = Math.random() * (150 - 0) + 0 : randDelay)
  })(0)
}