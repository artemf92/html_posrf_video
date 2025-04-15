import JustValidate from 'just-validate';
import Inputmask from "../../../node_modules/inputmask/dist/inputmask.es6.js";

export const validateForms = (selector, rules, checkboxes = [], afterSend, globalConfig) => {
  const form = typeof selector === 'string' ? document.querySelector(selector) : selector;
  const telSelector = form?.querySelector('input[type="tel"]');

  if (!form) {
    console.error('Нет такого селектора!');
    return false;
  }

  if (!rules) {
    console.error('Вы не передали правила валидации!');
    return false;
  }

  const validation = new JustValidate(selector, globalConfig);

  if (telSelector) {
    const inputMask = new Inputmask('+7 (999) 999-99-99');
    inputMask.mask(telSelector);

    for (let item of rules) {
      if (item.tel) {
        validation.addField(telSelector, [
          ...item.rules,
          {
            rule: 'function',
            validator: function() {
              const phone = telSelector.inputmask.unmaskedvalue();
              return phone.length === 10;
            },
            errorMessage: item.telError
          }
        ]);
      } else {
        validation.addField(item.ruleSelector, item.rules);
      }
    }
  } else {
    for (let item of rules) {
      validation.addField(item.ruleSelector, item.rules);
    }
  }

  if (checkboxes.length) {
    for (let item of checkboxes) {
      validation.addRequiredGroup(
        item.selector,
        item.errorMessage
      );
    }
  }

  validation.onSuccess((ev) => {
    let formData = new FormData(ev.target);
    if (afterSend) {
      afterSend(formData);
    }

    // ev.currentTarget.submit(); // Если нужно отправить форму

    ev.target.reset();
  });
};
