/*
Universidad: Instituto Tecnologico de Costa Rica

Authors:
        Diego Ugalde Avila
        Luis E. Ugalde Barrantes

Various functions used in the main page (index).
Includes: JSON processing, file reading & JSON converter
*/

$(document).ready(function() {

    $('#tabs').tab();

    $("#json-input").change(function() {
        $(".json-alert2").hide(); 
        $('#input-file-button').css('display','block');
    });

    /*When the submit button is clicked to send the Text JSON input*/
    $('#input-text-button').click(function() {
        var jsonInput = $("#text-json").val();
        procesarJSON(jsonInput);
    });

    /*When the upload button is clicked*/
    $('#input-file-button').click(function() {
        var file = $("#json-input")[0].files[0];
        readFile(file, procesarJSON);
    });

    // Function that's in charge of displaying the graph made out of the JSON file
    function procesarJSON(jsonInput) {
        if (jsonInput != '' && validJSON(jsonInput)) {
            $(".graph-container").css("display", "block");
            $(".input-container").css("display", "none");
            var jsonObject = JSON.parse(jsonInput);
            var parsedJSON = convertJSON(jsonObject);
            displayGraph(parsedJSON);
        }else{
            $(".json-alert1").show();
        }
    };

    // Function used to read the file sent by the user
    function readFile(file, callback) {
        if(file.name.split('.').pop() != 'json') {
            $(".json-alert2").show();   
            return;
        }

        var reader = new FileReader();
        var deferred = $.Deferred();

        reader.onloadend = function(event) {
            var jsonText = event.target.result;
            callback(jsonText);
        };

        reader.readAsText(file);
    }

    function checkJSON(jsonString) {
        if(validJSON(jsonString)) {
            jsonObject = JSON.parse(jsonString);
        }else{
            $(".json-alert2").show();
        }
    }

    // Function in charge of validating JSON file.
    function validJSON(jsonInput) {
        return (/^[\],:{}\s]*$/.test(jsonInput.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '')));
    }

    /*Alerts close button behavior*/

    $("#close1").click(function() {
        $(".json-alert1").hide(); 
    });

    $("#close2").click(function() {
        $(".json-alert2").hide(); 
    });

    // Function used to convert the JSON file to the format needed for the graph
    function convertJSON(jsonObject) {
        var graphLength = Object.keys(jsonObject).length;
        var newGraph = {};
        var nodesIndex = [];
        var newNodes = [];
        var newLinks = [];

        newGraph["directed"] = "true";
        newGraph["multigraph"] = "false";
        newGraph["graph"] = [];
        
        for(var node in jsonObject) {
            nodesIndex.push(node);  
        }

        for(var property in jsonObject) {
            var currNode = jsonObject[property];
            var newNode = {};
            newNode["id"] = currNode["name"];
            newNode["description"] = currNode["description"];
            newNode["link"] = currNode["link"];
            newNodes.push(newNode);

            var currNodeLinks = currNode["connectsTo"];
            for(var i = 0; i < currNodeLinks.length; i++) {
                currLink = currNodeLinks[i];
                var link = {};
                var source = nodesIndex.indexOf(property);
                var target = nodesIndex.indexOf(currLink);
                link["source"] = source;
                link["target"] = target;
                newLinks.push(link);
            }
        }
        newGraph["links"] = newLinks;
        newGraph["nodes"] = newNodes;
        return newGraph;
    }

    function getNodeNumber(nodeName) {
        return parseInt(nodeName.substr(4));
    }
    
    $('.close-button').click(function() {
        $('.node-info').css('display','none');
    });

});



