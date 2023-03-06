/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {

  //Use an escape function to re-encoding text so that unsafe characters are converted into a safe "encoded" representation
  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  /*
  takes in a tweet object and is responsible for returning a tweet <article> element containing the entire HTML structure of the tweet.
  The tweet data object that the function will take will have all the necessary tweet data:
   {
      "user": {
        "name": "Newton",
        "avatars": "https://i.imgur.com/73hZDYK.png",
          "handle": "@SirIsaac"
        },
      "content": {
          "text": "If I have seen further it is by standing on the shoulders of giants"
        },
      "created_at": 1461116232227
   }
  */
  const createTweetElement = function (tweet) {
    const $tweet = `
    <article class="tweet">
      <header>
        <div class="profile">
          <img class="profile-photo" src="${tweet.user.avatars}">
          <p class="profile-name">${tweet.user.name}</p>
        </div>
        <p class="username">${tweet.user.handle}</p>
      </header>
      <div class="tweet-content">
        ${escape(tweet.content.text)}
      </div>
      <footer>
        <span>${timeago.format(tweet.created_at)}</span>
        <div>
          <i class="fa-solid fa-flag"></i>&ensp;
          <i class="fa-solid fa-retweet"></i>&ensp;
          <i class="fa-solid fa-heart"></i>
        </div>
      </footer>
    </article>
  `;
    return $tweet;
  }

  //taking in an array of tweet objects and then appending each one to the #tweets-container
  const renderTweets = function (tweets) {
    $('#tweet-container').empty();
    for (let tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $('#tweet-container').prepend($tweet);
    }
  };

  //use jQuery to make a request to /tweets and receive the array of tweets as JSON
  const loadTweets = function () {
    $.ajax({
      method: "GET",
      url: "/tweets",
    }).then((tweets) => {
      renderTweets(tweets);
    });
  };

  //event listener for submit and prevent its default behaviour.
  $('#submit').submit(function (event) {
    event.preventDefault();
    const text = $('#tweet-text').val();

    //form validation
    if (!text) {
      $('.error').text("⚠️ Tweet cannot be empty! ⚠️");
      $('.error').slideDown();
    } else if (text.length > 140) {
      $('.error').text("⚠️ Tweet exceeds 140 characters! ⚠️");
      $('.error').slideDown();
    } else {
      $('.error').slideUp();

      //Serializes the form data
      const data = $(this).serialize();
      //submit a POST request that sends the serialized data to the server
      $.ajax({
        method: "POST",
        url: "/tweets",
        data: data,
      }).then(() => {
        $('#tweet-text').val("");
        $('.counter').text(140);
        loadTweets();
      });
    }
  });

  //initialize the existing tweets
  loadTweets();
})