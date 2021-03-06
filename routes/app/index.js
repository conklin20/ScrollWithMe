var express         = require("express"),
    User            = require("../../models/users"),
    Resume          = require("../../models/resumes"),
    CoverLetter     = require("../../models/coverletters"),
    router          = express.Router();
    

// Route    URL               Verb    Purpose                   Mongoose Method
// -----------------------------------------------------------------------------
// INDEX    /                 GET     Redirect user accordingly N/A
// NEW      
// CREATE         
// SHOW     /:userId          GET     Show Resume               Resume.findById()
// UPDATE   
// EDIT     
// DESTROY  


// SHOW DEFAULT RESUME
router.get('/:username', function(req, res) {
    //find the user in the DB 
    User.findOne({username: req.params.username }, function(err, foundUser){
    if(err){
        console.log(err); 
    } else {
        //find the resume in the DB
        if(foundUser) {
            // eval(require("locus"))
            if(foundUser.resumes.length > 0){
                // if a default resume is set use it, otherwise grab the first one
                // console.log(foundUser.defaults.resume)
                if (foundUser.defaults.resume){
                    Resume.findById(foundUser.defaults.resume, function(err, foundResume){
                        if(err){
                            console.log(err);
                        } else {
                            res.render('index', { user: foundUser, resume: foundResume, coverLetter: null }); 
                        }
                    }); 
                } else {
                        Resume.findById(foundUser.resumes[0], function(err, foundResume){
                        if(err){
                            console.log(err);
                        } else {
                            res.render('index', { user: foundUser, resume: foundResume, coverLetter: null }); 
                        }
                    }); 
                }
            } else {
                // user wasnt found
                res.status(404).json({ data: "No Resumes Found"});
            }
        } else {
            // user wasnt found
            res.status(404).json({ data: "User Profile Not Found"});
        }
    }
    }); 
});

// - SHOWING A COVERLETTER AS WELL
router.get('/:username/:coverLetterTitle', function(req, res) {
    //find the user in the DB 
    User.findOne({username: req.params.username }, function(err, foundUser){
    if(err){
        console.log(err);
    } else {
        //find the resume in the DB
        if(foundUser) {
            // eval(require("locus"))
            if(foundUser.resumes.length > 0){
                // if a default resume is set use it, otherwise grab the first one
                if (foundUser.defaults.resume){
                    Resume.findById(foundUser.defaults.resume, function(err, foundResume){
                        if(err){
                            console.log(err);
                        } else {
                            CoverLetter.findOne({title: req.params.coverLetterTitle }, function(err, foundCL) {
                                if(err){
                                    console.log(err);
                                } else {
                                    res.render('index', { user: foundUser, resume: foundResume, coverLetter: foundCL });
                                }
                            });
                        }
                    }); 
                } else {
                        Resume.findById(foundUser.resumes[0], function(err, foundResume){
                        if(err){
                            console.log(err);
                        } else {
                            CoverLetter.findOne({title: req.params.coverLetterTitle }, function(err, foundCL) {
                                if(err){
                                    console.log(err);
                                } else {
                                    res.render('index', { user: foundUser, resume: foundResume, coverLetter: foundCL });
                                }
                            });
                        }
                    }); 
                }
            } else {
                // user wasnt found
                res.status(404).json({ data: "No Resumes Found"});
            }
        } else {
            // user wasnt found
            res.status(404).json({ data: "User Profile Not Found"});
        }
    }
    }); 
});

// SHOW SPECIFIC RESUME
router.get('/u/:userId/r/:resumeId', function(req, res) {
    //find the user in the DB 
    User.findById(req.params.userId, function(err, foundUser){
        if(err){
            console.log(err); 
        } else {
            Resume.findById(req.params.resumeId, function(err, foundResume){
                if(err){
                    console.log(err);
                } else {
                    res.render('index', { user: foundUser, resume: foundResume, coverLetter: null }); 
                }
            });
        }
    }); 
});

// SHOW SPECIFIC RESUME & COVER LETTER
router.get('/u/:userId/r/:resumeId/cl/:coverLetterID', function(req, res) {
    //find the user in the DB 
    User.findById(req.params.userId, function(err, foundUser){
        if(err){
            console.log(err); 
        } else {
            Resume.findById(req.params.resumeId, function(err, foundResume){
                if(err){
                    console.log(err);
                } else {
                    CoverLetter.findById(req.params.coverLetterID, function(err, foundCL) {
                        if(err){
                            console.log(err);
                        } else {
                            res.render('index', { user: foundUser, resume: foundResume, coverLetter: foundCL });
                        }
                    });
                }
            });
        }
    }); 
});

// SHOW SPECIFIC RESUME & COVER LETTER BASED OFF OF A 'BUNDLE'
router.get('/:username/b/:bundleName', function(req, res) {
    //find the user in the DB 
    User.findOne({username: req.params.username }, function(err, foundUser){
    if(err){
        console.log(err); 
    } else {
        if(foundUser) {
            if(foundUser.resumes.length > 0){
                
                //find the bundle from the bundle name
                let idx = foundUser.bundles.map(function(x) {return x.name; }).indexOf(req.params.bundleName);
                if(idx > -1){
                    let foundBundle = foundUser.bundles[idx];
                    
                    //now that we have the bundle, we need to find the resume and cover letter associated with it
                    Resume.findById(foundBundle.resumeId, function(err, foundResume){
                        if(err){
                            console.log(err);
                        } else {
                            CoverLetter.findById(foundBundle.coverLetterId, function(err, foundCL) {
                                if(err){
                                    console.log(err);
                                } else {
                                    res.render('index', { user: foundUser, resume: foundResume, coverLetter: foundCL });
                                }
                            });
                        }
                    });
                } else {
                    res.status(404).json({ data: "No Bundle Found"});
                }
            } else {
                // user wasnt found
                res.status(404).json({ data: "No Resumes Found"});
            }
        } else {
            // user wasnt found
            res.status(404).json({ data: "User Profile Not Found"});
        }
    }
    }); 
});

// THIS IS TO SHORT CIRCUIT AN ANNOYING BUG WHERE EXPRESS TRIES TO REDIRECT TO /favicon/ico
router.get('/favicon.ico', function(req, res) {
    res.status(204);
});


module.exports = router; 

