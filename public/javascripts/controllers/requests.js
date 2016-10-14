app.controller('requests', ['$scope', '$http', function($scope, $http) {

    $scope.urls = ""; // es: '"https://www.google.it/", "https://www.google.it/"'
    $scope.paths = ""; // es: '{"title": "//title", "h1": "//h1"}';

    $scope.results = [];

    $scope.testData = function() {
        $scope.results = [];
        console.log("Message to $scope.testData");
        if(typeof $scope.urls == "undefined") { console.log("urls undefined"); return; }
        if(typeof $scope.paths == "undefined") { console.log("xpaths undefined"); return; }

        // from string of urls to array of urls
        try {
            var urls = JSON.parse("[" + $scope.urls + "]");
            console.log("Urls are: ");
            console.log(urls);
            // from json string to json object and corresponding keys
            console.log("Paths are: " + $scope.paths);
            var paths = JSON.parse($scope.paths);
            console.log(paths);
            var keys = Object.keys(paths);
            console.log(keys);
        }
        catch(e) {
            $scope.outcomes.push("danger");
            $scope.results.push("error in JSON.parse: wrong input. Please check the placeholder. ");
            console.log(e);
            return;
        }
        // for each url
        for (var i in urls) {
            if(urls[i] == null) continue;
            // for each json attribute
            for( var j = 0,length = keys.length; j < length; j++ ) {
                if(paths[keys[j]] == null) continue;
                urls[i] = urls[i].trim().replace(/(\r\n|\n|\r)/gm, "");
                paths[keys[j]] = paths[keys[j]].trim().replace(/(\r\n|\n|\r)/gm, "");
                console.log("Fetching url: " + urls[i] + " - for xpath: " + paths[keys[j]]);
                $http.post('/rest/', {url: urls[i], path: paths[keys[j]], key: keys[j]}).success(function (response) {
                    console.log("Request sent...");
                    if (response.err) {
                        console.log("There was an error in the request");
                        $scope.results.push({outcome: "danger", message: "error in request", url: "#"});
                    }
                    else {
                        console.log("I got the data I requested");
                        if (response.length < 1) {
                            console.log("But it was empty");
                            $scope.results.push({outcome: "warning", message: "empty data", url: "#"});
                            return;
                        }
                        console.log(response);
                        $scope.results.push({outcome: response.outcome, message: response.result, url: response.url});
                    }
                });
            }
        }
    };

    $scope.sortBy = function(what) {
        $scope.results.sort(function(a, b){
            if(a[what] < b[what]) return -1;
            if(a[what] > b[what]) return 1;
            return 0;
        });
    }

}]);