var express         = require("express"),
    User            = require("../../../models/users"),
    Resume          = require("../../../models/resumes"),
    CoverLetter     = require("../../../models/coverletters"),
    Reference       = require("../../../models/references"),
    middleware      = require("../../../middleware/auth.js"),
    router          = express.Router();

// **********************
// BUNDLE ROUTES
// These ROUTES follow the REST pattern
// **********************

const rootUrl = '/api/u/:userId/b';

// SHOW/Render Routes will NOT use the API convention 

// GET ALL USER BUNDLES
router.get(rootUrl, middleware.isAccountOwner, function(req, res){
    //lookup the user 
    User.findById(req.params.userId, function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect("/u/" + req.params.userId); 
        } else {
            res.status(200).json({ data: foundUser.bundles });
        }
    });
});

// CREATE NEW BUNDLE
router.post(rootUrl, middleware.isAccountOwner, function(req, res){
    //lookup the user 
    User.findById(req.params.userId, function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect("/u/" + req.params.userId); 
        } else {
            // eval(require("locus"))
            //Save the bundle to the DB
            foundUser.bundles.push(req.body)
            
            foundUser.save(); 
            
            res.status(200).json({ data: foundUser.bundles });
        }
    }); 
});

// DELETE BUNDLE
router.delete(rootUrl + '/:bundleId', middleware.isAccountOwner, function(req, res){
    //lookup the user 
    User.findById(req.params.userId, function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect("/u/" + req.params.userId); 
        } else {
        
            //remove the bundle from the user document 
            foundUser.bundles.splice(foundUser.bundles.indexOf(req.params.bundleId), 1);
            foundUser.save();
            
            res.status(200).json({ data: foundUser.bundles });
        }
    });
});

module.exports = router; 