/*jshint browser: true, esversion: 6*/
/* global $, console */

$(document).ready(function () {
	//Set cache to false for new quotes
	$.ajaxSetup({
		cache: false
	});
	//Upon site loading, fetch and display a quote
	fetchQuote();
});

function fetchQuote() {
	//Animated exit
	$('#quoteBtn').css('disabled', true);
	$('#quoteBtn').text('Getting quote...');
	$('#twtAuth').addClass('fadeOutUp');
	$('#theQuote').fadeTo(50, 0.005);
	$('.bigBox').css('background', '#fef7a6');

	//JSON/AJAX call
	var p = $.getJSON('https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&_jsonp=?')
		.done((data) => {
			checkQuote(data[0]); //Check for valid quote
		})
		.fail((err) => {
			console.error('Error retrieving data. Trying again.');
			fetchQuote();
		});
}

function checkQuote(data) {
	//Remove <p> tags and trim quote
	let quote = data.content.slice(3, this.length - 5).trim();
	//Store author data
	let author = data.title;
	//If quote/author is invalid or profane, fetch new quote
	if (quote.match(/[\[#<&;]|(shit|drunk|fart)/gi) ||
		author.match(/[#<&;\(]/g) ||
		(quote + author).length > 135)
		fetchQuote();
	else setTimeout(() => {
		displayQuote(quote, author);
	}, 200);
}

function displayQuote(quote, author) {
	//Display the quote and author
	$('#theQuote').text(quote);
	$('#theAuthor').html(`<i class="fa fa-ellipsis-v" style="padding-right: 2%;"></i>${author}`);
	//Update Tweet link
	$('#tweetLink').attr('href', `http://twitter.com/home?status="${quote}"%20-%20${author}`);
	//Animated entrance  
	$('.bigBox').css('background', '#c8f7d0');
	$('#theQuote').fadeTo(200, 1);
	$('#twtAuth').removeClass('fadeOutUp');
	setTimeout(() => $('#twtAuth').addClass('fadeInDown'), 200);
	$('#quoteBtn').css('disabled', false);
	$('#quoteBtn').text('Get another quote');
}

//When button is clicked, fetch a new quote
$('#quoteBtn').click(() => {
	fetchQuote();
});
