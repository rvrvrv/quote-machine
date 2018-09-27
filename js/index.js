
function fetchQuote(first) {
  // Animated exit
  $('#quoteBtn').prop('disabled', true);
  $('#quoteBtn').html('Getting quote...&nbsp;<i class="fa fa-spinner fa-pulse fa-fw"></i>');
  $('.quote').fadeTo(50, 0.005);
  if (!first) $('.quote-bottom').addClass('fadeOutUp');
  $('.quote-box').css('background-color', '#fef7a6');

  // JSON/AJAX call
  $.getJSON('https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&callback=')
    .done(data => checkQuote(data[0]))
    .fail(() => setTimeout(() => fetchQuote(true), 500));
}

function displayQuote(quote, author) {
  // Display the quote and author
  $('.quote').text(quote);
  $('.author').html(
    `<i class="fa fa-ellipsis-v" style="padding-right: 2%;"></i>${author}`
  );
  // Update Tweet link
  $('#tweetLink').attr(
    'href',
    `https://twitter.com/home?status="${quote}"%20-%20${author}`
  );
  // Animated entrance
  $('.quote-box').css('background-color', '#c8f7d0');
  $('.quote').fadeTo(200, 1);
  $('.quote-bottom').removeClass('fadeOutUp');
  setTimeout(() => {
    $('.quote-bottom').addClass('fadeInDown');
  }, 200);
  $('#quoteBtn').prop('disabled', false);
  $('#quoteBtn').html('Get another quote');
}

function checkQuote(data) {
  // Remove <p> tags, trim quote, and decode numeric entity
  const quote = data.content
    .slice(3, this.length - 5)
    .trim()
    .replace(/&#8217;/g, "'");
  // Store author data
  const author = data.title;
  /* If quote is profane, quote/author is invalid, or
  quote is too long, fetch new quote.
  (profaneRegEx is stored in external JS file) */
  if (
    quote.match(profaneRegEx)
    || quote.match(/[\[#<>&;]/g)
    || author.match(/[#<>&;\(]/g)
    || (quote + author).length > 135
  ) fetchQuote(true);
  // Otherwise, display the quote after 200ms
  else setTimeout(() => displayQuote(quote, author), 200);
}

$(document).ready(() => {
  // Set cache to false for new quotes
  $.ajaxSetup({ cache: false });
  // Upon site loading, fetch and display a quote
  fetchQuote(true);
  // When button is clicked, fetch a new quote
  $('#quoteBtn').click(() => {
    fetchQuote();
  });
});
