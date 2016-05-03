/*
 Licensed to the Apache Software Foundation (ASF) under one or more
 contributor license agreements.  See the NOTICE file distributed with
 this work for additional information regarding copyright ownership.
 The ASF licenses this file to You under the Apache License, Version 2.0
 (the "License"); you may not use this file except in compliance with
 the License.  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

solrAdminApp.controller('QueryController',
  function($scope, $routeParams, $location, Query, Constants){
    $scope.resetMenu("query", Constants.IS_COLLECTION_PAGE);

    $scope.query = {};
    $scope.filters = [];
    $scope.dismax = {defType: "dismax"};
    $scope.edismax = {defType: "edismax", stopwords: true, lowercaseOperators: true};
    $scope.hl = {hl:"on"};
    $scope.facet = {facet: "on"};
    $scope.spatial = {};
    $scope.spellcheck = {spellcheck:"on"};


		/**
		 * function parseSolrUrl()
		 * parses query from solrUrl parameter
		 * and displays the results
		 */
    $scope.parseSolrUrl = function(url) {

			var urlEnd = url.substring(url.indexOf("?")+1);
			// urlBegin /solr/core/query_handler
			var urlBegin = url.substring(0,url.indexOf("?"));
			var solrCoreAndHandler = urlBegin.split("/");

			/* urlJson is needed to get url params to fill the form with solrUrl data
			 */
			var urlJson = JSON.parse('{"' +  urlEnd.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
			var params = {};

			params["core"]=solrCoreAndHandler[2];
			params["handler"]="/" + solrCoreAndHandler[3];

      var set = function(key, value) {
        if (params[key]) {
          params[key].push(value);
        } else {
          params[key] = [value];
        }
      }
      var copy = function(params, query) {
        for (var key in query) {
          terms = query[key];
          if (terms.length > 0 && key[0]!="$") {
            set(key, terms);
          }
        }
      };

      copy(params, urlJson);



			/*load params to $scope 
			*/

			if (params.df)
		 		{ $scope.query.df = params.df};
			if (params.q)
		 		{ $scope.query.q = params.q };
				/*
				 * it will not work like this
			if (params.isDismax)
		 		{ $scope.isDismax = params.isDismax };
			if (params.isEdismax)
		 		{ $scope.isEdismax = params.isEdismax };
			if (params.isHighlight)
		 		{ $scope.isHighlight = params.isHighlight };
			if (params.isFacet)
		 		{ $scope.isFacet = params.isFacet };
			if (params.isSpatial)
		 		{ $scope.isSpatial = params.isSpatial };
			if (params.isSpellcheck)
		 		{ $scope.isSpellcheck = params.isSpellcheck };
			if (params.rawParams)
		 		{ $scope.query.rawParams = params.rawParams};
					*/
			if (params.wt)
		 		{ $scope.query.wt = params.wt };
			if (params.handler)
		 		{ $scope.qt = params.handler };
			if (params.df)
		 		{ $scope.query.df = params.df};
			if (params.fl)
		 		{ $scope.query.fl = params.fl};
			if (params.rows)
		 		{ $scope.query.rows = params.rows};
			if (params.sort)
		 		{ $scope.query.sort = params.sort};
			if (params.start)
		 		{ $scope.query.start = params.start};
			// TODO only one fq parsed by JSON.parse, others not copied
			if (params.fq)
		 		{ $scope.filters.push({fq: params.fq[0]})};
			if (params.indent)
		 		{ $scope.query.indent=params.indent[0]};
			if (params.debugQuery)
		 		{ $scope.query.debugQuery=params.debugQuery[0]};





      params.core = $routeParams.core;
      var solrUrl = Query.url(params);
      Query.query(params, function(data) {
        $scope.lang = $scope.query.wt;
        $scope.response = data;
        $scope.url = $location.protocol() + "://" +
                     $location.host() + ":" +
                     $location.port() + solrUrl;
      });
    };



		/* handle solrUrl request from url path */
    if ($location.search().solrUrl) {
			var url =  decodeURIComponent($location.search()["solrUrl"]);
			$scope.parseSolrUrl(url);
    }


    // @todo read URL parameters into scope
		/*
    $scope.query = {wt: 'json', q:'*:*', indent:'on'};
    $scope.filters = [{fq:""}];
    $scope.dismax = {defType: "dismax"};
    $scope.edismax = {defType: "edismax", stopwords: true, lowercaseOperators: true};
    $scope.hl = {hl:"on"};
    $scope.facet = {facet: "on"};
    $scope.spatial = {};
    $scope.spellcheck = {spellcheck:"on"};
    $scope.qt = "/select";
		*/

		if($scope.query == null)
	 		{ $scope.query = {wt: 'json', q:'*:*', indent:'on'}};
		if($scope.filters.length == 0)
	 		{ $scope.filters = [{fq:""}]};
		if($scope.dismax == null)
	 		{ $scope.dismax = {defType: "dismax"}};
		if($scope.edismax == null)
	 		{ $scope.edismax = {defType: "edismax", stopwords: true, lowercaseOperators: true}};
			/*
		if($scope.hl == null)
	 		{ $scope.hl = {hl:"on"}};
		if($scope.facet == null)
	 		{ $scope.facet = {facet: "on"}};
		if($scope.spatial == null)
	 		{ $scope.spatial = {}};
		if($scope.spellcheck == null)
	 		{ $scope.spellcheck = {spellcheck:"on"}};
		*/
		if($scope.qt == null)
	 		{ $scope.qt = "/select"};



		/**
		 * function doQuery()
		 */
    $scope.doQuery = function() {
      var params = {};

      var set = function(key, value) {
        if (params[key]) {
          params[key].push(value);
        } else {
          params[key] = [value];
        }
      }
      var copy = function(params, query) {
        for (var key in query) {
          terms = query[key];
          if (terms.length > 0 && key[0]!="$") {
            set(key, terms);
          }
        }
      };

      copy(params, $scope.query);

      if ($scope.isDismax)     copy(params, $scope.dismax);
      if ($scope.isEdismax)    copy(params, $scope.edismax);
      if ($scope.isHighlight)  copy(params, $scope.hl);
      if ($scope.isFacet)      copy(params, $scope.facet);
      if ($scope.isSpatial)    copy(params, $scope.spatial);
      if ($scope.isSpellcheck) copy(params, $scope.spellcheck);

      if ($scope.rawParams) {
        var rawParams = $scope.rawParams.split(/[&\n]/);
        for (var i in rawParams) {
            var param = rawParams[i];
            var parts = param.split("=");
            set(parts[0], parts[1]);
        }
      }


      for (var filter in $scope.filters) {
        copy(params, $scope.filters[filter]);
      }

			/*
      var qt = $scope.qt ? $scope.qt : "select";
			params.core = $routeParams.core;
      params.handler = qt;
			*/
      var url = Query.url(params);
      Query.query(params, function(data) {
        $scope.lang = $scope.query.wt;
        $scope.response = data;
        $scope.url = $location.protocol() + "://" +
                     $location.host() + ":" +
                     $location.port() + url;
      });
    };

    if ($location.search().q) {
      $scope.query.q = $location.search()["q"];
      $scope.doQuery();
    }



		/**
		 * function submitQuery
		 * used in <button type="submit" ng-click="submitQuery()">Execute Query whoaa</button>
		 */
    $scope.submitQuery = function() {
      var params = {};

      var set = function(key, value) {
        if (params[key]) {
          params[key].push(value);
        } else {
          params[key] = [value];
        }
      }
      var copy = function(params, query) {
        for (var key in query) {
          terms = query[key];
          if (terms.length > 0 && key[0]!="$") {
            set(key, terms);
          }
        }
      };

      copy(params, $scope.query);

      if ($scope.isDismax)     copy(params, $scope.dismax);
      if ($scope.isEdismax)    copy(params, $scope.edismax);
      if ($scope.isHighlight)  copy(params, $scope.hl);
      if ($scope.isFacet)      copy(params, $scope.facet);
      if ($scope.isSpatial)    copy(params, $scope.spatial);
      if ($scope.isSpellcheck) copy(params, $scope.spellcheck);

      if ($scope.rawParams) {
        var rawParams = $scope.rawParams.split(/[&\n]/);
        for (var i in rawParams) {
            var param = rawParams[i];
            var parts = param.split("=");
            set(parts[0], parts[1]);
        }
      }

      var qt = $scope.qt ? $scope.qt : "select";

      for (var filter in $scope.filters) {
        copy(params, $scope.filters[filter]);
      }

      params.core = $routeParams.core;
      params.handler = qt;
      var url = Query.url(params);
			var locAbsUrl = $location.url();
			var searchObject = $location.search();
			var encodedUrl =  encodeURIComponent(url);
			$location.search('solrUrl', encodedUrl);
		};




		/**
		 * function removeFilter()
		 */
    $scope.removeFilter = function(index) {
      if ($scope.filters.length === 1) {
        $scope.filters = [{fq: ""}];
      } else {
        $scope.filters.splice(index, 1);
      }
    };

    $scope.addFilter = function(index) {
      $scope.filters.splice(index+1, 0, {fq:""});
    };
  }
);
