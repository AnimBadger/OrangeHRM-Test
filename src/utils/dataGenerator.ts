import { faker } from '@faker-js/faker';
import type { Employee } from '@typedefs/index';

export class DataGenerator {
  static generateEmployee(): Employee {
    return {
      firstName: faker.person.firstName(),
      middleName: faker.person.middleName(),
      lastName: faker.person.lastName(),
      employeeId: faker.string.numeric(5),
    };
  }

  static generateRandomString(length = 10): string {
    return faker.string.alphanumeric(length);
  }

  static generatePassword(length = 10): string {
    const minLength = Math.max(length, 8);
    const base = faker.string.alphanumeric(minLength - 2);
    const digit = faker.string.numeric(1);
    const special = faker.string.fromCharacters('!@#$%^&*');
    return `${base}${digit}${special}`;
  }

  static generateEmail(): string {
    return faker.internet.email().toLowerCase();
  }

  static generatePhoneNumber(): string {
    return faker.phone.number();
  }
}
