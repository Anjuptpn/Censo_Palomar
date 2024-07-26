import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'extractWords',
    standalone: true
})

export class ExtractWords implements PipeTransform{

    transform(value: string, args: number): string {
        if (args === null || args === undefined){
            return value;
        } else {
            if (typeof(value) === 'string'){
                let position = -1;                
                let counter = 0;
                for (let i = 0; i < value.length; i++){
                    if (/\s/.test(value[i])){
                        counter++;
                        if (counter === args){
                            position = i;
                            break;
                        }
                    }
                }
                return position === -1 ? value : value.slice(0, position)+"...";

            } else {
                return value;
            }
        }
    }

}