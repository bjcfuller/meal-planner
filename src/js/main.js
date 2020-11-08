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

			if ( '' !== entry.time ) {
				M.data[entry.time].push( entry );
			}

    }

		init();

  }

	function getUniqueItem( t ) {

		let item,
				loop = true,
				n = 0;

		const l = M.data[t].length;

		while ( loop && n < l ) {

			loop = false;
			n++;
			item = M.data[t][Math.floor( Math.random() * l )];

			for ( let i = 0; i < M.unique.length; i++ ) {
				if ( item.name == M.unique[i].name ) {
					loop = true;
					break;
				}
			}

		}

		return item;

	}

	function getUniqueItems( count ) {

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

		M.unique = getUniqueItems( 14 );

		const ul = document.createElement( 'ul' );
		ul.className = 'meal-list';

		for ( let i = 0 ; i < M.unique.length; i++ ) {
			ul.appendChild( buildItem( M.unique[i] ) );
		}

		M.dom.output.appendChild( ul );

	}

	function toggleRefreshMenu( item ) {

		item.classList.toggle( 'refresh-open' );

	}

	function refreshItem( li, item, refreshData ) {

		const newitem = getUniqueItem( refreshData.time )
		M.unique.push( newitem );

		console.log( 'returned', newitem.name );

	}

	function buildItem( item ) {

		const li = document.createElement( 'li' );
		li.classList = 'meal-item';

		const descriptors = document.createElement( 'div' );
		descriptors.className = 'item-descriptors';
		li.appendChild( descriptors );

		const time = document.createElement( 'div' );
		time.className = 'item-time ' + item.time;
		switch ( item.time ) {
			case 'short':
				time.innerHTML = 'Under 30 minutes';
				break;
			case 'medium':
				time.innerHTML = '30 - 60 minutes';
				break;
			case 'long':
				time.innerHTML = 'Over 60 minutes';
				break;
			default:
				time.innerHTML = 'Time not available';
				break;
		}
		descriptors.appendChild( time );

		const name = document.createElement( 'h2' );
		name.className = 'item-name';
		name.innerHTML = item.name;
		descriptors.appendChild( name );

		const ingredients = document.createElement( 'div' );
		ingredients.className = 'item-ingredients';
		ingredients.innerHTML = item.ingredients;
		descriptors.appendChild( ingredients );

		const refresh = document.createElement( 'div' );
		refresh.className = 'item-refresh';
		refresh.innerHTML = '<span class="refresh-icon">R</span>';

		const refreshMenu = document.createElement( 'ul' );
		refreshMenu.className = 'refresh-menu';

		const listItems = [
			{ text: 'Any time', class: 'refresh-any-time', time: 'all' },
			{ text: 'Under 30 minutes', class: 'refresh-30', time: 'short' },
			{ text: '30 - 60 minutes', class: 'refresh-30-60', time: 'medium' },
			{ text: 'Over 60 minutes', class: 'refresh-60', time: 'long' }
		];

		for ( let i = 0; i < listItems.length; i++ ) {
			const listItem = document.createElement( 'li' );
			listItem.className = listItems[i].class;
			listItem.innerHTML = listItems[i].text;
			listItem.addEventListener( 'click', refreshItem.bind( null, li, item, listItems[i] ), false );
			refreshMenu.appendChild( listItem );
		}

		refresh.appendChild( refreshMenu );
		refresh.addEventListener( 'click', toggleRefreshMenu.bind( null, li ), false );
		li.appendChild( refresh );

		return li;

	}

}() );
