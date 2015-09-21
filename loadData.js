'use strict';

var _ = require('lodash');
var pg = require('pg');
var path = require('path');
var casual = require('casual');
var knex = require('knex')({
  client: 'pg',
  connection: {
	host     : '127.0.0.1',
	user     : 'postgres',
	database : 'ADD_YOUR_DBNAME'
  }
});

knex.schema.hasTable('perf_case').then(function(exists) {
  if (!exists) {
	return knex.schema.createTable('perf_case', function(t) {
	  t.increments('id').primary();
	  t.string('number', 100);
	  t.string('title', 100);
	  t.date('created');
	  t.date('lastModified');
	});
  }
});

knex.schema.hasTable('perf_childDoc').then(function(exists) {
  if (!exists) {
	return knex.schema.createTable('perf_childDoc', function(t) {
	  t.increments('id').primary();
	  t.integer('caseId');
	  t.json('document');
	  t.date('created');
	  t.date('lastModified');
	});
  }
});

var _date = new Date();

function insertChild( parentId, callback ) {
	var _childDoc = {
		'caseId': parentId,
		'created': _date.toISOString(),
		'lastModified': casual.date('YYYY-MM-DD'),
		'document': {
			'_date': casual.date('YYYY-MM-DD'),
			'_integer': casual.random,	
			'_string': casual.string
		}
	}

	knex.insert(_childDoc).into('perf_childDoc')
	.catch(function(err) {
		console.log(err)
	})
	.then( function() {
		callback(undefined, parentId)
	})		
}

function insertCase( _case ) {
	knex.insert(_case).into('perf_case')
	.then( function() {
		return knex.select('id').from('perf_case').where('number', _case.number);
	})
	.then(function(rows) {
		insertChild(rows[0].id, function(err, result) {
			console.log('loaded ' + result)
		})	
	})
	.catch(function(err) {
		console.log(err)
	})
} 



var i=0;
while (i < 10000) {
	var _case = {
		'number': i,
		'title': casual.title,
		'created': _date.toISOString(),
		'lastModified': casual.date('YYYY-MM-DD')
	}

	insertCase(_case)	
	i++
}

