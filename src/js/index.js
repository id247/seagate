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


	/*
		submit form
	*/

	function form(){		

		var $form = $('#' + cssPrefix + 'form');
		var $button = $form.find('button[type="submit"]');
		var $inputs = $form.find('input');

		var $message = $('#' + cssPrefix + 'form-message');

		$message.hide();

		function validation(){
			var isValid = true;
			var errorClass = cssPrefix + 'home-form__input--error';
			
			var $name = $inputs.filter('[name="name"]');
			var $tel = $inputs.filter('[name="tel"]');

			$inputs.each(function(){
				var $this = $(this);
				if ($this.val().length === 0){
					$this.addClass(errorClass);
					isValid = false;
				}else{
					$this.removeClass(errorClass);
				}
			});

			return isValid;
		}

		$inputs.on('keyup change', validation);

		$form.on('submit', function(e){

			e.preventDefault();

			if ( !validation() ){
				return false;
			}

			$button.text('Отправка данных...');
			$button.attr('disabled', true);

			$.ajax({
				url: $form.attr('action'), 
			    method: 'POST',
			    data: $form.serialize(),
			    dataType: 'json',
			    success: function( response ) {
			    	console.log(response);
					$message.html('Спасибо! Ваша заявка была успешно отправлена!');
			    },
			    error: function(xhr, ajaxOptions, error){
			    	console.log('Data could not be saved.' + error.message);
					$message.html('Ошибка сохранения данных, попробуйте еще раз. Если ошибка повторится - свяжитесь с нами.');
			    },
			    complete: function(){					    	
			    	$message.show();
					$button.attr('disabled', false).text('Отправить заявку');			    	
			    }
			});				
			
			

		});

	}

	function init(){
		slider();
		form();
	}

	$(document).ready(function() {
		init();
	});

})(window, document, jQuery, undefined);
