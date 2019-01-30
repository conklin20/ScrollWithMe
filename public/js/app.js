'use strict';

$(document).ready(function(){
  $('.type-style h3').css({
      fontSize: 36,
      fontFamily: 'system-ui',
      fontWeight: 'bold'
  });
  $('#introduction').removeClass('landing-msg')
  $('#elevator-pitch').removeClass('landing-msg')
  
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
        //load the intro and elevator pitch
        loadIntro();
    });
  } else {
    //load the intro and elevator pitch
    loadIntro();
  }
  
  $('.ui.sticky')
  .sticky({
    context: '#context'
  });
  
  //loadIntro()
});

// code for mimicking typing
function loadIntro(){
  $('#introduction').addClass('landing-msg')
  let intro = $('#intro').data('intro').split('');
  let randDelay = 1000;
  (function theLoop (i) {
    setTimeout(function () {
      $('#intro').append(intro[i])
      if (i <= intro.length) {
        i++;        
        theLoop(i);       
      } else{
        loadElevator();
      }
    }, randDelay);
    randDelay = (i % 2 === 0 ? randDelay = Math.random() * (120 - 0) + 0 : randDelay);
  })(0);
}

function loadElevator(){
  console.log($('#elevator').data('elevator').trim())
  if($('#elevator').data('elevator').trim() != ''){ 
    $('#elevator-pitch').addClass('landing-msg')
    let elevator = $('#elevator').data('elevator').split('');
    let randDelay = 0;
    (function theLoop (i) {
      setTimeout(function () {
        $('#elevator').append(elevator[i])
        if (i <= elevator.length) {
          i++;        
          theLoop(i);       
        }
      }, randDelay);
      randDelay = (i % 2 === 0 ? randDelay = Math.random() * (120 - 0) + 0 : randDelay);
    })(0);
  }
}
// end code for mimicking typing