import { validateForms } from '../functions/validate-forms.js';
import { isMobile, isTablet, isDesktop } from '../functions/check-viewport.js';
import { Fancybox } from '@fancyapps/ui';

export const globalConfig = {
  errorLabelStyle: {
    color: 'var(--color-red)',
    position: 'absolute',
    top: 'calc(100% + 5px)',
    left: '3px',
    color: 'var(--color-red)',
    fontSize: '8px',
    lineHeight: 1,
  },
  tooltip: isMobile() ? {
    position: 'top'
  } : false,
}

export const checkAgree = [
  {
    selector: "input[name=\"agree\"]",
    errorMessage: "Выберите чекбоксы",
  }
];

const rules = {
  name: {
    ruleSelector: '.input--name',
    rules: [
      {
        rule: 'minLength',
        value: 2
      },
      {
        rule: 'required',
        value: true,
        errorMessage: 'Заполните имя'
      }
    ]
  },
  tel: {
    ruleSelector: '.input--tel',
    tel: true,
    telError: 'Введите корректный телефон',
    rules: [
      {
        rule: 'required',
        value: true,
        errorMessage: 'Заполните телефон'
      }
    ]
  },
  typeObject: {
    ruleSelector: '.input--type',
    rules: [
      {
        rule: 'required',
        value: true,
        errorMessage: 'Тип объекта обязателен'
      },
    ]
  },
  quantity: {
    ruleSelector: '.input--quantity',
    rules: [
      {
        rule: 'required',
        value: true,
        errorMessage: 'Количество обязательно'
      },
    ]
  },
  agree: {
    ruleSelector: '.custom-checkbox__field',
    rules: [
      {
        rule: 'required',
        value: true,
        errorMessage: 'Необходимо согласие на обработку данных'
      }
    ]
  }
}

export const consultRules = [
  rules.name,
  rules.tel,
  rules.agree
];

export const aboutFormRules = [
  rules.name,
  rules.tel,
  rules.agree
];
export const callbackFormRules = [
  rules.name,
  rules.tel,
  rules.agree
];
export const callbackModalFormRules = [
  rules.name,
  rules.tel,
  rules.agree
];

export const afterSubmit = () => {
  Fancybox.show([{
    src: '#success-modal',
    type: 'inline'
  }]);
}

validateForms('.consult__form', consultRules, [], afterSubmit, globalConfig);
validateForms('.callback-modal__form', callbackFormRules, [], afterSubmit, globalConfig);
validateForms('#callback-choose .callback-modal__form', callbackFormRules, [], afterSubmit, globalConfig);
// validateForms('.about__form', aboutFormRules, [], afterSubmit, globalConfig);

window.validateForms = validateForms;
window.validateFormsRules = rules;
window.validateFormsAfterSubmit = afterSubmit;
window.validateFormsGlobalConfig = globalConfig;
