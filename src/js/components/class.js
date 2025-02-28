import { isMobile } from "../functions/check-viewport.js";
import { Fancybox } from "@fancyapps/ui";
import { validateForms } from "../functions/validate-forms.js";
import { aboutFormRules, afterSubmit, callbackModalFormRules, globalConfig } from "./forms.js";
import CustomSelect from "custom-select.js";
import { selectOptions } from "../components/helpers.js";
import { enableScroll } from "../functions/enable-scroll.js";
import Swiper from "swiper";

class AF {
  constructor() {
    this.header = document.querySelector('.header');
    this.portfolioBtnMore = document.querySelectorAll('.portfolio__btn-more');
    this.tabsNav = document.querySelectorAll('.portfolio .tabs__nav');
    this.tabsBtn = document.querySelectorAll('.portfolio .tabs__nav-btn');
    this.mobilePortfolioBtn = document.querySelectorAll('.tabs__mobile-btn');
    this.btnAttach = document.querySelectorAll('.btn-attach');
    this.questions = document.querySelectorAll(".qna__item");
    this.questionMore = document.querySelectorAll('.btn-more');
    this.modalBtns = document.querySelectorAll('[data-modal]');
    this.calcForm = document.querySelector('.calc__form');
    this.burger = document?.querySelector('[data-burger]');
    this.menu = document?.querySelector('[data-menu]');
    this.toTop = document.querySelector('.to-top');
    this.mapLink = document.querySelector('.map__link');
  }

  init() {
    this.events();

    this.initialModalBtns();
    this.initialMobilePartnersSlider();
    this.initialQnaBlock();
    this.resizeCalcFormHandler();
    // this.generateStepsSlider();
  }

  events = () => {
    document.addEventListener('DOMContentLoaded', this.onLoad);
    document.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', this.initTabsNav);
    this.portfolioBtnMore.forEach( el => el.addEventListener('click', this.showMoreCases));
    this.questionMore.forEach( el => el.addEventListener('click', this.showMoreElements));
    this.tabsBtn.forEach( el => el.addEventListener('click', this.selectTab));
    this.mobilePortfolioBtn.forEach( el => el.addEventListener('click', this.selectMobileTab));
    this.btnAttach.forEach( el => el.addEventListener('click', this.selectFormFile));
    document.addEventListener('DOMContentLoaded', this.animateSlidersOnScrollMobile);
    window.addEventListener('resize', this.checkResize);
  }

  onLoad = () => {
    this.tabsNav.forEach((tab) => {
      const max = Math.round(100 / tab.children.length);
      tab.style.gridTemplateColumns = 'repeat(auto-fit, minmax(140px, '+max+'%))';
    })

    if (isMobile()) {
      this.mapLink.href = this.mapLink.href.replace('https', 'yandexmaps')
    }
  }

  onScroll = () => {
    if (window.scrollY) {
      this.header?.classList.add('sticky')

      const offset = isMobile() ? 200 : 300;

      if (window.scrollY > offset) {
        this.toTop.style.opacity = 1;
      } else {
        this.toTop.style.opacity = 0;
      }
    } else {
      this.header?.classList.remove('sticky')
    }
  }

  showMoreCases = (e) => {
    const btn = e.target;
    const tab = btn.closest('.tabs__panel');
    const cases = tab.querySelector('.portfolio__cases');
    cases.classList.add('show-all');
  }

  selectTab = (e) => {
    const targetBtn = e.target;
    const tabs = targetBtn.closest('.tabs');
    const tabsNav = tabs.querySelector('.tabs__nav');
    const mobileBtn = tabs.querySelector('.tabs__mobile-btn');

    mobileBtn.querySelector('span').innerHTML = targetBtn.innerHTML;

    mobileBtn.classList.remove('active');

    if (window.innerWidth < 575) {
      tabsNav.style.maxHeight = 0;
    }
  }

  selectMobileTab = (e) => {
    const targetBtn = e.target;
    const tabs = targetBtn.closest('.tabs');
    const tabsNav = tabs.querySelector('.tabs__nav');
    const tabsItems = tabs.querySelectorAll('.tabs__nav-item');
    const tabsHeight = `${tabsItems.length * 50}px`;

    targetBtn.classList.toggle('active');

    if (targetBtn.classList.contains('active')) {
      tabsNav.style.maxHeight = tabsHeight;
    } else {
      tabsNav.style.maxHeight = 0;
    }
  }

  initTabsNav = () => {
    const tabsNav = document.querySelector('.tabs__nav');

    if (window.innerWidth >= 575) {
      tabsNav.style.maxHeight = 'initial';
    } else {
      tabsNav.style.maxHeight = 0;
    }
  }

  selectFormFile = (e) => {
    const _this = e.target;
    _this.parentElement.click();
  }

