import faker from 'faker';
import getUsecase from  '../../../../src/app/users/get';

describe('App -> User -> Get All', () => {
  const randomEmail = faker.internet.email();
  const randomUserName = faker.internet.userName();
  const randomPassword = faker.internet.password();
  let useCase: { all: () => Promise<void> };
  const mockData = [{
    email: randomEmail,
    username: randomUserName,
    password: randomPassword,
  }]

  describe('Success path', () => {
    beforeEach(() => {

      const MockRepository = {
        getAll: () => mockData
      }

      const MockRedis = {
        get: () => mockData
      }

      useCase = getUsecase({
        usersRepository: MockRepository,
        redis: MockRedis
      })
    });

    it('should display all the user on success', async () => {
      const lists = await useCase.all();
      expect(lists).toEqual(mockData);
    })
  });

  describe('Fail path', () => {
    beforeEach(() => {
      const MockRepository = {
        getAll: () => Promise.reject('Error'),
      }
      const MockRedis = {
        get: () => Promise.reject('Error'),
      }

      useCase = getUsecase({
        usersRepository: MockRepository,
        redis: MockRedis
      })
    })

    it('should display error on rejection', async () => {

      let error;
      try {
        await useCase.all();
      } catch (e) {
        error = e.message;
      }
      expect(error).toEqual('Error');
    })
  })

})
