import jwt from 'jsonwebtoken'; 
import { authRepository } from '../repositories/auth.repository.js';
import dotenv from 'dotenv';

dotenv.config();

export async function signUp(req, res) {
    const { user } = res.locals;

    try {
        await authRepository.insertUser(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(422);
    }
    return res.sendStatus(201);
}

export async function signIn(req, res) {
    
    const { user } = res.locals;
    try {
        const { rows: session } =
            await authRepository.findSession(user.id);
        if (!session[0]) {
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: 60 * 60 * 24 * 30 });
            
            await authRepository.insertSession(token, user.id);
            return res.status(200).
                send({ token: token });
        }
        return res.status(200).
            send({ token: session[0].token });
    } catch (error) {
        console.log(error);
        return res.sendStatus(422);
    }

}