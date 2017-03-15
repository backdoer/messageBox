

$(document).ready(function() {

	$('#newMessage').submit(function(e){
		e.preventDefault();

		var data = {message: $('#messageBody').val(), 
		recipientFirst: $('#recipientFirst').val(),
		recipientLast: $('#recipientLast').val(),
		userFirst: $('#firstName').val(),
		userLast: $('#lastName').val()
	}
		$.post('http://localhost:3000/sendmessage', data, function(response) {
		    console.log(response);
		}, 'json');
	});

	$('#getMessages').click(function(e){
		e.preventDefault();
		$("#messages").empty();
		$("#sentMessages").empty();
		var data = {
			userFirst: $('#firstName').val(),
			userLast: $('#lastName').val()
		}
		$.getJSON('http://localhost:3000/getmessages', data, function(response) {

		    console.log(response);
		    Object.keys(response['inbox']).forEach(function(key){
		    	var message = response['inbox'][key];
		    	console.log(message);
		    	$("#messages").append(
		    		'<h3> Message</h3>' + 
		    		'<p>Sender: ' + message.senderFirst + ' ' + message.senderLast + '</p>' + 
		    		'<p>Message: ' + message.message + '</p>' + 
		    		'<a href="#" class="deletemessage" messageid="' + message.messageId + '">Delete Message</a>'			    		
		    		);
		    });

		    Object.keys(response['outbox']).forEach(function(key){
		    	var message = response['outbox'][key];
		    	console.log(message);
		    	$("#sentMessages").append(
		    		'<h3> Message</h3>' + 
		    		'<p>Recipient: ' + message.recipientFirst + ' ' + message.recipientLast + '</p>' + 
		    		'<p>Message: ' + message.message + '</p>'			    		
		    		);
		    });


		}, 'json');			
	});

	$(document).on('click', '.deletemessage', function(e){

		e.preventDefault();
		var data = {messageId: $(this).attr('messageid'), 
			userFirst: $('#firstName').val(),
			userLast: $('#lastName').val()
		}
		$.post('http://localhost:3000/deletemessage', data, function(response) {
		    console.log(response);
		}, 'json');
		$('#getMessages').click();
	});


});

