var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');

var messages = {};
var message_id_sequence = 0;

/* GET home (login) page. */
router.get('/', function(req, res, next) {
	res.sendFile('app.html', { root:  'public' })
});

router.get('/login', function(req, res, next) {
	res.sendFile('login.html', {root: 'public'});
});

/* GET messaging page */
router.get('/messageBox', function(req, res, next) {
	res.sendFile('messageBox.html', {root: 'public'});
});

function get_slug(val1, val2) {
	return val1.toLowerCase() + val2.toLowerCase();
}

router.get('/getmessages', function(req, res, next) {
	var slug = get_slug(req.query.userFirst, req.query.userLast);
	if (messages[slug]) {	
		Object.keys(messages[slug]['inbox']).forEach(function(key){
			messages[slug]['inbox'][key].read = 'Yes';
		});
	}

	res.status(200).json(messages[slug]);
});

router.post('/sendmessage', function(req, res, next) {
	console.log(req.body);
	var recipientSlug = get_slug(req.body.recipientFirst, req.body.recipientLast);
	var senderSlug = get_slug(req.body.userFirst, req.body.userLast);

	if (!messages[recipientSlug]){

		messages[recipientSlug] = {};
		messages[recipientSlug]['inbox'] = {};
		messages[recipientSlug]['outbox'] = [];
	}	

	if (!messages[senderSlug]) {

		messages[senderSlug] = {};
		messages[senderSlug]['inbox'] = {};
		messages[senderSlug]['outbox'] = [];
	}

	message_id_sequence++;
	var currentdate = new Date(); 
	var datetime = currentdate.getDate() + "/"
		+ (currentdate.getMonth()+1)  + "/" 
		+ currentdate.getFullYear() + " @ "  
		+ currentdate.getHours() + ":"  
		+ currentdate.getMinutes() + ":" 
		+ currentdate.getSeconds();

	var message_data = {
		messageId: message_id_sequence,
		senderFirst: req.body.userFirst,
		senderLast: req.body.userLast,
		recipientFirst: req.body.recipientFirst,
		recipientLast: req.body.recipientLast,
		message: req.body.message,
		read: "No",
		datetime: datetime,

	}

	messages[recipientSlug]['inbox'][message_id_sequence] = message_data;
	messages[senderSlug]['outbox'].push(message_data);
	res.status(200).send(true);
});

router.post('/deletemessage', function(req, res, next) {
	console.log(req.body);
	delete messages[get_slug(req.body.userFirst, req.body.userLast)]['inbox'][req.body.messageId];
	res.status(200).send(true);
});
module.exports = router;
