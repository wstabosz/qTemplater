
// Self contained jQueryUI alternative to
// the browser's default JavaScript alert method.
// The only prerequisite is to include jQuery & jQueryUI
// This method automatically creates/destroys the container div
// params:
//     message = message to display
//     title = the title to display on the alert
//     buttonText = the text to display on the button which closes the alert
//     okCallback = a function to call after the ok button is clicked, allows
//                  you to essentially pause code execution until user response
function alert2(options) {

    // overload to allow 
    if (!$.isPlainObject(options)) {
        options = {
            message: arguments[0],
            title: arguments[1],
            buttonText: arguments[2]
        }
    }

    options = $.extend(
        { message: 'Hello',
            buttonText: 'Ok',
            title: 'The page says:',
            okCallback: $.noop
        }
        , options);

    var div = $('<div>');
    div.html(options.message);
    div.attr('title', options.title);
    div.dialog({
        autoOpen: true,
        width: 'auto',
        modal: true,
        draggable: false,
        resizable: false,
        buttons: [{
            text: options.buttonText,
            click: function () {
                $(this).dialog("close");
                div.remove();
                options.okCallback();
            }
        }]
    });
}

// Self contained jQueryUI input prompt popup
// The only prerequisite is to include jQuery & jQueryUI
// This method automatically creates/destroys the container div
// params (passed as a hash):
//     output = reference to a hash to which the input value will be written (as output.value)
//     message = message to display
//     title = the title to display on the alert
//     okButtonText = the text to display on ok button
//     cancelButtonText = the text to display on the cancel button
//     inputStyle = the CSS styles for the input box
//     okCallback = the callback method to execute when the ok button is pushed
//     cancelCallback = the callback method to execute when the cancel button is pushed
function inputPrompt(options) {

    options = $.extend(
     {
         output: {},
         message: 'Enter a value',
         okButtonText: 'Ok',
         cancelButtonText: 'Cancel',
         title: 'The page says:',
         inputStyle: 'width: 96%',
         showInput: true,
         valueRequired: false,
         width: 300,
         height: 240,
         okCallback: $.noop,
         cancelCallback: $.noop
     }, options);

    var div = $('<div>');

    var input = $('<textarea style="' + options.inputStyle + '"></textarea>');

    var cleanUp = function () {
        div.dialog("close");
        input.remove();
        div.remove();
    }

    if (options.showInput) {
        div.html(options.message + '<br/>');
        div.append(input);
    } else {
        div.html(options.message);
    }

    div.attr('title', options.title);

    div.dialog({
        autoOpen: true,
        width: options.width,
        height: options.height,
        modal: true,
        draggable: false,
        resizable: false,
        buttons: [{
            text: options.okButtonText,
            click: function () {
                var value = input.val();
                if (!(options.valueRequired & (value == ''))) {
                    options.output.value = value
                    cleanUp();
                    options.okCallback();
                } else {
                    //alert2('Value is required', 'Error', 'Ok');
                }
            }
        }, {
            text: options.cancelButtonText,
            click: function () {
                options.output.value = '';
                cleanUp();
                options.cancelCallback();
            }
        }],
        open: function () {
            // focus on the cancel button by default
            $(this).parents('.ui-dialog-buttonpane button:eq(1)').focus();
        }
    });
}

// display a yes/no prompt
function yesNoPrompt(options) {

    options = $.extend(
        { output: {},
            message: 'Are you a human ?',
            okButtonText: 'Yes',
            cancelButtonText: 'No',
            title: 'Question:',
            inputStyle: 'width: 96%',
            showInput: false,
            okCallback: function () {
                options.output.value = true;
            },
            cancelCallback: function () {
                options.output.value = false;
            }
        }, options);

    inputPrompt(options);

}
