import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export default function IsTruthy(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isTruthy',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return !!value;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not be empty`;
        },
      },
    });
  };
}
