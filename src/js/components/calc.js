import CustomSelect from "custom-select.js";

class AfCalc {
  constructor(selector) {
    this.form = selector;
    this.validate = false;
    this.prevValue = 0;
    this.calcValues = {
      'project': {
        'vodosnabzhenie': 1,
        'ventil': 1,
        'otoplenie': 1,
      },
      'type': {
        'kvartira': 1,
        'ofis': 1,
        'sklad': 1,
        'magazin': 1,
        'restoran': 1,
        'proizvodstvo': 1,
        'admin': 1,
        'tc': 1,
        'med': 1,
        'more': 1,
      }
    };
    this.totalTime = this.form.querySelector('#result-time');
    this.totalResult = this.form.querySelector('#result-total');
    this.calcType = null;
    this.calcProject = null;
    this.selectOptions = {
      settings: {
        openDirection: 'down',
        searchEnable: false,
        classNames: {
          select: 'form-select',
          dropdown: 'form-select-dropdown',
          option: 'form-select-option',
          optionGroup: "form-optionGroup",
          optionGroupLabel: "form-optionGroup-label",
          optionGroupExpandInput: "form-optionGroup-expandInput",
          optionGroupListing: "form-optionGroup-listing"
        }
      },
      events: {
        afterOpen: () => {
          const openedSelector = document.querySelector('.form-select-dropdown.cs-open-down');
          const optionGroup = openedSelector?.querySelectorAll('.form-optionGroup');
          if (!optionGroup?.length) return;
          optionGroup.forEach(g => {
            const input = g.querySelector('.form-optionGroup-expandInput');
            input.checked = false;
          });
        },
        afterChange: (newVal, select) => {
          if (newVal == 'other' || newVal == 'more') {
            select.destroy();

            const input = document.createElement('input');
            const label = select.originalSelect.parentElement;
            input.name = select.originalSelect.name;
            input.id = select.originalSelect.id;
            input.required = select.originalSelect.required;
            input.type = 'text';
            input.placeholder = 'Другое';
            input.classList.add('form-input', 'consult-input');
            label.insertAdjacentElement('afterbegin', input);

            const hash = input.name.replace(/(-\w)/g, k => k[1].toUpperCase());

            const newInput = label.querySelector('input');
            newInput.focus();
            this[hash] = newInput;
            newInput.addEventListener('change', this.calculate.bind(this));

            select.originalSelect.remove();
          } else {
            this.calculate();
          }
        }
      }
    };
    this.speed = 200;

    this.init();
  }

  init() {
    this.calcProject = new CustomSelect(this.form.querySelector("#calc-project"), this.selectOptions);
    this.calcType = new CustomSelect(this.form.querySelector("#calc-type"), this.selectOptions);
    this.calcZadanie = new CustomSelect(this.form.querySelector("#calc-zadanie"), this.selectOptions);

    const inputs = this.form.querySelectorAll('input');

    inputs.forEach((input) => {
      input.addEventListener('change', this.calculate.bind(this));
    });

    // this.form.addEventListener('submit', this.onSubmitForm.bind(this));

    const calcRules = [{
      ruleSelector: '#calc-type',
      rules: [{
        rule: 'required',
        value: true,
        errorMessage: 'Укажите тип'
      }]
    },
    {
      ruleSelector: '#calc-area',
      rules: [{
        rule: 'required',
        value: true,
        errorMessage: 'Укажите площадь'
      }]
    }
    ];

    validateForms(this.form, calcRules, [], this.onSubmitForm, validateFormsGlobalConfig);
  }

  handleCustomSelectChange(e) {
    setTimeout(() => {
      this.calculate();
    }, 100);
  }

  getSelectedValue(select) {
    if (select?.tagName?.toLowerCase() === 'input') return select.value;
    return select?.selectedValue[0];
  }

  calculate() {
    // return
    const data = {};

    const areaInput = this.form.querySelector('#calc-area');

    let totalCost = 0;

    data['type'] = this.getSelectedValue(this.calcType);
    data['project'] = this.getSelectedValue(this.calcProject);
    data['zadanie'] = this.getSelectedValue(this.calcZadanie);
    data['area'] = areaInput ? parseFloat(areaInput.value) || 0 : 0;

    totalCost = data['area'] * this.getRate(data['area']) * this.calcValues.type[data['type']];

    // console.log('Данные:', data);

    if (!data['area'] || data['type'] === '') {
      this.validate = false;
      this.totalTime.textContent = `-`;
      this.totalResult.innerHTML = `<span class="anim-count" to="0">0</span> руб`;
    } else {
      this.validate = true;
      this.totalTime.textContent = `${this.getTimeRate(data['area'])} дней`;
      this.totalResult.innerHTML = `~ <span class="anim-count" to="${Math.round(totalCost)}">${this.prevValue}</span> руб`;

      this.prevValue = Math.round(totalCost);
    }

    this.animCounters();

    this.data = data;
  }

  onSubmitForm = (e) => {
    // e.preventDefault();

    if (this.validate) {
      const totalCost = this.totalResult.textContent.replace(/\D/g, '');

      const dataString = encodeURIComponent(JSON.stringify(this.data));

      const params = new URLSearchParams({
        total: totalCost,
        data: dataString,
      });

      const url = `/local/templates/video/include/modals/calc-result.php?${params.toString()}`;

      Fancybox.close();

      setTimeout(() => {
        Fancybox.show([{
          src: url,
          type: 'ajax'
        }]);

        Fancybox.getInstance().on('reveal', (fancybox, slide) => {
          this.onCallbackFormOpen(fancybox);
        });

      }, 100);

      return;

    }

  }

  onCallbackFormOpen = (fancybox) => {
    setTimeout(() => {
      const {name, tel, agree} = validateFormsRules;
      const callbackModalFormRules = [name , tel, agree];
      validateForms('.fancybox__content#callback-modal .callback-modal__form', callbackModalFormRules, [], validateFormsAfterSubmit, validateFormsGlobalConfig);
    }, 100);
  }

  formattedNumber = (number) => {
    return number.toLocaleString("ru-RU");
  }

  getRate = (area) => {
    if (area <= 100) return 200;
    if (area <= 500) return 180;
    if (area <= 1000) return 160;
    if (area <= 3000) return 140;
    return 120;
  }
  getTimeRate = (area) => {
    if (area <= 100) return '17-20';
    if (area <= 500) return '25-30';
    if (area <= 1000) return '30-40';
    if (area <= 3000) return '45-60';
    return 120;
  }

  animCounters = () => {
    this.counters = this.form.querySelectorAll('.anim-count');

    this.counters.forEach( counter => {
      const animate = () => {
          const value = +counter.getAttribute('to');
          const data = +counter.innerText;

          const time = value / this.speed;
        if(data < value) {
          counter.innerText = Math.ceil(data + time);
          setTimeout(animate, 1);
        }else{
          counter.innerText = value;
        }
      }

      animate();
    });
  }
}

const Calc = new AfCalc(document.querySelector('.calc__form'));
const CalcModal = new AfCalc(document.querySelector('#calc-modal .calc__form'));
