/*jshint browser: true, esversion: 6*/
/* global $, console, profaneRegEx */

$(document).ready(function() {
	//Set cache to false for new quotes
	$.ajaxSetup({
		cache: false
	});
	//Upon site loading, fetch and display a quote
	fetchQuote(true);
});

function fetchQuote(first) {
	//Animated exit
	$('#quoteBtn').prop('disabled', true);
	$('#quoteBtn').html('Getting quote...&nbsp;<i class="fa fa-spinner fa-pulse fa-fw"></i>');
	$('#theQuote').fadeTo(50, 0.005);
	if (!first) $('#twtAuth').addClass('fadeOutUp');
	$('.bigBox').css('background', '#fef7a6');

	//JSON/AJAX call
	var p = $.getJSON('https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&_jsonp=?')
		.done((data) => {
			checkQuote(data[0]); //Check for valid quote
		})
		.fail((err) => {
			console.error('Error retrieving data. Trying again.');
			fetchQuote(true);
		});
}

function checkQuote(data) {
	//Remove <p> tags, trim quote, and decode numeric entity
	let quote = data.content.slice(3, this.length - 5).trim().replace(/&#8217;/g, '\'');
	//Store author data
	let author = data.title;
	/*If quote is profane, quote/author is invalid, or
  quote is too long, fetch new quote.
  (profaneRegEx is stored in external JS file)*/
	if (quote.match(profaneRegEx) ||
		quote.match(/[\[#<>&;]/g) ||
		author.match(/[#<>&;\(]/g) ||
		(quote + author).length > 135)
		fetchQuote(true);
	//Otherwise, display the quote after 200ms
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
	setTimeout(() => {
		$('#twtAuth').addClass('fadeInDown');
	}, 200);
	$('#quoteBtn').prop('disabled', false);
	$('#quoteBtn').html('Get another quote');
}

//When button is clicked, fetch a new quote
$('#quoteBtn').click(() => {
	fetchQuote();
});
