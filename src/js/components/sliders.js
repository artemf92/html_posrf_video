import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { isMobile, isTablet } from '../functions/check-viewport.js';

Swiper.use([Navigation, Pagination]);

const heroSlider = new Swiper('.hero__slider', {
  slidesPerView: 1,
  pagination: {
    el: '.swiper-pagination',
  },
  autoplay: {
    delay: 5000
  },
  loop: true,
  modules: [Autoplay]
});

const examplesSlider = new Swiper('.examples__slider', {
  slidesPerView: 'auto',
  spaceBetween: 5,
  navigation: {
    nextEl: '.btn-next',
    prevEl: '.btn-prev',
  },
  breakpoints: {
    768: {
      allowTouchMove: false,
      slidesPerView: 1,
      spaceBetween: 80
    },
  }
});

if (!isTablet()) {
  const examplesInnerSliders = document.querySelectorAll('.examples__inner-slider');

  examplesInnerSliders.forEach((slider) => {
    const swiper = new Swiper(slider, {
      slidesPerView: 1,
      pagination: {
        el: slider.querySelector('.examples__pagination'),
        clickable: true,
      }
    });
  });
}

if (isMobile()) {
  const aboutSlider = new Swiper('.about__slider', {
    slidesPerView: 1,
    spaceBetween: 10
  });
}

const reviewsSlider = new Swiper('.reviews__slider', {
  slidesPerView: 1,
  spaceBetween: 10,
  // simulateTouch: false,
  breakpoints: {
    575: {
      slidesPerView: 'auto',
    },
    1200: {
      slidesPerView: 'auto',
      centeredSlides: true,
      initialSlide: 1,
      spaceBetween: 20,
    },
  },
  navigation: {
    nextEl: '.btn-next',
    prevEl: '.btn-prev',
  },
});

const partnersSliderTop = new Swiper('.partners__slider-top', {
  slidesPerView: 'auto',
  centeredSlides: true,
  initialSlide: 1,
  spaceBetween: 10,
  loop: true,
  createElements: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  breakpoints: {
    480: {
      slidesPerView: 4,
      centeredSlides: false,
      initialSlide: 1,
    },
    768: {
      slidesPerView: 5,
      initialSlide: 2,
      centeredSlides: true,
      spaceBetween: 15,
    },
    992: {
      slidesPerView: 'auto',
      initialSlide: 2,
      spaceBetween: 20,
    },
    // 1200: {
    //   slidesPerView: 6,
    //   initialSlide: 2,
    //   spaceBetween: 20,
    // },
  },
  modules: [Autoplay]
});

const partnersItems = document.querySelectorAll('.partners__slider-bottom .partners__item');
const partnersSliderBottom = new Swiper('.partners__slider-bottom', {
  slidesPerView: 6,
  centeredSlides: true,
  initialSlide: partnersItems.length - 3,
  spaceBetween: 10,
  createElements: true,
  loop: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
    reverseDirection: true
  },
  breakpoints: {
    768: {
      slidesPerView: 5,
      initialSlide: partnersItems.length - 3,
      spaceBetween: 15,
    },
    992: {
      slidesPerView: 'auto',
      initialSlide: partnersItems.length - 3,
      spaceBetween: 20,
    },
    // 1200: {
    //   slidesPerView: 6,
    //   initialSlide: partnersItems.length - 3,
    //   spaceBetween: 20,
    // }
  },
  modules: [Autoplay]
});


const blogSlider = new Swiper('.blog__slider', {
  slidesPerView: 1,
  // spaceBetween: 0,
  centeredSlides: true,
  breakpoints: {
    575: {
      slidesPerView: 'auto',
      // initialSlide: 1,
      centeredSlides: false,
      spaceBetween: 20,
    },
    1200: {
      slidesPerView: 'auto',
      centeredSlides: true,
      initialSlide: 1,
      spaceBetween: 20,
    },

  },
  navigation: {
    nextEl: '.btn-next',
    prevEl: '.btn-prev',
  },
});
