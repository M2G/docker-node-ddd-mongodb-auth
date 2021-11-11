/* eslint-disable*/
import bcrypt from 'bcrypt';
import Status from 'http-status';
import { Router, Request, Response } from 'express';
import IUser from '../../../../core/IUser';

export default ({
  jwt,
  postUseCase,
  logger,
  response: { Success, Fail },
}: any) => {

  const router = Router();

  router.post('/', (req: Request, res: Response) => {
    const { body } = req || {};
    const { password, email } = <IUser>body;

    if (!email || !password) {
      return res.status(Status.UNPROCESSABLE_ENTITY).json(Fail('Empty value.'));
    }

    postUseCase
      .authenticate({ email })
      .then(async (data: any) => {

        console.log('postUseCase authenticate', data)

        const { _id, email, username, password } = <IUser>data || {};

        if (!email) {
          return res.status(Status.NOT_FOUND).json(Fail(`User not found (email: ${email})`));
        }

        console.log('body.password', body.password)
        console.log('password', password)

          const match: boolean = await bcrypt.compare(body.password, password);

        console.log('match', match)

          if (match) {

            const payload = <IUser>{ _id, username, password, email };

            const options = { subject: email, audience: [], expiresIn: 60 * 60 };

            // if user is found and password is right, create a token
            const token: string = jwt.signin(options)(payload);

            logger.info({ token });
            return res.status(Status.OK).json(
              Success({
                success: true,
                token: token,
              }));
          }

          return res.status(Status.UNAUTHORIZED).json(Fail('Wrong username and password combination.'));

      })
      .catch((error: { message: any }) => {
        logger.error(error);
        res.status(Status.INTERNAL_SERVER_ERROR).json(Fail(Status[Status.INTERNAL_SERVER_ERROR]));
      });
  });

  return router;
};
