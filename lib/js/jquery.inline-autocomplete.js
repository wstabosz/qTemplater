
(function ($) {

    $.fn.inlineAutoComplete = function (method) {

        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tooltip');
        }

    };

    // function definitions

    var init = function (options) {

        var settings = $.extend({
            words: ['apple', 'banana', 'carrot', 'dog'],
            manualSearch: false,
            //regex: /[\w\s\{]\w*$/i
            //regex: /[\s]+([^\s]{1,}$)/i
            regex: /[\s]+([^\s]*$)/i
        }, options);

        function copyStyle(styles, source, target) {

            source = $(source);
            target = $(target);

            var array = [];
            if (typeof styles == 'object') {
                array = styles;
            } else {
                array.push(styles);
            }

            $.each(array, function (k, v) {
                target.css(v, source.css(v));
            });

        }

        // see http://docs.jquery.com/Plugins/Authoring#Maintaining_Chainability
        return this.each(function () {

            //var resultsDiv = $('#results');
            //if (resultsDiv.length = 0) {
            //	resultsDiv = $('<div id="results" style="display: none;" ></div>');
            //	$(body).append(resultsDiv);
            //}
            var element = $(this);

            var isOpen = false;

            element.data('inline-autocomplete-options', settings);

            element.on('keydown', function (e) {
                if (isOpen) {
                    if (e.keyCode == 37 || e.keyCode == 39) {
                        element.autocomplete('search');
                    }
                } else {
                    if (e.keyCode == 32 && e.ctrlKey) {
                        settings.manualSearch = true;
                        element.autocomplete('option', { minLength: 0 }).autocomplete('search', '').autocomplete('option', { minLength: 1 });                        
                        return false;
                    }
                }
            })

            element.autocomplete({
                appendTo: "#cursorBox",
                //minLength: 1,
                // req = request, res = response
                // see Overview/callback at http://jqueryui.com/demos/autocomplete/ 
                source: function (req, res) { //manipulate the source 
                    //var re = $.ui.autocomplete.escapeRegex(req.term.substring(1) /* when searching, skip the $ sign */);
                    re = $.ui.autocomplete.escapeRegex(req.term);
                    var matcher = new RegExp(re, "i");
                    var results = $.grep(settings.words, function (item, index) {
                        return matcher.test(item);
                    });

                    //return a sorted list
                    results.sort();

                    //return the manipulated source
                    res(results);
                }
			   , search: function (event, ui) {
			       //check if this method called the search
			       if (settings.manualSearch) {
			           //let autocomplete handle it and clear the flag
			           settings.manualSearch = false;
			           return true;
			       }

			       var val = $(this).val();

			       //var pos = $(this).getCaretPosition();
			       var pos = $(this).caret().start;
			       var segment1 = val.substring(0, pos); //the part before the caret								       

			       var q = '';
			       if (settings.regex.test(segment1)) {

			           //change the searched query to the last $xxx part instead of everythin entered so far
			           var matches = settings.regex.exec(segment1);
			           if (matches != null) {

			               if (matches.length > 0) {
			                   q = matches[matches.length - 1];

			                   //set flag to indicate that the search was called from here
			                   settings.manualSearch = true;
			                   
			                   //call search with the manipulated query
			                   $(this).autocomplete('search', q);
			               }

			           }

			       } else {
			           $(this).autocomplete('close');
			       }
			       return false;
			   }
				, select: function (event, ui) {
				    var val = $(this).val();

				    var pos = $(this).caret().start;
				    // adjust pos to be at the end of the current word
				    pos += val.substring(pos || 0).search(/\W|$/);

				    // if the character to the left of the caret is a space when 'select' occurs
				    // the do not move the position

				    if (pos > val.length) {
				        pos = val.length ;
				    }

				    var segment1 = val.substring(0, pos); //the segment before the caret
				    var segment2 = val.substring(pos); //the segment after the caret                   				   
				    
                    //replace the searched string with the selected match				    
				    var matches = settings.regex.exec(segment1);
				    
				    if (matches != null) {
				        q = matches[matches.length - 1];				        

				        var newSegment1 = segment1.substring(0, pos - q.length ) + ui.item.value;
				        var newValue = newSegment1 + segment2;
				        $(this).val(newValue); //add the segment after the caret

				        //set the caret position to follow the replace
				        $(this).caret({ start: newSegment1.length, end: newSegment1.length });
				    } else {
				        //console.log('match failed');
				    }

				    return false; //skip default behaviour
				}
				, focus: function () {
				    return false; //skip default behaviour
				}
				, open: function (e) {
				    isOpen = true;
				    var position = $("#cursorBox").offset(),
					left = position.left, top = position.top;

				    var elm = $("#cursorBox > ul");
				    elm.offset(position);
				    elm.css('width', 'auto');
				    //elm.css('font', $(this).css('font'));
				    copyStyle(['font-family', 'font-size'], this, elm);

				    return false;
				}
                , close: function (e) {
                    isOpen = false;
                }

            });

        });


    };

    // end function definitions

    var methods = {
        'init': init,
        'option': function (options) {
            var settings = this.data('inline-autocomplete-options');
            $.extend(settings, options);
            this.data('inline-autocomplete-options', settings);
        }
    };

})(jQuery);
