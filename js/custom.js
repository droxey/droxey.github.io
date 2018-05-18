(function($) {
  var gtag = function() {
    dataLayer.push(arguments);
  };

  var getIsDeployed = function() {
    return document.location.origin.indexOf("file://") !== 0;
  };

  var initAnalytics = function() {
    if (getIsDeployed()) {
      window.dataLayer = window.dataLayer || [];
      gtag("js", new Date());
      gtag("config", "UA-111535249-1");
    }
  };

  var initEmails = function() {
    emailjs.init("user_7N60RZLA5J27JCejWpKOW");
    $("#contact-form").live("submit", function(e) {
      e.preventDefault();

      var serializedForm = $(this).serializeArray();
      var contactFormObj = {};
      $.each(serializedForm, function(i, v) {
        contactFormObj[v.name] = v.value;
      });

      emailjs.send("default_service", "template_UEQM8ASO", contactFormObj);
      $(this)
        .closest("form")
        .find("input[type=text], textarea")
        .val("");

      return false;
    });
  };

  var initTwitter = function() {
    var latestTweets = $("#twitter-list ul li.latest");
    if (latestTweets.length) {
      var config = {
        profile: { screenName: $("html").attr("data-twitter-name") },
        domId: "",
        maxTweets: 1,
        enableLinks: true,
        showUser: true,
        showTime: true,
        dateFunction: dateFormatter,
        showRetweet: true,
        customCallback: handleTweets,
        showInteraction: true,
        showImages: false,
        useEmoji: true,
        linksInNewWindow: true,
        showPermalinks: true
      };

      function handleTweets(tweets) {
        var tweet = $(tweets[0]);
        var tweetLinks = tweet.find("[data-expanded-url]");
        tweetLinks.html("View Link");
        latestTweets.html(tweet);
      }

      function dateFormatter(date) {
        var momentToString = moment(date)
          .format("MMDDYYYY")
          .toString();
        return moment(momentToString, "MMDDYYYY").fromNow();
      }

      twitterFetcher.fetch(config);
    }
  };
  initTwitter();
  initAnalytics();
  initEmails();
})(jQuery);
