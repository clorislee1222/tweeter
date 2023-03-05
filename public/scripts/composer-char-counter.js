$(document).ready(function() {
  // --- our code goes here ---
  $("#tweet-text").on('input', () => {
    let length = $("#tweet-text").val().length;
    let counter = $(".counter");
    counter.text(140 - length);

    if (140 - length < 0) {
      counter.addClass("warning");
    } else {
      counter.removeClass("warning");
    }
  });
});
