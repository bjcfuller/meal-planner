/**
 * MAIN
 */

( function() {
	'use strict';

	const M = {
		gid: '1bYlIQJiL4r8B0kudD_kXqzo-fgKs6ZRl6RyZjL9eRnA',
		dom: {
			output: document.getElementById( 'output' )
		}
	};

	window.addEventListener( 'load', getData( parse ), false );

	function getData( success ) {
  	const req = new XMLHttpRequest();

	  //console.log( 'trying to retrieve data...' );

		req.onreadystatechange = function() {
			if ( req.readyState == XMLHttpRequest.DONE && req.status == 200 ) {
				success( req.responseText );
			} else if ( req.status !== 0 && req.status != 200 ) {
				//console.log( 'unable to retrieve data (Error ' + req.status + ')' );
			}
		};

		const url = "https://spreadsheets.google.com/feeds/list/" + M.gid + "/default/public/values?alt=json";

		req.open( 'GET', url, true );
		req.send();

  }

	/*
   * Parse JSON data into a more usable form
   * @param data obj the raw data
   */
  function parse( d ) {

    //console.log( 'data retrieved, attempting to parse...' );

    const data = JSON.parse( d );
    const entries = data.feed.entry;
		M.data = {
			all: [],
			short: [],
			medium: [],
			long: []
		};

		let entry = {};

    for( let i = 0; i < entries.length; i++ ) {

      entry = {};

      for ( const key in entries[i] ) {
        if ( key.includes( 'gsx$' ) ) {
          entry[key.replace( 'gsx$', '' )] = entries[i][key].$t;
        }
      }

      M.data.all.push( entry );

			// sort entries into time groups
			switch ( entry.time ) {
				case '<30':
					M.data.short.push( entry );
					break;
				case '30-60':
					M.data.medium.push( entry );
					break;
				case '>60':
					M.data.long.push( entry );
					break;
				default:
					break;
			}

    }

    console.log( 'M', M );
    //console.log( 'done parsing, continuing on to init' );

		init();

  }

	function getUnique( count ) {
	  // Make a copy of the array
	  const tmp = M.data.all.slice( M.data.all );
	  const ret = [];

	  for ( let i = 0; i < count; i++ ) {
	    const index = Math.floor( Math.random() * tmp.length );
	    const removed = tmp.splice( index, 1 );
	    // Since we are only removing one element
	    ret.push( removed[0] );
	  }
	  return ret;
	}

	function init() {

		const unique = getUnique(14);

		console.log( unique );

		const ul = document.createElement( 'ul' );

		for ( let i = 0 ; i < unique.length; i++ ) {
			ul.appendChild( buildItem( unique[i] ) );
		}

		M.dom.output.appendChild( ul );

	}

	function buildItem( item ) {

		const li = document.createElement( 'li' );

		const name = document.createElement( 'div' );
		name.className = 'item-name';
		name.innerHTML = item.name;
		li.appendChild( name );

		const ingredients = document.createElement( 'div' );
		ingredients.className = 'item-ingredients';
		ingredients.innerHTML = item.ingredients;
		li.appendChild( ingredients );

		const time = document.createElement( 'div' );
		time.className = 'item-time';
		time.innerHTML = item.time;
		li.appendChild( time );

		const refresh = document.createElement( 'div' );
		refresh.className = 'item-refresh';
		refresh.innerHTML = 'Refresh';
		li.appendChild( refresh );

		return li;

	}

}() );
