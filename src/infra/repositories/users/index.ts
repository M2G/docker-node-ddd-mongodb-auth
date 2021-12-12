/*eslint-disable*/
import { IRead, IWrite } from '../../../core/IRepository';
import toEntity from './transform';
import { cleanData } from '../../../interfaces/http/utils';
import IUser from '../../../core/IUser';

export default ({ model, jwt }: any) => {

  const getAll = (...args: any[]) => {
    const m :IRead<any> = model;
    return m
      .find(...args)
      .select('-password -__v')
      .sort({ username: 1 })
      .then((entity: any) =>
        entity?.map((data: {}) => data))
      .catch((error: any) => {
        throw new Error(error);
      });
  }

  const register = async (...args: any[]) => {

    try {

      const [{ ...params }] = args;
      const m :IWrite<any> = model;

      return await m.create({ ...params });

    } catch (error) {

      throw new Error(error);

    }
  };




  const forgotPassword = async (...args: any[]) => {

    const [{ ...params }] = args;

    console.log('--------', args);

    const { ...data }: any = await findOne(params);

    console.log('forgotPassword', cleanData(data));

    const { _id, email, password } = <IUser>data;
    const payload = { _id, email, password };
    const options = { subject: email, audience: [], expiresIn: 60 * 60 };

    // if user is found and password is right, create a token
    const token: string = jwt.signin(options)(payload);

    console.log('token token token', token);
    update({
      _id,
      reset_password_token: token,
      reset_password_expires: Date.now() + 86400000
    });


  }

  const resetPassword = (...args: any[]) => {}

  const findOne = (...args: any[]) => {
    const m :IRead<any> = model;
    const [{ ...params }] = args;
    return m
      .findOne({ ...params })
      .select('-password -__v')
      .then((data: any) => toEntity(data))
      .catch((error: string | undefined) => {
        console.log('catch', error)
        throw new Error(error);
      });
  }

  const remove = (...args: any) => {
    const m :IWrite<any> = model;
    const [{ ...params }] = args;
    return m
      .findByIdAndDelete({ ...params })
      .select('-password -__v')
      .then((data: any) => toEntity(data))
      .catch((error: string | undefined) => {
        throw new Error(error);
      });
  }

  const update = (...args: any) => {
    const m :IWrite<any> = model;
    const [{ _id, ...params }] = args;

    console.log('UPDATE ----->', { _id, ...params });

    if (params.password) delete params.password;

    return m
      .findByIdAndUpdate(
        { _id } as any,
        { ...params },
        { upsert: true, new: true })
      .select('-password -__v')
      .then((data: any) => {
        return toEntity(data)
      })
      .catch((error: string | undefined) => {
        throw new Error(error);
      });
  }

  const authenticate = async (...args: any[]) => {


    try {

      const [{ ...params }] = args;
      const m :IRead<any> = model;

      const user = await m.findOne({ ...params });

      if (!user) return null;
      return toEntity(user);

    } catch (error) {

      throw new Error(error);

    }
  };

  return {
    remove,
    update,
    findOne,
    authenticate,
    resetPassword,
    forgotPassword,
    getAll,
    register,
  };
};
