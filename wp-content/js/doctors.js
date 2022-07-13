jQuery("document").ready(function($){

	if($('ul.dt-sc-vertical-nav').length) {

		var $top, $tmin;
		if(dttheme_urls.stickynav === "enable"){ $top = 80; $tmin = 132; } else { $top = 0; $tmin = 52; }

		$('ul.dt-sc-vertical-nav').sticky({ topSpacing: $top });
		$('ul.dt-sc-vertical-nav li:first').addClass('active');

		$(".dt-sc-vertical-nav a").each(function() {
			$(this).on('click', function(e){

				var $tid = $(this).attr('href');

				$('html, body').animate({
					scrollTop: $($tid).offset().top - $tmin
				}, 1000);

				$(this).parents('.dt-sc-vertical-nav').find('li').removeClass('active');
				$(this).parent('li').addClass('active');

				e.preventDefault();
			});
		});
	}

	$('div.dt-sc-doctors-sorting > a').on('click', function(e){
		$("div.dt-sc-doctors-sorting > a").removeClass("active-sort");
		$(this).addClass("active-sort");
		doctor_filter();
		e.preventDefault();
	});

	$("select[name=department-filter]").change(function(){
		doctor_filter();
	});

	if($("ul.dt-sc-team-carousel").length) {
		$("ul.dt-sc-team-carousel").each(function(){

		  var $prev = $(this).parents(".dt-sc-team-carousel-wrapper").find(".dt-sc-team-pager-prev");
		  var $next = $(this).parents(".dt-sc-team-carousel-wrapper").find(".dt-sc-team-pager-next");
		  
		  $(this).carouFredSel({
			responsive: true,
			auto: false,
			width: '100%',
			height: 'variable',
			prev: $prev,
			next: $next,
			scroll: { fx: 'crossfade', duration: 1000 },
			items: 1,
			swipe: {
				onMouse: true,
				onTouch: true
			}
		  });
		});
	}

	function doctor_filter() {
		var $data = {
			'action' : 'dt_sc_filter_doctors',
			'data'	: { 
				'title': $('div.dt-sc-doctors-sorting > a.active-sort').html(),
				'tax': $("select[name=department-filter]").val(),
				'column' : $('div.dt-sc-doctors-container').data('column')
			}
		};

		jQuery.ajax({
			url: dttheme_urls.ajaxurl,
			data: $data,
			beforeSend: function() {
				$("div.dt-sc-doctors-container").html('<div class="dt-sc-loading"></div>');
			},
			success: function( response ) {
				$("div.dt-sc-doctors-container").html(response).fadeIn();	
			}
		});
	}
});