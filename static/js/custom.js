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

  var initMoment = function() {
    moment.locale("en", {
      relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "seconds",
        ss: "%ss",
        m: "a minute",
        mm: "%dm",
        h: "an hour",
        hh: "%dh",
        d: "a day",
        dd: "%dd",
        M: "a month",
        MM: "%dM",
        y: "a year",
        yy: "%dY"
      }
    });
  };

  var initTwitter = function() {
    initMoment();

    var latestTweets = $("#twitter-list ul li.latest");
    if (latestTweets.length) {
      var screenName = $("html").attr("data-twitter-name");

      var getUsernameLink = function(username) {
        var linkHtml = $(
          '<a href="https://twitter.com/' +
            username +
            '" target="_blank"><i class="fab fa-fw fa-twitter"></i></a>'
        );
      };

      var config = {
        profile: { screenName: screenName },
        domId: "",
        maxTweets: 1,
        enableLinks: true,
        showUser: true,
        showTime: true,
        showRetweet: true,
        showInteraction: true,
        showImages: false,
        useEmoji: true,
        linksInNewWindow: true,
        showPermalinks: true,
        dateFunction: function(date) {
          var momentToString = moment(date)
            .format("MMDDYYYY")
            .toString();
          return moment(momentToString, "MMDDYYYY").fromNow();
        },
        customCallback: function(tweets) {
          var tweet = $(tweets[0]),
            userDiv = $(tweet[0]),
            tweetLinks = $(tweet[1]).find("[data-expanded-url]"),
            rtUsername = userDiv
              .find('[data-scribe="element:screen_name"]')
              .text(),
            isRetweet = rtUsername.length > 0,
            timePostedNode = $(tweet[2]).find("a"),
            rtIndicator = isRetweet
              ? '<span class="rt">retweeted<br></span>'
              : '<span class="posted">posted<br></span>',
            tweetUsername = isRetweet ? rtUsername : screenName;

          timePostedNode.html(
            rtIndicator +
              timePostedNode
                .text()
                .split("Posted ")
                .pop()
                .trim()
          );

          timePostedNode.attr(
            "title",
            "View " + tweetUsername + "'s Tweet on Twitter"
          );

          tweetLinks.html("View Link");
          latestTweets.html(tweet);
        }
      };

      twitterFetcher.fetch(config);
    }
  };

  initTwitter();
  initAnalytics();
  initEmails();
})(jQuery);