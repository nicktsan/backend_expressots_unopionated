import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from "class-validator";

export function IsNotZero(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: "isNotZero",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return typeof value === "number" && value !== 0;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} should not be equal to zero`;
                },
            },
        });
    };
}
