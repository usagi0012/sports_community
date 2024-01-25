// custom-validators.ts
import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from "class-validator";

@ValidatorConstraint({ name: "isFutureDate", async: false })
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
    validate(value: Date) {
        const currentDate = new Date();
        return value >= currentDate;
    }

    // Update the parameter type to ValidationArguments
    defaultMessage(validationArguments?: ValidationArguments): string {
        return `기간을 다시 입력해주세요`;
    }
}

export function IsFutureDate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsFutureDateConstraint,
        });
    };
}