  animateSlidersOnScrollMobile = () => {
    if (!isMobile()) return;

    const animateElements = document.querySelectorAll('.animate-touch');

    if (!('IntersectionObserver' in window)) {
      console.warn('Intersection Observer не поддерживается в этом браузере.');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-started');

              setTimeout(() => {
                entry.target.classList.add('animate-finished')
              }, 2000);

              observer.unobserve(entry.target);
            }, 500);
          }
        });
      },
      {
        rootMargin: '0px 0px -100px 0px',
      }
    );

    animateElements.forEach((element) => {
      observer.observe(element);
    });
  }

  initialMobilePartnersSlider = () => {
    if (!isMobile()) return;

    const sliderTop = document.querySelector('.partners__slider-top .swiper-wrapper');
    const sliderBottom = document.querySelector('.partners__slider-bottom');
    const sliderItems = sliderBottom.querySelectorAll('.partners__slider-bottom .partners__item');

    sliderItems.forEach((item) => {
      sliderTop.appendChild(item);
    })

    sliderBottom.remove();
  }

  checkResize = () => {
    setTimeout(() => {
      if (isMobile())
        document.location.reload();
    }, 1000);
  }

  initialQnaBlock = () => {
    this.questions.forEach((item) => {
      const minimizeSiblings = true;
      const question = item.querySelector(".qna__question");
      const answer = item.querySelector(".qna__answer");
      const btn = item.querySelector(".qna__spoiler");
      const cssDuration = getComputedStyle(answer).getPropertyValue(
        "--qna-animation-duration"
      );
      const animationDuration = Number.parseInt(
        Number.parseFloat(cssDuration) * (/\ds$/.test(cssDuration) ? 1000 : 1)
      );

      const setHeight = () =>
        answer.style.setProperty(
          "--qna-details-height",
          `${answer.scrollHeight + 30}px`
        );

      item.classList.add("js-details");

      const onClick = (event) => {
        item.open = true;
        setHeight();

        if (minimizeSiblings) {
          const siblings = [...item.parentNode.children]
            .filter((el) => el.classList.contains("js-details"))
            .filter((el) => el !== item);

          siblings.forEach((sibling) => {
            sibling.classList.remove("is-open");
            sibling.open = false;
          });
        }

        let isAnimating = true;
        item.classList.toggle("is-open");
        item.classList.add("is-animating");

        setTimeout(() => {
          item.classList.remove("is-animating");
        }, animationDuration);

        if (item.classList.contains("is-open")) {
          btn.ariaLabel = 'Закрыть спойлер';
          event.preventDefault();
          if (isAnimating) return;
          setTimeout(() => {
            item.open = false;
            isAnimating = false;
          }, animationDuration);
        } else {
          btn.ariaLabel = 'Открыть спойлер';
        }
      };

      question.addEventListener("click", onClick);
    });
  }

  showMoreElements = (e) => {
    const btn = e.target;
    const containerElement = "." + btn.dataset.container;
    const container = document.querySelector(containerElement);
    container.classList?.add('show-all');

    btn.style.display = 'none';
  }

  initialModalBtns = () => {
    this.modalBtns.forEach((element) => {
      const src = element.dataset.modal;
      element.addEventListener('click', () => {
        this.closeMenu();
        Fancybox.close(true);
        Fancybox.show([
          {
            src: `#${src}-modal`,
            type: 'inline'
          }
        ]);

        // Fancybox.getInstance().on('init', (fancybox) => {
        // });

        Fancybox.getInstance().on('reveal', (fancybox, slide) => {
          this.onFancyboxOpen(fancybox, slide);
        });

        Fancybox.getInstance().on('close', (fancybox) => {
          this.onFancyboxClosed(fancybox);
        });

        // Fancybox.getInstance().on('destroy', (fancybox) => {
        //   console.log('Fancybox destroyed');
        // });
      });
    });
  }

  onFancyboxOpen = (fancybox, slide) => {
    switch (slide.src) {
      case '#article-modal':
        this.generateArticleImagesSlider(fancybox)
        break;

      case '#callback-modal':
        setTimeout(() => {
          validateForms(slide.src + ' .callback-modal__form', callbackModalFormRules, [], afterSubmit, globalConfig);
        }, 100);
        break;
      case '#kit-modal':
        setTimeout(() => {
          validateForms(slide.src + ' .callback-modal__form', callbackModalFormRules, [], afterSubmit, globalConfig);
        }, 100);
        break;
      default:
        break;
    }
  }

  onFancyboxClosed = (fancybox) => {
    // console.log(fancybox);
  }

  generateArticleImagesSlider = (fb) => {
    if (!isMobile()) return;

    const modal = fb.container;
    const images = modal.querySelectorAll('.article-modal__images img');

    const swiperContainer = document.createElement('div');
    swiperContainer.classList.add('swiper-container');

    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');

    images.forEach((img) => {
      const swiperSlide = document.createElement('div');
      swiperSlide.classList.add('swiper-slide');

      const clonedImg = img.cloneNode(true);
      swiperSlide.appendChild(clonedImg);

      swiperWrapper.appendChild(swiperSlide);
    });

    swiperContainer.appendChild(swiperWrapper);

    const swiperPagination = document.createElement('div');
    swiperPagination.classList.add('swiper-pagination');
    swiperContainer.appendChild(swiperPagination);

    // const swiperButtonPrev = document.createElement('div');
    // swiperButtonPrev.classList.add('swiper-button-prev');
    // swiperContainer.appendChild(swiperButtonPrev);

    // const swiperButtonNext = document.createElement('div');
    // swiperButtonNext.classList.add('swiper-button-next');
    // swiperContainer.appendChild(swiperButtonNext);

    const parentElement = modal.querySelector('.article-modal__images');
    parentElement.innerHTML = '';
    parentElement.prepend(swiperContainer);

    const swiper = new Swiper(swiperContainer, {
      slidesPerView: 1,
      spaceBetween: 10,
      centeredSlides: true,
      pagination: {
        el: swiperPagination,
        clickable: true,
      },
      // navigation: {
      //   nextEl: swiperButtonNext,
      //   prevEl: swiperButtonPrev,
      // },
    });
  }
  generateStepsSlider = (fb) => {
    if (!isMobile()) return;

    const stepsContainer = document.querySelector('.steps');
    const items = stepsContainer.querySelectorAll('.steps__item');

    const swiperContainer = document.createElement('div');
    swiperContainer.classList.add('swiper-container');

    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');

    items.forEach((item) => {
      const swiperSlide = document.createElement('div');
      swiperSlide.classList.add('swiper-slide');

      const clonedItem = item.cloneNode(true);
      swiperSlide.appendChild(clonedItem);

      swiperWrapper.appendChild(swiperSlide);
    });

    swiperContainer.appendChild(swiperWrapper);

    const parentElement = stepsContainer.querySelector('.steps__wrapper');
    parentElement.innerHTML = '';
    parentElement.prepend(swiperContainer);

    const swiper = new Swiper(swiperContainer, {
      slidesPerView: 1,
      spaceBetween: 10,
      centeredSlides: false,
    });
  }

  closeMenu = () => {
    if (this.menu?.classList.contains('menu--active')) {
      this.burger?.classList.remove('burger--active');
      this.menu?.classList.remove('menu--active');
      this.burger?.setAttribute('aria-expanded', 'false');
      this.burger?.setAttribute('aria-label', 'Открыть меню');

      enableScroll();
    }

  }

  resizeCalcFormHandler = () => {
    if (!isMobile()) return;

    const groups = this.calcForm.querySelectorAll('.form-group');

    if (groups.length) {
      groups.forEach((group) => {
        const checkboxes = group.querySelectorAll('input[type="checkbox"], input[type="radio"]');
        const label = document.createElement('div');
        const select = document.createElement('select');
        let labelTitle = group.querySelector('.form-group__title').textContent;
        let selectId = group.id ? group.id : `select-${(Math.random() + 1).toString(36).substring(7)}`;

        select.id = selectId;
        select.addEventListener('change', this.handleSelectChange);

        label.classList.add('form-label');

        if (labelTitle.includes('Выберите объем хранилища')) {
          labelTitle = 'Объем хранилища';
        }
        const optionPlaceholder = document.createElement('option');
        optionPlaceholder.value = "";
        optionPlaceholder.dataset.placeholder = true;
        optionPlaceholder.selected = true;
        optionPlaceholder.disabled = true;
        optionPlaceholder.hidden = true;
        optionPlaceholder.innerText = labelTitle;

        select.appendChild(optionPlaceholder);

        if (checkboxes.length) {
          const firstCheckboxName = checkboxes[0].name;
          const selectNameMatch = firstCheckboxName.match(/([^[\]]+)/);
          select.name = selectNameMatch[0];
          select.classList.add('input--' + selectNameMatch[0]);

          checkboxes.forEach((cb) => {
            const option = document.createElement('option');
            const title = cb.nextElementSibling.innerText;
            let optionValue = null;

            if (cb.type == 'radio') {
              optionValue = cb.value;
            } else if (cb.type == 'checkbox') {
              const checkboxNameMatch = cb.name.match(/\[(.*?)\]/);
              optionValue = checkboxNameMatch ? checkboxNameMatch[1] : '';
            }

            option.value = optionValue;
            option.innerText = title;

            select.appendChild(option);
          })
        }

        label.appendChild(select);
        group.parentElement.appendChild(label);
        group.remove();

        if (selectId) {
          new CustomSelect('#' + selectId, selectOptions);
        } else {
          console.log('Не могу инициализировать кастомный селект.')
        }
      })

    }

    const handleSelectChange = (event) => {
      const selectedValue = event.target.value;
      const checkboxes = document.querySelectorAll('.custom-checkbox__field');

      // Сбрасываем все чекбоксы
      checkboxes.forEach(checkbox => {
        checkbox.checked = false;
      });

      // Находим выбранный чекбокс и устанавливаем его как активный
      if (selectedValue) {
        const selectedCheckboxId = event.target.options[event.target.selectedIndex].getAttribute('data-checkbox-id');
        const selectedCheckbox = document.getElementById(selectedCheckboxId);
        if (selectedCheckbox) {
          selectedCheckbox.checked = true;
        }
      }
    }
  }
}

window.Af = new AF();

window.Af.init();
window.Fancybox = Fancybox;
