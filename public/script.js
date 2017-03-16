$(document).ready(function() {

	function renderPage(page){
		$.get(page, function(response) {
			$('#app').html(response);
		});
	}

	function showNav(){
		$('#name').text(window.localStorage.firstname);
		$('#mainnav').show();
	}

	function hideNav(){
		$('#mainnav').hide();
	}

	function getAccPanel(message, i, parent, body, title){

	    	return  '<div class="panel panel-default">' +
               '<div class="panel-heading" role="tab" id="heading' + i +'">' +
                  '<h4 class="panel-title">'+
                    '<a class="collapsed" role="button" data-toggle="collapse" data-parent="#' + parent + '" href="#collapse' +parent + i +'" aria-expanded="false" aria-controls="collapse' + parent +i +'">' +
                      title +
                    '</a>' +
                  '</h4>' +
                '</div>' +
                '<div id="collapse' + parent +i +'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + parent + i +'">' +
                  '<div class="panel-body">' +
 						body + 
                  '</div>' +
                '</div>' +
              '</div>';
	}

	function refreshMessages() {
		$("#messages").empty();
		$("#sentmessages").empty();
		var data = {
			userFirst: window.localStorage.firstname,
			userLast: window.localStorage.lastname
		}
		$.getJSON('http://localhost:3000/getmessages', data, function(response) {

		    Object.keys(response['inbox']).reverse().forEach(function(key, i){
		    	var message = response['inbox'][key];

		    	var body = '<p><u>Message</u><br> ' + message.message + '</p>' +
		    	 
		    	'<a href="#" class="deletemessage" messageid="' + message.messageId + '">Delete Message</a>';

		    	var title = 'From: ' + message.senderFirst + ' ' + message.senderLast +
		    	'<br>Date: ' + message.datetime;

		    	$("#messages").append(getAccPanel(message, i, 'messages', body, title));
		    });

		    Object.keys(response['outbox']).reverse().forEach(function(key, i){
		    	var message = response['outbox'][key];
		    	var body = '<p><u>Message</u><br>' + message.message + '</p>';

		    	var title = 'To: ' + message.senderFirst + ' ' + message.senderLast + ' &nbsp;&nbsp;' + 'Read: ' + message.read + 
		    	'<br>Date: ' + message.datetime;
		    	$("#sentmessages").append(getAccPanel(message, i, 'sentmessages', body, title));
		    });


		}, 'json');
	}

	// Pick the right page to render!
	if (window.localStorage.firstname && window.localStorage.lastname){
		renderPage('/messageBox');
		showNav();
		setTimeout(refreshMessages, 300);
	}
	else {
		renderPage('/login')
	}
	
	$(document).on('click', '#login', function(e){
		e.preventDefault();
		
		if(($('#firstName').val() == "") || ($('#lastName').val() == "")){
			window.alert("enter a first and last name");	
		}
		else {
			window.localStorage.firstname = $('#firstName').val();
			window.localStorage.lastname = $('#lastName').val();		   						
		
			var data = {firstname: $('#firstName').val(),
					lastname:  $('#lastName').val()		   						
			}
			
			renderPage('/messageBox')
			showNav();
			setTimeout(refreshMessages, 300);
		}

	});

	$(document).on('submit', '#newMessage', function(e){
		e.preventDefault();

		var data = {message: $('#messageBody').val(), 
		recipientFirst: $('#recipientFirst').val(),
		recipientLast: $('#recipientLast').val(),
		userFirst: window.localStorage.firstname,
		userLast: window.localStorage.lastname
	}
		$.post('http://localhost:3000/sendmessage', data, function(response) {
		    console.log(response);
		}, 'json');
		
		$('#messageBody').val("");
		$('#recipientFirst').val("");
		$('#recipientLast').val("");
		alert('Message Sent!');
		refreshMessages();
	});

	$(document).on('click', '#getMessages', function(e){
		e.preventDefault();
		refreshMessages();
			
	});
	
	$(document).on('click', '#logout', function(e){
		e.preventDefault();

		window.localStorage.clear();
		location.reload();
	});

	$(document).on('click', '.deletemessage', function(e){

		e.preventDefault();
		var data = {messageId: $(this).attr('messageid'), 
			userFirst: window.localStorage.firstname,
			userLast: window.localStorage.lastname
		}
		$.post('http://localhost:3000/deletemessage', data, function(response) {
		    console.log(response);
		}, 'json');
		$('#getMessages').click();
	});


});

