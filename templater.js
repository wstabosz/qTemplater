    
var gridData = {};
var positioner;

var templates = { example: {}, user: {} };

$(initPage); 

function moveCursorBox() {
	var pos = positioner.getPixelCoordinates();	
	var pos2 = $('#templateInput').offset();
	var left = pos[0] + pos2.left + 'px';
	var top = pos[1] + pos2.top + 'px';
	$('#cursorBox').css('left', left).css('top', top);
}


if (window['console'] === undefined ) {
	window['console'] = {
		log: $.noop
	}
}

function initPage() {

	initLayout();	
	getUserTemplates();

	positioner = new maxkir.CursorPosition($('#templateInput')[0], 3);

	$('#templateInput')
		.on('blur', renderTemplate)
		.on('keyup', moveCursorBox)
		.inlineAutoComplete();
		
	$('#tabs').tabs();
	$('button').button();
	
    $('#htmlResult').on('click', toggleHtmlResult);
	$('#saveButton').on('click', saveUserTemplate);
	$('#deleteButton').on('click', deleteUserTemplate);
	$('#templateList').on('dblclick', templateList_dblclick);
	$('#importButton').on('click', showImportDialog);
	$('#exportButton').on('click', exportTemplate);
	$('#exportAllButton').on('click', exportAllTemplates);		
	$('.closeButton').on('click', closeInfoPanel);

	$("#inputGrid").handsontable({
		rows: 5,
		cols: 5,
		minSpareCols: 1, //always keep at least 1 spare row at the right
		minSpareRows: 1, //always keep at least 1 spare row at the bottom
		onChange: gridChanged,
		legend: [
				{
				match: function (row, col, data) {
					return (row === 0); //if it is first row
				},
				style: {
					color: 'green', //make the text green and bold
					fontWeight: 'bold'
				},
				title: 'Heading' //make some tooltip				
				}]
	});
	  
//	$('.section').hover(
//		function(e) {
//			$(this).find('.sectionLabel').stop(true,true).fadeOut(1000);
//		},
//		function(e) {
//			$(this).find('.sectionLabel').stop(true,true).fadeIn(1000);
//		}
//	);


    $('#loadingBox').css('display', 'none');

    getUserTemplates();
    populateTemplateList();
    loadTemplate(templates.example['SQL Insert']);

}

function initLayout() {

    var availWidth = $('#centerBar').innerWidth();

    $('body').layout({
        applyDefaultStyles: true,
        east__size: Math.floor(availWidth * .50),
        livePaneResizing: true,
        closable: false
    });

    var availHeight = $('#centerBar').innerHeight();

    $('#centerBar').layout({
        applyDefaultStyles: true,
        south__size: Math.floor(availHeight * .50),
        livePaneResizing: true,
        closable: false
    });

    $('#rightBar').layout({
        applyDefaultStyles: true,
        south__size: Math.floor(availHeight * .50),
        livePaneResizing: true,
        closable: false
    });

}

function closeInfoPanel() {

    var infoPanel = $(this).parents('.infoPanel');
    var sectionLabel = infoPanel.siblings('.sectionLabel')

    infoPanel.hide();
    sectionLabel.show();
    sectionLabel.css('cursor', 'help');

    sectionLabel.one('click', function () {
        infoPanel.show();
        sectionLabel.hide();
    });

}

function templateList_dblclick(e) {

    var o = $('#templateList option:selected');
    var templateType = o.data('type');
    var templateName = o.val();

    var template = templates[templateType][templateName];

    loadTemplate(template);
}

function loadTemplate(template) {
      
    $('#inputGrid').handsontable('clear');
    $('#templateName').val(template.name);
    $('#templateInput').val(template.source);
    $("#inputGrid").handsontable("loadData", template.data);

}

// http://stackoverflow.com/questions/3391864/custom-alert-using-javascript/7506830#7506830
// Generic self-contained jQueryUI alternative to
// the browser's default JavaScript alert method.
// The only prerequisite is to include jQuery & jQueryUI
// This method automatically creates/destroys the container div
// params:
//     message = message to display
//     title = the title to display on the alert
//     buttonText = the text to display on the button which closes the alert
function alert2(message, title, buttonText) {

    buttonText = (buttonText == undefined) ? "Ok" : buttonText;
    title = (title == undefined) ? "The page says:" : title;

    var div = $('<div>');
    div.html(message);
    div.attr('title', title);
    div.dialog({
        autoOpen: true,
        modal: true,
        draggable: false,
        resizable: false,
        buttons: [{
            text: buttonText,
            click: function () {
                $(this).dialog("close");
                div.remove();
            }
        }]
    });
}

function exportTemplate() {

    var o = $('#templateList option:selected');

    if (o.length == 0) {
        alert2('Please select a template to export.', 'Opps!', 'Ok');
        return;
    }

    var templateType = o.data('type');
    var templateName = o.val();

    var template = {};
    template[templateName] = templates[templateType][templateName];

    var text = JSON.stringify(template);

    showExportDialog(text);
    
}

function exportAllTemplates() {

    if ($.isEmptyObject(templates.user)) {
        alert2('There are no <b>Saved Templates</b> to export.', 'Nothing to Export', 'Ok');
        return;
    }

    var text = JSON.stringify(templates.user);
    showExportDialog(text);

}

