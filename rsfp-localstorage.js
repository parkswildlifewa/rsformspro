jQuery(document).ready(function($) {
	'use strict';
	// we create an object that holds our function
	var rsfpsel = {
		// function to grab all the fields - this can be extended for more advanced features but at the current moment it will do
		getFields:function(context){
			var fields = $(context).find('input, textarea, select, input:checkbox, input:radio').not(':input[type=password], :input[type=button], :input[type=submit], :input[type=reset], :input[type=hidden], .rsform-captcha-box');
			return fields;
		},
		// function to store the data from your form in the localstorage
		storeValue:function(){
			var getType = $(this).attr('type');
			if(getType == 'radio'){
				localStorage[$(this).attr('id')] = $(this).val();
				$(this).siblings("input:radio").each(function() {
					localStorage.removeItem([$(this).attr('id')]);
				});
			} else if (getType == 'checkbox'){
				if ($(this).prop('checked')) {
				localStorage[$(this).attr('id')] = $(this).val();
				} else {
					localStorage.removeItem([$(this).attr('id')]);
				}
			} else {
				localStorage[$(this).attr('id')] = $(this).val();
			}
		},
		// special function for RSForm!Pro special fields
		storeSpecialValue:function(){
			var registerThis = $(this).siblings("input").not(':input[type=button], :input[type=submit], :input[type=reset], :input[type=hidden]');
			localStorage[$(registerThis).attr('id')] = $(registerThis).val();
		},
		// function to check if we have data in the local storage
		checkStorage: function() {
			var $ids = [];
			rsfpsel.getFields('#userForm').each(function(){
				$ids.push($(this).attr('id'));
			});
			for(var i=0, len=localStorage.length; i<len; i++) {
				var key = localStorage.key(i);
				if($.inArray(key, $ids)!== -1){
					return true;
				}
			}
		},
		// function to let you know if you restored or deleted the data
		notifyStorage:function(status){
			if (status == 'success'){
				var addThis			= 'alert-success';
				var showText		= 'Form Restored';
			} else {
				var addThis			= 'alert-error';
				var showText		= 'Form Cleared';
			}
			$('#userForm').prepend('<div class="alert '+addThis+'"><button type="button" class="close" data-dismiss="alert">&times;</button> '+ showText +' </div>');
		},		
		// function to populate the form fields
		populate: function(){
			rsfpsel.getFields('#userForm').each(function() {
				var $id = $(this).attr('id');
				if (localStorage[$id]) {
					$('#' + $id).val(localStorage[$id]);
					$('#' + $id).prop('checked', true);
					if ($('#' + $id).attr('multiple') == 'multiple'){
						var lstorage	= localStorage[$id];
						var values		= lstorage.split(",");
						$(this).find('option').each(function(){
							if($.inArray($(this).val(), values) !== -1){
								$(this).prop('selected', true);
							}
						});
					}
				}
			});
		},
	};

	// let's initiate the scripts using the function defined above
		// we grab all the form fields and on change we call the other function
	rsfpsel.getFields('#userForm').change(rsfpsel.storeValue);

		// we grab the special fields (calendar, map) and on mouseleave we call the storeSpecialValue function
	$('#userForm').find(".yui-calcontainer, .rsformMaps").mouseleave(rsfpsel.storeSpecialValue);

		// on form display, we check if the localstorage has data and if so, we let our user know and give him the option to use it
	if (rsfpsel.checkStorage()){
		$('#userForm').prepend('<div id="myModal" class="modal hide fade" tabindex="-1"><div class="modal-header"><button class="close" type="button" data-dismiss="modal">×</button><h3 id="myModalLabel">HEADS UP!</h3></div><div class="modal-body">Heads up! You have data stored in the Local Storage! You can use it or clear it and start from scratch! </div><div class="modal-footer"><button class="btn" data-dismiss="modal"  id="delete">Clear</button> <button class="btn btn-primary" id="populate">Use Data</button></div></div>');

		$('#myModal').modal({keyboard:true});

		$('#myModal .modal-footer button').click(function(item){
			item.preventDefault();
			if ($(this).attr('id') == 'populate'){
				rsfpsel.populate();
				rsfpsel.notifyStorage('success');
			} else {
				var $reset = confirm("Are you sure you want to delete data?");
				if ($reset){
					localStorage.clear();
					rsfpsel.notifyStorage('error');
				}
			}

			$('#myModal').modal('hide');
		});
	}
});
