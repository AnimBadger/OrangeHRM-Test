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

  static generateEmail(): string {
    return faker.internet.email().toLowerCase();
  }

  static generatePhoneNumber(): string {
    return faker.phone.number();
  }
}
