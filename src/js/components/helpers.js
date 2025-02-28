export const selectOptions = {
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
      optionGroupListing: "form-optionGroup-listing",
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
      })
    },
    afterChange: (newVal, select) => {
      if (newVal == 'other') {
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
        const newInput = label.querySelector('input');

        newInput.focus();
        select.originalSelect.remove();
      }
    }
  }
};
