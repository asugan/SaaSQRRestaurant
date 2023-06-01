$(".nav-mobil").slideAndSwipe();
$("#slider-home").owlCarousel({
  autoplay: true,
  autoplayTimeout: 3000,
  autoplayHoverPause: false,
  loop: true,
  margin: 10,
  nav: true,
  responsive: {
    0: {
      items: 1,
    },
    600: {
      items: 1,
    },
    1100: {
      items: 1,
    },
  },
});

$("#favori-lezzet-slide").owlCarousel({
  autoplay: true,
  autoplayTimeout: 3000,
  autoplayHoverPause: false,
  loop: true,
  margin: 10,
  nav: true,
  responsive: {
    0: {
      items: 3,
    },
    600: {
      items: 5,
    },
    1100: {
      items: 6,
    },
  },
});

function openCity(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

$(".product-open-modal").on("click", function (e) {
  e.preventDefault();
  var title = $(this).find(".product-title").text();
  var price = $(this).find(".fiyat").text();
  var image = $(this).find("img").attr("src");
  $.fancybox.open(
    '<div class="product-modal"><img class="img-responsive" src="' +
      image +
      '"/><h4>' +
      title +
      "</h4><span>" +
      price +
      "</span></div>"
  );
});

$(window).on("load", function () {
  var mySwiper = new Swiper(".swiper-menu-container", {
    slidesPerView: "auto",
    spaceBetween: 0,
    freeMode: true,
    centeredSlides: true,
    centeredSlidesBounds: true,
    initialSlide: $(".swiper-menu-container li.active").index(),
  });
});
