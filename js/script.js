$(document).ready(function () {
  // Live Clock
  setInterval(() => {
    let d = new Date();
    $("#live-clock").text(d.toLocaleTimeString());
  }, 1000);

  // Intro
  $("#intro-overlay").animate({ left: "0" }, 1000, function () {
    $("#intro-text").animate({ opacity: 1 }, 1000, function () {
      setTimeout(() => {
        $("#intro-overlay").fadeOut(1000, () => {
          $("#dashboard").fadeIn(800);
        });
      }, 1500);
    });
  });

  // Navigation
  $("#btn-aboutme").click(function () {
    $("#dashboard").fadeOut(500, function () {
      $("#section-aboutme").slideDown(800, function () {
        // Slide in that side image we talked about
        $("#about-image").css("right", "0");
      });
    });
  });

  $("#btn-projects").click(function () {
    $("#dashboard").fadeOut(500, function () {
      $("#section-projects").fadeIn(800);
    });
  });

  $("#btn-contact").click(function () {
    $("#section-contact").css("display", "flex").hide().fadeIn(500);
  });

  // Back Buttons
  $("#btn-back").click(function () {
    $("#about-image").css("right", "-25%");
    setTimeout(() => {
      $("#section-aboutme").fadeOut(500, () => {
        $("#dashboard").fadeIn(500);
      });
    }, 400);
  });

  $("#btn-back-projects").click(function () {
    $("#section-projects").fadeOut(500, () => {
      $("#dashboard").fadeIn(500);
    });
  });

  $("#btn-back-contact").click(function () {
    $("#section-contact").fadeOut(500, () => {
      $("#dashboard").fadeIn(500);
    });
  });

  $(".project-card").click(function () {
    window.open($(this).data("url"), "_blank");
  });

  function startImageCycles() {
    $(".p-row.demo").each(function () {
      const $container = $(this);
      const $images = $container.find("img");

      if ($images.length > 1) {
        setInterval(function () {
          const $active = $container.find("img.active");
          let $next = $active.next("img");

          if ($next.length === 0) {
            $next = $images.first();
          }

          $active.removeClass("active");
          $next.addClass("active");
        }, 3000);
      }
    });
  }
  startImageCycles();

  $("#email-link").click(function (e) {
    e.preventDefault();
    const email = "samirpokharel002@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
      $("#copy-notification").addClass("show");
      setTimeout(() => $("#copy-notification").removeClass("show"), 2000);
    });
  });

  $("#btn-resume").click(function () {
    const $slider = $("#resume-slider");
    const resumePath = "cv/cv.pdf";

    $slider.animate({ left: "0" }, 600, "swing", function () {
      window.open(resumePath, "_blank");
      setTimeout(() => {
        $slider.animate({ left: "100%" }, 600, function () {
          $(this).css("left", "-100%");
        });
      }, 800);
    });
  });
});
