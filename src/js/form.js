;(function(window, document, $){
	'use strict';
	console.log('run form');

	var cssPrefix = 'p08w-';

	/*
		submit form
	*/

	function form(){		

		var $form = $('#' + cssPrefix + 'form');
		var $button = $form.find('button[type="submit"]');
		var $inputs = $form.find('input.' + cssPrefix + 'js-required');

		var $message = $('#' + cssPrefix + 'form-message');

		$message.hide();

		function validation(){
			var isValid = true;
			var errorClass = cssPrefix + 'home-form__input--error';
			
			var $name = $inputs.filter('[name="name"]');
			var $email = $inputs.filter('[name="email"]');

			function validateEmail(email) {
				var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return re.test(email);
			}

			$inputs.each(function(){
				var $this = $(this);
				if ($this.val().length === 0){
					$this.addClass(errorClass);
					isValid = false;
				}else{
					$this.removeClass(errorClass);
				}
			});

			if (!validateEmail($email.val())){
				isValid = false;
				$email.addClass(errorClass);
			}else{
				$email.removeClass(errorClass);
			}

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
		form();
	}

	$(document).ready(function() {
		init();
	});

})(window, document, jQuery, undefined);
