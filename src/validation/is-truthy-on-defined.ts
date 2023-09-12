import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export default function IsTruthyOnDefined(
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isTruthyOnDefined',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const hasValue = !!value;
          return value === undefined ? true : hasValue;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not be empty`;
        },
      },
    });
  };
}
