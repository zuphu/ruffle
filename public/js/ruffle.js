
$(function() {
	var touch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
	var touchEvent = touch ? 'touchstart' : 'click';
	 
	$('#anItem').bind(touchEvent, function() {
	  console.log("Touchclicked:", this);
	});


	var ph = new PhoneCheck($('#phonenumber'), $('#countrycode'));

	$(document).ready(function() {
		
		$('#photo').val('');
		$('#phonenumber').val('');


	    $('.menu').dropit();
	    ph.setPlaceholder();

	    $('.sub-text').text('Send Ruffle');
	    $('.spinny').removeClass('fa-spinner fa-spin').addClass('fa-rocket');
	});

	$('#submit-ruffle').bind(touchEvent, function(){
		// clear any errors
		$('.error-number, .error-photo').hide();

		// phone number validation
		if(!$('#phonenumber').hasClass('pc-valid')){
			$('.error-number').show();
			return;
		}

		// file validation
		if(document.getElementById("photo").value == "") {
 	 		$('.error-photo').show();
			return;
		}
				
		$('.sub-text').text('');
		$('.spinny').removeClass('fa-rocket').addClass('fa-spinner fa-spin');
		$('#ruffleform').submit();				
	});

	$('#photo-cover').bind(touchEvent, function(){
		$('#photo').click();
		return false;
	});

	// country dropdown stuff
	function updateCountry(txt) {
		$("#countrycode option").filter(function() {
    	    return $(this).text() == txt; 
		}).attr('selected', true);		
	}

	$('.menu ul a').bind(touchEvent, function(){
		var sel = $(this).text();
		updateCountry(sel);
		$('.seltext').text(sel);
		$('.dropit-open').removeClass('dropit-open').find('.dropit-submenu').hide();
		return false;
	});
});

