var express         = require("express"),
    User            = require("../../../models/users"),
    Resume          = require("../../../models/resumes"),
    middleware      = require("../../../middleware/auth.js"),
    router          = express.Router();

// SHOW CREATE NEW RESUME PAGE
router.get('/u/:userId/r', middleware.ensureAuthenticated, function(req, res){
  //find the user in the DB 
  User.findById(req.params.userId, function(err, foundUser){
    if(err){
      console.log(err); 
    } else {
      res.render('resume-new', { user: foundUser, resume: null });
    }
  }); 
});


// SHOW RESUME EDIT PAGE
router.get('/u/:userId/r/:resumeId/edit', middleware.isAccountOwner, function(req, res){
  User.findById(req.params.userId, function(err, foundUser){
    if(err){
      console.log(err); 
    } else {
      Resume.findById(req.params.resumeId, function(err, foundResume){
        if(err){
          console.log(err);
        } else {
          res.render('resume-edit', { user: foundUser, resume: foundResume });
        }
      });
    }
  }); 
});

// SHOW (PRINTABLE VERSION)
router.get('/u/:userId/r/:resumeId/print', function(req, res){
  //find the user in the DB 
  User.findById(req.params.userId, function(err, foundUser){
    if(err){
      console.log(err); 
    } else {
      Resume.findById(req.params.resumeId, function(err, foundResume){
        if(err){
          console.log(err);
        } else {
          // res.render('resumePrint', { user: foundUser, resume: foundResume });
          res.render('prints/resume', { user: foundUser, resume: foundResume });
        }
      }); 
    }
  }); 
});

module.exports = router;