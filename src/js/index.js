;(function(window, document, $){
	'use strict';
	console.log('run');

	var cssPrefix = 'p08w-';

	/*
		slider
	*/

	function slider(){
		var $hrefs = $('.' + cssPrefix + 'js-guardians-slider-href');
		var $slider = $('#' + cssPrefix + 'guardians-slider-list');

		var activeHferClass = cssPrefix + 'guardians__href--active';

		var slider = $slider && $slider.bxSlider({
			mode: 'vertical',
			pager: false,
			controls: false,
			auto: true,
			autoHover: true,
			onSliderLoad: function(){
				$hrefs
				.eq(0)
				.addClass(activeHferClass);

				setFrameHeight();
			},
			onSlideBefore: function($slideElement, oldIndex, newIndex){
				$hrefs
				.removeClass(activeHferClass)
				.eq(newIndex)
				.addClass(activeHferClass);
			}
		});

		$hrefs.on('click', function(e){
			e.preventDefault();

			var slideId = $(this).data('slide');

			if (!slideId){
				slideId = 0;
			}

			slider && slider.goToSlide(slideId);
		});	
	}


	function compare(){
		var $compare = $('#' + cssPrefix + 'compare');
		var $compareOpeners = $('.' + cssPrefix + 'js-compare-open');

		var visibleClass = cssPrefix + 'compare--visible';

		function show(){
			$compare.addClass(visibleClass);
		}

		function hide(){
			$compare.removeClass(visibleClass);
		}

		$compare.on('click', function(e){

			var $target = $(e.target);
			if ($target.hasClass(cssPrefix + 'js-compare-close')){
				e.preventDefault();
				hide();
			}

		});

		$compareOpeners.on('click', function(e){
			e.preventDefault();
			show();
		});
	}

	function init(){
		slider();
		compare();;
	}

	$(document).ready(function() {
		init();
	});


})(window, document, jQuery, undefined);
