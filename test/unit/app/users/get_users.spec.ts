import getUsecase from  '../../../../src/app/users/get';

describe('App -> User -> Post', () => {
  let useCase: { all: () => Promise<void> };
  const mockData = [{
    username: 'test',
    password: 'test',
  }]

  describe('Success path', () => {
    beforeEach(() => {

      const MockRepository = {
        getAll: () => mockData
      }

      useCase = getUsecase({
        usersRepository: MockRepository
      })
    })

    it('should display all the user on success', async () => {
      const lists = await useCase.all();
      expect(lists).toEqual(mockData);
    })
  })

  describe('Fail path', () => {
    beforeEach(() => {
      const MockRepository = {
        getAll: () => Promise.reject('Error')
      }

      useCase = getUsecase({
        usersRepository: MockRepository
      })
    })

    it('should display error on rejection', async () => {

      let error
      try {
        await useCase.all()
      } catch (e) {
        error = e.message
      }
      expect(error).toEqual('Error')
    })
  })

})
