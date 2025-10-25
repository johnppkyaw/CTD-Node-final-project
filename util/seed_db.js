const Resident = require("../models/Resident");
const User = require("../models/User");
const faker = require("@faker-js/faker").fakerEN_US;
const FactoryBot = require("factory-bot");
require("dotenv").config();

const testUserPassword = faker.internet.password();
const factory = FactoryBot.factory;
const factoryAdapter = new FactoryBot.MongooseAdapter();
factory.setAdapter(factoryAdapter);

factory.define("resident", Resident, {
  firstName: () => faker.person.firstName(),
  middleName: () => faker.person.middleName(),
  lastName: () => faker.person.lastName(),
  gender: () => ["male", "female"][Math.floor(2 * Math.random())],
  dateOfBirth: () => faker.date.between({ from: '1920-01-01T00:00:00.000Z', to: '1960-01-01T00:00:00.000Z' }),
  status: () => ['active', 'discharged', 'hospitalized'][Math.floor(3 * Math.random())],
  hospice: () => faker.datatype.boolean({ probability: 0.5 }),
  roomNumber: faker.number.int({ min: 1, max: 50 })
});

factory.define("user", User, {
  name: () => faker.person.fullName(),
  email: () => faker.internet.email(),
  password: () => faker.internet.password(),
});

const seed_db = async () => {
  let testUser = null;
  try {
    const mongoURL = process.env.MONGO_URI_TEST;
    await Resident.deleteMany({}); // deletes all job records
    await User.deleteMany({}); // and all the users
    testUser = await factory.create("user", { password: testUserPassword });
    await factory.createMany("resident", 20, { createdBy: testUser._id }); // put 30 job entries in the database.
  } catch (e) {
    console.log("database error");
    console.log(e.message);
    throw e;
  }
  return testUser;
};

module.exports = { testUserPassword, factory, seed_db };
