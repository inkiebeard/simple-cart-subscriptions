import jwt, { Secret } from 'jsonwebtoken';
import User from './models/User';
import { hashing } from './utils';
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './types';

export const middleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).send('Unauthorized');
        return;
    }
    const decoded = await decode(token);
    if (!decoded) {
        res.status(401).send('Unauthorized');
        return;
    }
    req = req as AuthRequest
    req.user = decoded;
    next();
}

export const decode = async (token: string) => {
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET as Secret);
        return decoded;
    } catch (err) {
        return null;
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // todo: sort persistence fetch something like Users.find({ where: { email } }) for real data
    const user = new User(email, "Test User", false, { displayName: "Test", avatar: "" }, "FAKEDHASH", "FAKEDSALT");

    if (!user) {
        res.status(401).send('Unauthorized');
        return;
    }
    const { hash: storedHash, salt: storedSalt } = user;
    const result = await hashing.compare(password, storedHash, storedSalt);
    if (!result) {
        res.status(401).send('Unauthorized');
        return;
    }
    const token = await jwt.sign({ user: User.present(user) }, process.env.JWT_SECRET as Secret);
    res.send({ token });
}

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const { hash: passHash, salt } = await hashing.hash(password);
  const user = new User(
    email,
    name,
    false,
    { displayName: name, avatar: "" },
    passHash, 
    salt 
  );
  res.send({ user: User.present(user) });
}

export default {
  middleware,
  decode,
  login,
}