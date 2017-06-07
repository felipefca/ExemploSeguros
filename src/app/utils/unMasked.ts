import { FormGroup } from '@angular/forms';
import { StringUtils } from "app/utils/string.utils";

export class UnMasked {

    public static unMaskFormComponents(container: FormGroup): void {
        for (let controlKey in container.controls) {
            if (controlKey === "cep" || controlKey === "rg" || controlKey === "telefone" || controlKey === "cpf" || controlKey === "odometro" || controlKey === "cepPernoite") {
                let valueControl = container.controls[controlKey].value;

                if (!StringUtils.isNullOrEmpty(valueControl))
                    container.controls[controlKey].setValue(this.clearMaskControls(valueControl.toString()))
            }
        }
    }

    public static clearMaskControls(value: string): string {
        let newValue = value.replace(/\D/g, '');
        return newValue;
    }
}