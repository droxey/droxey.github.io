/*
	Name: BookCard
	Description: Responsive HTML5 vCard Template
	Version: 1.2
	Author: pixelwars
*/

(function($) {
  var safeMod = false;
  var portfolioKeyword;
  var $container;
  var animEngine;

  $(function() {
    if ($("iframe,video").length) {
      $("html").fitVids();
    }

    portfolioKeyword = $(".portfolio").attr("id");
    initialize();
    var detailUrl = giveDetailUrl();

    $(".cover").each(function(index, element) {
      $(this).css(
        "background-image",
        "url(" +
          $(this)
            .find(".cover-image-holder img")
            .attr("src") +
          ")"
      );
    });

    safeMod = $("html").attr("data-safeMod") === "true";
    var isIE11 = !!navigator.userAgent.match(/Trident\/7\./);
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isOperaMobile = isAndroid && navigator.userAgent.indexOf("Opera") > -1;
    safeMod =
      safeMod ||
      !Modernizr.csstransforms ||
      !Modernizr.csstransforms3d ||
      $(window).width() < 960 ||
      $.browser.msie ||
      isIE11 ||
      isAndroid ||
      isOperaMobile;

    if (safeMod) {
      $("html").addClass("safe-mod");

      setActivePage();
      $.address.change(function() {
        setActivePage();
      });
    }

    if ($.address.path().indexOf("/" + portfolioKeyword) != -1 && !safeMod) {
      setTimeout(function() {
        openMenu();
      }, 500);
    }

    adaptLayout();
    $(window).resize(function() {
      adaptLayout();
    });

    $.address.change(function() {
      var detailUrl = giveDetailUrl();
      if (detailUrl != -1) {
        showProjectDetails(detailUrl);
      } else {
        if ($.address.path().indexOf("/" + portfolioKeyword) != -1) {
          hideProjectDetails(true, false);
        }
      }
    });

    $container = $(".portfolio-items");

    // detect chrome for css3 flashing fix
    $.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());
    if (!$.browser.chrome || safeMod) {
      $("html").addClass("no-chrome");
    }
    $.browser.safari =
      $.browser.webkit && !/chrome/.test(navigator.userAgent.toLowerCase());

    animEngine =
      ($.browser.chrome || $.browser.safari) && !safeMod
        ? "jquery"
        : "best-available";

    if ($container.length) {
      $container.imagesLoaded(function() {
        $container.isotope({
          itemSelector: ".hentry",
          layoutMode: "fitRows"
        });

        if ($container.data("isotope")) {
          var filters = $("#filters");
          if (filters.length) {
            filters.find("a").on("click", function() {
              var selector = $(this).attr("data-filter");
              $container.isotope({ filter: selector });
              $(this)
                .parent()
                .addClass("current")
                .siblings()
                .removeClass("current");
              return false;
            });
          }
        }

        setMasonry();
        setTimeout(function() {
          $container.isotope();
        }, 20);
        $(window).resize(function() {
          setTimeout(function() {
            setMasonry();
          }, 600);
        });
      });
    }

    if (!safeMod) {
      setupScrollBars();

      $(window).resize(function() {
        refreshScrollBars();
        if ($(window).width() < 960) {
          location.reload(true);
        }
      });
    }

    fitText();

    animateBars();

    $("a.ajax").live("click", function() {
      var url = $(this).attr("href");
      var baseUrl = $.address.baseURL();

      if (url.indexOf(baseUrl) !== -1) {
        // full url
        var total = url.length;
        detailUrl = url.slice(baseUrl.length + 1, total);
        $.address.path("/" + detailUrl);
      } else {
        // relative url
        detailUrl = url;
        $.address.path(portfolioKeyword + "/" + detailUrl);
      }

      return false;
    });

    initEmail();

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

    Menu.init();
  });

  window.onload = function() {
    // ie8 cover text invisible fix
    if (
      jQuery.browser.version.substring(0, 2) == "8." ||
      jQuery.browser.version.substring(0, 2) == "7."
    ) {
      setTimeout(function() {
        setActivePage();
      }, 2000);
    }

    setTimeout(function() {
      fitText();
    }, 1000);
  };

  var inAnimation,
    outAnimation,
    safeModPageInAnimation,
    cover_h1_tune,
    cover_h2_tune,
    cover_h3_tune,
    cover_h3_span_tune;
  function initialize() {
    inAnimation = $("html").attr("data-inAnimation");
    outAnimation = $("html").attr("data-outAnimation");
    safeModPageInAnimation = $("html").attr("data-safeModPageInAnimation");
    cover_h1_tune = $("html").attr("data-cover-h1-tune");
    cover_h2_tune = $("html").attr("data-cover-h2-tune");
    cover_h3_tune = $("html").attr("data-cover-h3-tune");
    cover_h3_span_tune = $("html").attr("data-cover-h3-span-tune");
  }

  function adaptLayout() {
    var width = safeMod ? $("body").width() : $(".content").width();
    if (width < 420) {
      $("html").addClass("w420");
    } else {
      $("html").removeClass("w420");
    }
  }

  function setActivePage() {
    $(".page")
      .removeClass("active")
      .hide();
    var path = $.address.path();
    path = path.slice(1, path.length);
    path = giveDetailUrl() != -1 ? portfolioKeyword : path;
    if (path == "") {
      // if hash tag doesnt exists - go to first page
      var firstPage = $("#header ul li")
        .first()
        .find("a")
        .attr("href");
      path = firstPage.slice(2, firstPage.length);
      $.address.path(path);
    }

    if (Modernizr.csstransforms && Modernizr.csstransforms3d) {
      // modern browser
      $("#" + path)
        .show()
        .removeClass("animated ")
        .addClass("animated " + safeModPageInAnimation);
    } else {
      //old browser
      $("#" + path).fadeIn();
      $(".page.active").hide();
    }

    $("#" + path).addClass("active");

    // detect if user is on cover page
    if ($(".page.active").find(".cover").length) {
      $("html")
        .removeClass("not-on-cover-page")
        .addClass("on-cover-page");
    } else {
      $("html")
        .removeClass("on-cover-page")
        .addClass("not-on-cover-page");
    }

    setCurrentMenuItem();

    if (path.indexOf(portfolioKeyword) != -1) {
      setTimeout(function() {
        setMasonry();
      }, 100);
    }
    $("body").scrollTop(0);

    fitText();
  }

  function setMasonry() {
    if ($container.data("isotope")) {
      var containerW = $container.width();
      var items = $container.children(".hentry");
      var columns, columnWidth;
      var viewports = [
        {
          width: 1200,
          columns: 5
        },
        {
          width: 900,
          columns: 4
        },
        {
          width: 600,
          columns: 3
        },
        {
          width: 320,
          columns: 2
        },
        {
          width: 0,
          columns: 1
        }
      ];

      for (var i = 0, len = viewports.length; i < len; ++i) {
        var viewport = viewports[i];

        if (containerW > viewport.width) {
          columns = viewport.columns;
          break;
        }
      }

      // set the widths (%) for each of item
      items.each(function(index, element) {
        var multiplier = $(this).hasClass("x2") && columns > 1 ? 2 : 1;
        var itemWidth =
          Math.floor(containerW / columns) * 100 / containerW * multiplier;
        $(this).css("width", itemWidth + "%");
      });

      columnWidth = Math.floor(containerW / columns);
      $container
        .isotope()
        .isotope("option", { masonry: { columnWidth: columnWidth } });
    }
  }

  function animateBars() {
    $(".bar").each(function() {
      var bar = $(this);
      bar.find(".progress").css("width", bar.attr("data-percent") + "%");
    });
  }

  function fitText() {
    $(".cover h1").fitText(cover_h1_tune);
    $(".cover h2").fitText(cover_h2_tune);
    $(".cover h3").fitText(cover_h3_tune);
    $(".cover h3 span").fitText(cover_h3_span_tune);
  }

  var scroller = [];

  function setupScrollBars() {
    if (!safeMod) {
      // don't run antiscroll if safe mode is on
      $(".antiscroll-wrap").each(function(index, element) {
        scroller[index] = $(this)
          .antiscroll({
            x: false,
            autoHide: $("html").attr("data-autoHideScrollbar") != "false"
          })
          .data("antiscroll");
      });
    }
  }

  function refreshScrollBars() {
    setTimeout(function() {
      rebuildScrollBars();
      setupScrollBars();
    }, 500);
  }

  function rebuildScrollBars() {
    $.each(scroller, function(i, l) {
      scroller[i].rebuild();
    });
  }

  function setCurrentMenuItem() {
    var activePageId = $(".page.active").attr("id");
    // set default nav menu
    $("#header nav ul a[href$=" + activePageId + "]")
      .parent()
      .addClass("current_page_item")
      .siblings()
      .removeClass("current_page_item");
  }

  var pActive;
  function giveDetailUrl() {
    var address = $.address.value();
    var detailUrl;

    if (
      address.indexOf("/" + portfolioKeyword + "/") != -1 &&
      address.length > portfolioKeyword.length + 2
    ) {
      var total = address.length;
      detailUrl = address.slice(portfolioKeyword.length + 2, total);
    } else {
      detailUrl = -1;
    }
    return detailUrl;
  }

  function showLoader() {
    $(".loader").show();
  }
  function hideLoader() {
    $(".loader").hide();
  }

  var Menu = (function() {
    var $container = $("#rm-container"),
      $cover = $container.find("div.rm-cover"),
      $middle = $container.find("div.rm-middle"),
      $right = $container.find("div.rm-right"),
      $open = $cover.find("a.rm-button-open"),
      $close = $right.find(".rm-close");

    (init = function() {
      initEvents();
    }),
      (initEvents = function() {
        $open.on("click", function(event) {
          if (!safeMod) {
            openMenu();
            return false;
          }
        });

        $close.on("click", function(event) {
          closeMenu();
          return false;
        });
      }),
      (openMenu = function() {
        $container.removeClass("rm-closed");
        setTimeout(function() {
          $container.addClass("rm-open");
        }, 10);
      }),
      (closeMenu = function() {
        $container.removeClass("rm-open rm-nodelay rm-in");
        setTimeout(function() {
          $container.addClass("rm-closed");
        }, 850);
      });

    return { init: init };
  })();

  function initEmail() {
    emailjs.init("user_7N60RZLA5J27JCejWpKOW");
  }
})(jQuery);
