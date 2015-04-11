$(document).ready(function() {

    /*Global variables*/

    $('#tabs').tab();

    $("#json-input").change(function() {
        $(".json-alert2").hide(); 
        $('#input-file-button').css('display','block');
    });



    /*When the submit button is clicked to send the Text JSON input*/
    $('#input-text-button').click(function() {
        var jsonInput = $("#text-json").val();
        if (jsonInput != '' && validJSON(jsonInput)) {
            var jsonObject = JSON.parse(jsonInput);
            convertJSON(jsonObject);
        }else{
            $(".json-alert1").show();
        }
    });

    /*When the upload button is clicked*/
    $('#input-file-button').click(function() {
        var file = $("#json-input")[0].files[0];
        var jsonInput = readFile(file);
        console.log(jsonInput);
    });

    
    function readFile(file) {
        if(file.name.split('.').pop() != 'json') {
            $(".json-alert2").show();   
            return;
        }
        var reader = new FileReader();
        var deferred = $.Deferred();

        reader.onloadend = function(event) {
            deferred.resolve(event.target.result);
        };

        reader.onerror = function() {
            deferred.reject(this);
        };

        reader.readAsText(file);

        return deferred.promise();
    }


    function checkJSON(jsonString) {
        if(validJSON(jsonString)) {
            console.log("jola");
            jsonObject = JSON.parse(jsonString);
        }else{
            $(".json-alert2").show();
        }
    }

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
    
    function convertJSON(jsonObject) {
        var graphLength = Object.keys(jsonObject).length;
        var newGraph = {};
        var newNodes = [];
        var newLinks = [];
        
        newGraph["directed"] = "true";
        newGraph["multigraph"] = "false";
        newGraph["graph"] = [];
        
        for(var i = 1; i <= graphLength; i++) {
            var currNode = jsonObject["node"+i];
            var newNode = {};
            newNode["id"] = currNode["name"];
            newNode["description"] = currNode["description"];
            newNode["link"] = currNode["link"];
            newNodes.push(newNode);
            
            var currNodeLinks = currNode["connectsTo"];
            for(var j = 0; j < currNodeLinks.length; j++) {
                var link = {};
                var source = i-1;
                var target = getNodeNumber(currNodeLinks[j])-1;
                link["source"] = source;
                link["target"] = target;
                newLinks.push(link);
            }
        }
        newGraph["links"] = newLinks;
        newGraph["nodes"] = newNodes;
    }
    
    
    function getNodeNumber(nodeName) {
        return parseInt(nodeName.substr(4));
    }

});



