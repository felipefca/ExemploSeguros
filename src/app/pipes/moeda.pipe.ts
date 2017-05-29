import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "moeda"
})
export class MoedaPipe implements PipeTransform {

    transform(value: number): string {
        let newValue = value;
        return newValue.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }
}