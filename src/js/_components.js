import { burger } from './functions/burger.js';
import './components/helpers.js';
import './components/sliders.js';
import './components/class.js';
import './components/forms.js';
import './components/calc.js';
import GraphTabs from 'graph-tabs';
import { Fancybox } from "@fancyapps/ui";
import SmoothScroll from 'smooth-scroll';
import MatchHeight from '@tannerhodges/match-height';
import 'simplebar';
// import ymaps from 'ymaps';
import { getHeaderHeight } from './functions/header-height.js';
import { chooseTabOptions, selectOptions } from './components/helpers.js';
import { isMobile } from './functions/check-viewport.js';
import CustomSelect from 'custom-select.js';

const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 500,
  speedAsDuration: true,
  easing: 'easeInOutQuart',
  offset: getHeaderHeight() + (isMobile() ? 20 : 0 )
});
// const tabs = new GraphTabs('portfolio');


Fancybox.bind("[data-fancybox]");

const chooseTab = new CustomSelect("#choose-tab", chooseTabOptions);
// const consultType = new CustomSelect("#consult-type", selectOptions);
// const consultQuantity = new CustomSelect("#consult-quantity", selectOptions);
// const calcQuantity = new CustomSelect("#calc-quantity", selectOptions);
// // const calcSquare = new CustomSelect("#calc-square", selectOptions);
// const calcQuantityExt = new CustomSelect("#calc-quantity-ext", selectOptions);
// const calcArchive = new CustomSelect("#calc-archive", selectOptions);
// const calcPeriod = new CustomSelect("#calc-period", selectOptions);

// window.YaMaps = ymaps;
