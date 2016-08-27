;(function(window, document, $){
	'use strict';
	console.log('run');

	var cssPrefix = 'p08w-';

	/*
		slider
	*/

	function slider(){

	}


	/*
		submit form
	*/

	function form(){		

		$('form').each( function(){

			const $form = $(this);
			const $button = $form.find('button[type="submit"]');
			const $success = $form.find('.order-form__success');
			
			$success.hide();

	

			$form.on('submit', function(e){

				e.preventDefault();

				const form = e.target;

				if ( !$(form).valid() ){
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
						$success.html('Спасибо! Ваша заявка была успешно отправлена!');
						$success.removeClass('order-form__success--error');	
				    },
				    error: function(xhr, ajaxOptions, error){
				    	console.log('Data could not be saved.' + error.message);
						$success.addClass('order-form__success--error');
						$success.html('Ошибка сохранения данных, попробуйте еще раз. Если ошибка повторится - свяжитесь с нами.');

				    },
				    complete: function(){					    	
				    	$success.show();
						$button.attr('disabled', false).text('Отправить заявку');			    	
				    }
				});				
				
				

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