function showExportDialog(text) {

    $('#importExportText').val(text);
    $('#importExportDialog').dialog({
        autoOpen: true,
        height: 400,
        width: 600,
        modal: true,
        title: 'Export',
        resizeable: false,
        draggable: false

    });

}

function showImportDialog() {

    function importTemplate() {

        var text = $('#importExportText').val();

        try {
            var newTemplate = JSON.parse(text);
            $.each(newTemplate, function (k, v) {
                var templateName = v.name;
                templates.user[templateName] = v;
            });
            localStorage.setItem('templates', JSON.stringify(templates.user));
            populateTemplateList();
        } catch (e) {
    
        }
        
    }

    $('#importExportText').val('');
    
    $('#importExportDialog').dialog({
        autoOpen: true,
        height: 400,
        width: 600,
        modal: true,
        title: 'Import',
        resizeable: false,
        draggable: false,
        buttons: [
            { text: 'Ok',
              click: function () { importTemplate(); $(this).dialog("close"); } }
            ,{ text: 'Cancel',
                click: function () { $(this).dialog("close"); } 
            }]
    });

}

function deleteUserTemplate() {
    
    var o = $('#templateList option:selected');
    var templateType = o.data('type');
    var templateName = o.val();

    function deleteUserTemplate2() {
        delete templates[templateType][templateName];
        localStorage.setItem('templates', JSON.stringify(templates.user));
        populateTemplateList();
    }

    if (templateType == 'user') {
        yesNoPrompt(
        { message: 'Are you sure you want to delete the template named "' + templateName + '" ?'
         ,title: 'Confirm Delete'
        , okCallback: deleteUserTemplate2
        });    
    }

}

function saveUserTemplate() {

    function saveUserTemplate2() {

        templates.user[templateName] = newTemplate;
        localStorage.setItem('templates', JSON.stringify(templates.user));

        populateTemplateList();

    }

    var templateName = $('#templateName').val();
    var templateSource = $('#templateInput').val();
    var templateData = $('#inputGrid').handsontable('getData');

    var newTemplate = {
        name: templateName,
        source: templateSource,
        data: templateData
    };

    if (templateName in templates.user) {
        // overwrite?
        yesNoPrompt(
            { message: 'Do you wish to overwrite the existing the template named "' + templateName + '" ?'
            , title: 'Confirm Overwrite'
            , okCallback: saveUserTemplate2
            });
    } else {
        saveUserTemplate2();
    }

}

function getUserTemplates() {

    var data = localStorage.getItem('templates');
    if (data != null) {        
        try {
            templates.user = JSON.parse(data);
        } catch (e) {
    
        }        
    }    

}

function populateTemplateList() {

    var list = $('#templateList')
    list.children().remove();

    var html = '';

    // add the example templates to the list
    html += '<optgroup label="Example Templates">';
    $.each(templates.example, function (i) {
        html += '<option data-type="example">' + this.name + '</option>';
    });
    html += '</optgroup>';        

    // add the user templates to the list
    html += '<optgroup label="Saved Templates">';
    $.each(templates.user, function(i) {
        html += '<option data-type="user">' + this.name + '</option>';
    });
    html += '</optgroup>';

    list.append(html);

}

function renderTemplate() {
	
	var templateText = $('#templateInput').val(); 
	//templateText =  templateText.replace(/\n/g,'{~n}');
	
	try {
	
		var compiled = dust.compile(templateText, 'walter');		
		dust.loadSource(compiled);
		dust.render('walter', gridData, function (err, out) {
		    $('#renderedOutput')
				.text(out)
				.css('background-color', '');
		    $('#htmlOutput').html(out);
		});
	} catch(e) {
		e += "\n\nPlease check your template syntax.";
		$('#renderedOutput')
			.text(e)
			.css('background-color','#fcc');
	}
	
}

function gridChanged() {   

   	var data = $('#inputGrid').handsontable('getData');
	gridData = parseGridArray(data);

	// rebuild the list of tags for auto-complete
	var templateTags = ['{#rows}','{/rows}', '{~n}'];
	$.each(gridData.tags, function() {		
		templateTags.push('{' + this + '}');
	});    

	$('#templateInput').inlineAutoComplete('option', {words: templateTags} );
	
	renderTemplate();
}

function toggleHtmlResult() {

    $('#renderedOutput').toggle();
    $('#htmlOutput').toggle();
}

function parseGridArray(gridArray) {

	var columnNames = gridArray[0];
	var columnIDs = [];
	var result = {};
	result.rows = [];	

	// TODO: replace whitespace with underscore
	// skip the last element of the columnNames array
	for (var i = 0; i <= columnNames.length - 1; i++) {
	    var columnID = columnNames[i];		
		if (columnID != '') {
			columnIDs.push(columnID);
		}
	}

	result.tags = columnIDs;
	
	// skip the first element of gridArray
	for(var i=1;i<=gridArray.length-2;i++) {
		var cells = gridArray[i];
		var hash = {};
		for(var j=0;j<=cells.length-2;j++) {
			var key = columnIDs[j];
			hash[key] = gridArray[i][j];					
		}
		result.rows.push(hash);
		//console.log(gridArray[i]);
	}
	
	return result;
	
}

