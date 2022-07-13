//appointment type2
jQuery(window).on('load', function(){
	if(jQuery('#appointment-step-checker').val() != 'false') {
		jQuery('#appointment-step').val(1);
	} else {
		jQuery('#appointment-step').val(2);	
	}
});
// appointment type2

jQuery(document).ready(function($){

	$(".dt-select-service").change(function(){
		var $id = $(this).val();
		$.ajax({
			method:'POST',
			url: dttheme_urls.ajaxurl,
			type: 'html',
			data:{ action: 'pediatric_fill_staffs', service_id :$id },
			complete: function(response){
				if( response.status === 200 ) {
					var $append = "";
					if( $.trim(response.responseText).length > 0 ) {
						$append += response.responseText;
						$(".dt-select-staff").empty().append($append);
					}
				}
			}
		});
	});

	$('#datepicker').datepicker({
		minDate: 0,
		dateFormat : 'yy-mm-dd'
	})

	//appointment type2 starts
	if($('body').hasClass('page-template-tpl-reservation-type2-php') ){
		$("body").delegate(".appointment-goback","click",function(e){
			
			$('.steps').hide();
			
			var curr_step_val = $('#appointment-step').val();
			var step_to_show = parseInt(curr_step_val, 10) - 1;
			
			$('.dt-sc-schedule-progress-wrapper .step'+curr_step_val).removeClass('dt-sc-current-step');
			$('.dt-sc-schedule-progress-wrapper .step'+step_to_show).removeClass('dt-sc-completed-step');
			$('.dt-sc-schedule-progress-wrapper .step'+step_to_show).addClass('dt-sc-current-step');
			
			$('.step' + step_to_show).fadeIn(800);
			
			$('#appointment-step').val(step_to_show);
			
			if(step_to_show == 1) {
				$('.dt-sc-goback-box').hide();
			}
			
		});
	
		function pediatric_calculate_step_value() {
			
			$('.dt-sc-goback-box').show();
			
			var curr_step_val = $('#appointment-step').val();
			var updated_step_val = parseInt(curr_step_val, 10) + 1;
			
			$('.dt-sc-schedule-progress-wrapper .dt-sc-schedule-progress').removeClass('dt-sc-current-step');
			$('.dt-sc-schedule-progress-wrapper .step'+curr_step_val).addClass('dt-sc-completed-step');
			$('.dt-sc-schedule-progress-wrapper .step'+updated_step_val).addClass('dt-sc-current-step');
			
			$('#appointment-step').val(updated_step_val);
			if(updated_step_val == 4 || updated_step_val == 1) { $('.appointment-goback').hide(); $('.dt-sc-goback-box').hide(); }
			
		}
	
		$('form[name="dt-sc-appointment-contactdetails-form"]').on('submit', function () {	
			
			var $firstname = $('#firstname').val();
			var $lastname = $('#lastname').val();
			var $phone = $('#phone').val();
			var $emailid = $('#emailid').val();
			var $address = $('#address').val();
			var $about_your_project = $('#about_your_project').val();
			
			$('#hid_firstname').val($firstname);
			$('#hid_lastname').val($lastname);
			$('#hid_phone').val($phone);
			$('#hid_emailid').val($emailid);
			$('#hid_address').val($address);
			$('#hid_about_your_project').val($about_your_project);
			
			var contact_details = '<ul>';
					if($firstname != '') { contact_details += '<li><span>Name:</span><p>' + $firstname + ' ' + $lastname + '</p></li>'; }
					if($phone != '') { contact_details += '<li><span>Phone:</span><p>' + $phone + '</p></li>'; }
					if($emailid != '') { contact_details += '<li><span>Email:</span><p>' + $emailid + '</p></li>'; }
					if($address != '') { contact_details += '<li><span>Address:</span><p>' + $address + '</p></li>'; }
					if($about_your_project != '') { contact_details += '<li><span>Message:</span><p>' + $about_your_project + '</p></li>'; }
				contact_details += '</ul>';
				
			$('#dt-sc-contact-info').html(contact_details);	
			
			$('.dt-sc-contactdetails-box').hide();
			$('.dt-sc-aboutproject-box').show();
			$('.dt-sc-notification-box').show();
			
			pediatric_calculate_step_value();
			
			return false;
	
		});
	
		$("body").delegate(".generate-schedule","click",function(e){
			
			var $serviceid = $('#serviceid').val();
			var $staffid = $('#staffid').val();
			var $staffids = $('#staffids').val();
			var $aptdatepicker = $('#datepicker').val();
			
			if( $aptdatepicker == "Select Date" || $serviceid.length == "" ){
				alert(dtAppointmentCustom.eraptdatepicker);
				return false;
			}
			
			$.ajax({
				method:'POST',
				url: dttheme_urls.ajaxurl,
				type: 'html',
				data:{ action: 'pediatric_dt_generate_schedule', serviceid :$serviceid, staffid :$staffid, staffids :$staffids, datepicker :$aptdatepicker },
				beforeSend: function(){
					$(".dt-sc-timeslot-box").hide();
				},
				complete: function(response){
					$(".appointment-ajax-holder").html(response.responseText);
					$(".dt-sc-timeslot-box").fadeIn(800);
					
					$('html, body').animate({
						scrollTop: $('.dt-sc-timeslot-box').offset().top - 200
					},2000);
				}
			});
			
		});
	
		 /*$("body").delegate("a.time-slot","click",function(e){
			
			e.preventDefault();
			
			var $daydate = $(this).data('daydate'),
				$time = $(this).data('time'),
				$service = $('*[name=serviceid] :selected').text(),
				$staff = $(this).data('staffname');
			
			var schedule_details = '<ul>';
					if($service != '') { schedule_details += '<li><span>Department:</span><p>' + $service + '</p></li>'; }
					if($staff != '') { schedule_details += '<li><span>Staff:</span><p>' + $staff + '</p></li>'; }
					if($daydate != '') { schedule_details += '<li><span>Date:</span><p>' + $daydate + '</p></li>'; }
					if($time != '') { schedule_details += '<li><span>Time:</span><p>' + $time + '</p></li>'; }
				schedule_details += '</ul>';
				
			$('#dt-sc-schedule-details').html(schedule_details);	
			
			$('.dt-sc-schedule-box').hide();
			$('.dt-sc-contactdetails-box').fadeIn(800);
			
			$("a.time-slot").removeClass('selected');
			$(this).addClass('selected');
			
			$("ul.time-table").find('li,ul.time-slots').removeClass('selected'); 
			$(this).parentsUntil("ul.time-table").addClass('selected'); 
			
			pediatric_calculate_step_value();
			
		 });*/
	
	
		 $(".dt-sc-about-project-form .schedule-it").on('click', function(e){
			
			e.preventDefault();
	
			$staffid = $('a.time-slot.selected').data('staffid');
			$serviceid = $('a.time-slot.selected').data('serviceid');
			$start = $('a.time-slot.selected').data('start');
			$end = $('a.time-slot.selected').data('end');
			$date = $('a.time-slot.selected').data('date');
			$time = $('a.time-slot.selected').data('time');
	
			$firstname = $(".dt-sc-aboutproject-box #hid_firstname").val();
			$lastname = $(".dt-sc-aboutproject-box #hid_lastname").val();
			$phone = $(".dt-sc-aboutproject-box #hid_phone").val();
			$emailid = $(".dt-sc-aboutproject-box #hid_emailid").val();
			$address = $(".dt-sc-aboutproject-box #hid_address").val();
			$about_your_project = $(".dt-sc-aboutproject-box #hid_about_your_project").val();
			
			
			if( typeof($start) != 'undefined' ) {
				$.ajax({
					method: 'POST',
					url: 	dttheme_urls.ajaxurl,
					data: 	{ 
						action: "pediatric_dttheme_new_reservation",
						staffid: $staffid,
						serviceid: $serviceid,
						start: $start,
						end: $end,
						date: $date,
						time: $time,
						
						firstname: $firstname,
						lastname: $lastname,
						phone: $phone,
						emailid: $emailid,
						address: $address,
						
						aboutyourproject: $about_your_project,
					},
					dataType: 'json',
					beforeSend: function(){
						$('#dt-sc-ajax-load-image').show();
					},
					success: function( response ){
						$('.dt-sc-notification-box').show();
						if(response == 'Success') {
							$('.dt-sc-apt-success-box').fadeIn(800);
						} else {
							$('.dt-sc-apt-error-box').fadeIn(800);
						}
					},
					complete: function(){
						$('#dt-sc-ajax-load-image').hide();
						pediatric_calculate_step_value();
					} 
				});
			} else {
				$("a.schedule-it").hide();
			}
		 });
	}

	//dt_admin.js
	jQuery('.select_start').on('change', function(){
		var $row = jQuery(this).parent(),
		$start_select = jQuery(this),
		$end_select = jQuery('.select_end', $row);
		
		if( $start_select.val() ){
			$end_select.show();
		}else{
			$end_select.hide();
			$start_select.find('option[selected="selected"]').removeAttr('selected');
			$end_select.find('option[selected="selected"]').removeAttr('selected');
		}

        jQuery('option', $end_select).each(function () {
            jQuery(this).show();
        });

		var start_time = $start_select.val();
		$current = $end_select.data('current');
		
		jQuery('option', $end_select).each(function(){
			if (jQuery(this).val() <= start_time) {
				jQuery(this).hide();
				jQuery(this).removeAttr('selected');
				if( $current < jQuery(this).val() ){
					jQuery('option:visible:first', $end_select).prop("selected", true );
				}
			} else if( !$current || $current == '00:00' ){
				jQuery('option:visible:first', $end_select).prop("selected", true );
			}
		});
	}).each(function(){
		var $row = jQuery(this).parent(),
		$start_select = jQuery(this),
		$end_select = jQuery('.select_end', $row);

		if( !jQuery(this).val() ){
			$end_select.hide();
			$start_select.find('option[selected="selected"]').removeAttr('selected');
			$end_select.find('option[selected="selected"]').removeAttr('selected');
		}
	}).trigger('change');
	//appointment type2 ends	

	$(".start-time").change(function(){
		var $s_time = $(this).val(),
		$last = $('option:last', $(this));
		
		$(".end-time").empty();

		if($(this)[0].selectedIndex < $last.index() ){
			$('option', this).each(function () {
				if ($(this).val() > $s_time) {
					$(".end-time").append($(this).clone());
                }
            });
		} else {
			$(".end-time").append($last.clone()).val($last.val());
		}
	});
	
	/* V */
	$(".show-time-shortcode").on('click', function(e){
		$date = $("*[name=date]").val();
		$stime = $('*[name=start-time]').val();
		$etime = $('*[name=end-time]').val();
		$staff = $('*[name=staff]').val();
		$service = $('*[name=services]').val();
		
		if( $staff.length > 0 || $service.length > 0 ) {
			$(".dt-sc-reservation-form").submit();
		}else{
			alert("Please choose Service");
		}	
		e.preventDefault();
	});
	
	function pediatric_staff_reservation(){
		$date = $("*[name=date]").val();
		$stime = $('*[name=start-time]').val();
		$etime = $('*[name=end-time]').val();
		$staff = $('*[name=staff]').val();
		$service = $('*[name=services]').val();

		if( $staff.length > 0 || $service.length > 0 ) {
				$.ajax({
					method:'POST',
					url: dttheme_urls.ajaxurl,
					type: 'html',
					data:{ action: 'pediatric_available_times', 
						date :$date,
						stime:$stime,
						etime:$etime,
						staffid:$staff,
						staff: $('*[name=staff] :selected').text(),
						serviceid:$service,
						service:$('*[name=services] :selected').text()
					},
					complete: function(response){
						if( response.status === 200 ) {
							var $append = "";
							if( $.trim(response.responseText).length > 0 ) {
								$append += response.responseText;
								$(".available-times").empty().append($append);
							}
						}
					}
				});
		}else{
			alert("Please choose Service");
		}	
	}
	
	$(".start-time").each(function(){
		
		$service = $('*[name=services]').val();
		if( $service.length > 0 ) {
			pediatric_staff_reservation();
		}
	});
	/* V */
	
	$(".show-time").on('click', function(e){
		pediatric_staff_reservation();
		e.preventDefault();
	});
	
	/* Time Slot Click */
	if($('body').hasClass('page-template-tpl-reservation-php') ){
		$("body").delegate("a.time-slot","click",function(e){
			e.preventDefault();
			$("div.personal-info").show();
			$('html, body').animate({
				//scrollTop: $('#personalinfo').offset().top + 500
				scrollTop: $('#personalinfo').offset().top-100
			},2000);
			
			$("div.choose-payment").show();
			$("a.time-slot").removeClass('selected');
			$(this).addClass('selected');
			
			$("ul.time-table").find('li,ul.time-slots').removeClass('selected');
			$(this).parentsUntil("ul.time-table").addClass('selected');
		});
	}
	
	$("body").delegate("select[name='payment_type']",'change',function(e){
		$val = $(this).val();
		if( $val.length > 0 ) {
			$("a.schedule-it").show();
		} else {
			$("a.schedule-it").hide();
		}
	});

	/* Book Schedule */
	$("a.schedule-it").on('click', function(e){
		e.preventDefault();

		$staff = $('a.time-slot.selected').data('sid');
		$service = $('*[name=services]').val();
		$start = $('a.time-slot.selected').data('start');
		$end = $('a.time-slot.selected').data('end');
		$date = $('a.time-slot.selected').data('date');
		$time = $('a.time-slot.selected').data('time');

		$name = $("div.personal-info").find('input[name=name]').val();
		$email = $("div.personal-info").find('input[name=email]').val();
		$phone = $("div.personal-info").find('input[name=phone]').val();
		$body = $("div.personal-info").find('textarea[name=note]').val();
		
		$captcha = $("div.personal-info").find('input[name=captcha]').val();
		$hcaptcha = $("div.personal-info").find('input[name=hiddencaptcha]').val();
		
		
		
		if( $name.length == "" ){
			alert("Please enter name");
			return false;
		}
		
		if( $email.length == "" ){ 
			var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            if( emailReg.test( $email ) ) { 
                alert('Please enter valid email');
				return false;
            } 
		}
		
		if( $phone.length < 5 ){
			alert("Please enter Phone number");
			return false;
		}
		
		if( $captcha.length <= 0 ){
			alert("Please enter captcha");
			return false;
		}
		
		if( $captcha !== $hcaptcha){
			alert("Please verify entered captcha");
			return false;
		}
		
		$payment = $("select[name='payment_type']").val();

		$action  = "pediatric_new_reservation";

		if( typeof($start) != 'undefined' ) {
			$.ajax({
				method: 'POST',
				url: 	dttheme_urls.ajaxurl,
				data: 	{ 
					action: $action,
					staff: 	$staff,
					service:$service,
					start: 	$start,
					end: 	$end,
					name: 	$name,
					email: 	$email,
					phone: 	$phone,
					body: 	$body,
					date:  $date,
					time:  $time
				},
				dataType: 'json',
				success: function( response ){
					window.location = response.url;
				}
			});
		} else {
			$("a.schedule-it").hide();
		}

	});
	/* Book Schedule */
});