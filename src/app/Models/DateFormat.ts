import { MatDateFormats } from '@angular/material/core';
export const CUSTOMIZE_DATE_FORMATS: MatDateFormats = {
    parse: {
      dateInput: 'DD/MM/YYYY',
    },
    display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    },
};

//El A11yLabel es el estándar de accesibilidad