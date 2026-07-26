import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchFieldsValidator(
  firstControlName: string,
  secondControlName: string,
): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const firstValue = form.get(firstControlName)?.value;
    const secondValue = form.get(secondControlName)?.value;

    return firstValue === secondValue ? null : { passwordMismatch: true };
  };
}
