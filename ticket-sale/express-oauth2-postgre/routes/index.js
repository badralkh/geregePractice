var express = require('express');
var router = express.Router();

const OAuthController = require('../controllers/oauthcontroller');
const OAuthServer = require('express-oauth-server');
const OAuthUsersModel = require('../models').OAuthUsers;
const ticketOrderModel = require('../models').ticketOrder;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.oauth = new OAuthServer({
	model:OAuthController
});

router.post('/oauth/token', router.oauth.token());

router.post('/oauth/set_client', function(req, res, next) {
	OAuthController.setClient(req.body)
	.then((client) => res.json(client))
	.catch((err)=> {
		return next(err);
	});
})
router.post('/oauth/signup', function(req, res, next) {
	OAuthController.setUser(req.body)
	.then((user) => res.json(user))
	.catch((err) => {
		return next(err);
	});
});

router.post('/oauth/verify', function(req, res) {
  console.log("body="+ req.body.otp);	
  OAuthController.getUser(req.body.username, req.body.password)
  .then(function(user){
    
  	if (user.otp==req.body.otp) {

    req.body.verified = true;

    OAuthUsersModel
    .update(req.body, {
    where: {
      username: user.username
    }
    });
    res.send("successfully verified");
  	} 
  	else {
    res.render('otp',{msg:'otp is incorrect'});
  	}
  }
  	);

}); 

router.post('/ticket/sale', function(req, res, next) {

  OAuthController.setTicketOrder(req.body)
  .then(function(order) {
    console.log("order.unitprice="+order.unitprice);
    req.body.barcode = order.quantity.toString() + req.body.unitprice + order.id.toString() ;
    const bwipjs = require('bwip-js');

    bwipjs.toBuffer({
        bcid:        'code128',       // Barcode type
        text:        req.body.barcode,    // Text to encode
        scale:       3,               // 3x scaling factor
        height:      10,              // Bar height, in millimeters
        includetext: true,            // Show human-readable text
        textxalign:  'center',        // Always good to set this
    })
    .then(png => {
        // `png` is a Buffer as in the example above
        console.log("png="+png);
    })
    .catch(err => {
        // `err` may be a string or Error object
    });

   ticketOrderModel
    .update(req.body, {
    where: {
      id: order.id
    }  
    });

    res.json(order);

    }
  )
  .catch((err) => {
    return next(err);
  });

});

router.get('/secret', router.oauth.authenticate(), function(req, res) {
	res.json('Secret area')
});

router.post('/ticket/verifyCheckedin', function(req, res) {
 
  OAuthController.getTicketOrder(req.body.barcode)
  .then(function(order){
    console.log("order="+ order);
    if(order!=null) {
      console.log(order.id);
      res.send(order.checkedin);
    } else {
      res.send("ticket with the barcode not found");
    }
  }
    );
}); 

module.exports = router;
