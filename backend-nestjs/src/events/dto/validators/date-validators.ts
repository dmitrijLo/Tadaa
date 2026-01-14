import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsAfterToday(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAfterToday',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!(value instanceof Date)) return false;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return value > today;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be in the future`;
        },
      },
    });
  };
}

export function IsBeforeField(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBeforeField',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints as string[];
          const relatedValue: unknown = (
            args.object as Record<string, unknown>
          )[relatedPropertyName];

          if (!(value instanceof Date) || !(relatedValue instanceof Date)) {
            return true;
          }

          return value < relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints as string[];
          return `${args.property} must be before ${relatedPropertyName}`;
        },
      },
    });
  };
}

export function IsBetweenFields(
  afterProperty: string,
  beforeProperty: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBetweenFields',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [afterProperty, beforeProperty],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [afterProp, beforeProp] = args.constraints as string[];
          const afterValue: unknown = (args.object as Record<string, unknown>)[
            afterProp
          ];
          const beforeValue: unknown = (args.object as Record<string, unknown>)[
            beforeProp
          ];

          if (
            !(value instanceof Date) ||
            !(afterValue instanceof Date) ||
            !(beforeValue instanceof Date)
          ) {
            return true;
          }

          return value > afterValue && value < beforeValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [afterProp, beforeProp] = args.constraints as string[];
          return `${args.property} must be between ${afterProp} and ${beforeProp}`;
        },
      },
    });
  };
}
