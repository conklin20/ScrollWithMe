// shared js file housing commonly shared functions
'use strict';

$(document).ready(function(){
  const url = '/api/u/'+userId+'/b'

  //load section data
  $('#nav-bundles').on('click', function(){
    rebuildBundleList(url);
  });
  
  $('#btn-add-bundle').on('click', function($e){
    $e.preventDefault(); //prevents scroll to top of page
    addBundle($(".new-bundle"), url);
  })
  
  $('.bundles').on('click', '#btn-delete-bundle', function($e){
    $e.preventDefault(); //prevents scroll to top of page
    if(confirm('Are you sure you want to delete this bundle?')){
      deleteBundle($(this), url);
    }
  });
  
  // load the dropdown lists
  getResumes('/api/u/' + userId);
  getCoverLetters('/api/u/' + userId);
});

function addBundle(bundle, url){
  
  let newBundle = {
    resumeId:       bundle[0].value, 
    coverLetterId:  bundle[1].value,
    name:           bundle[2].value
  };
  
  $.ajax({
    method: 'POST',
    url:  url, 
    data: newBundle
  })
  .then(function(data){
    rebuildBundleList(url); 
  })
  .catch(function(err){
    throwErr(err);
  });
}

function deleteBundle(bundle, url){
  let deleteUrl = url + '/' + bundle.data('id'); 
  
  $.ajax({
    method: 'DELETE',
    url:  deleteUrl, 
  })
  .then(function(data){
    rebuildBundleList(url); 
  })
  .catch(function(err){
    throwErr(err);
  });
}

function loadUserResumes(resumes){
    // console.log(resumes.data);
    
    let resumesHTML = ''; 
    
    resumes.data.forEach(function(resume){
        resumesHTML += '<option value='+resume._id+' >' + 
                            resume.alias + 
                       '</option>'
    });

    $('#resume-bundle-dd').append(resumesHTML);
}

function loadUserCoverLetters(coverLetters){
    // console.log(coverLetters.data);
    
    let clHTML = ''; 
    
    coverLetters.data.forEach(function(coverLetter){
        clHTML += '<option value='+coverLetter._id+' >' + 
                        coverLetter.title + 
                   '</option>'
    });

    $('#cl-bundle-dd').append(clHTML);
}

function getResumes(url){
  let getUrl = url + '/r';
  
  //remove the interests list
  $('#resume-bundle-dd').empty();
  //rebuild the interests list
  $.getJSON(getUrl)
  .then(loadUserResumes)
  .catch(function(err){
      throwErr(err);
  });
}

function getCoverLetters(url){
  let getUrl = url + '/cl';
  
  //remove the interests list
  $('#cl-bundle-dd').empty();
  //rebuild the interests list
  $.getJSON(getUrl)
  .then(loadUserCoverLetters)
  .catch(function(err){
      throwErr(err);
  });
}

function displayBundles(bundles) {
  if(bundles.data.length > 0){
    $('#msg').text('Existing Bundles');
  } else {
    $('#msg').text('No Bundles Found');
  }
  $('#count').text(bundles.data.length); 
  
  bundles.data.forEach(function(bundle){
    var bundleHTML = '<li>' + 
                        "<a href='/"+userName+"/b/"+bundle.name+"' target='_blank' >"+bundle.name+" | </a>" +
                        "<a href='#' id='btn-delete-bundle' title='Delete Bundle' data-id="+bundle._id+" ><i class='fas fa-trash'></i></a> " + 
                    '</li>';
  
    $('.bundles').append(bundleHTML); 
  });
}

function rebuildBundleList(url){
  $('.bundles').empty();
  
  //rebuild the bundle list
  $.getJSON(url)
  .then(displayBundles)
  .catch(function(err){
      throwErr(err);
  });
}