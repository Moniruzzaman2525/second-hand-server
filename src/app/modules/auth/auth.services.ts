import mongoose from "mongoose";
import { TUser, TUserLogin } from "./auth.interface";
import { AuthUser } from "./auth.model";
import AppError from "../../error/AppError";
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../../config";
import { createToken } from "./auth.utils";


const createUserIntoDB = async (payload: TUser) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const existingUser = await AuthUser.isUserExistsByEmail(payload.email);
        if (existingUser) {
            throw new AppError(400, 'User with this email already exists!');
        }

        const newUser = await AuthUser.create([payload], { session });
        if (!newUser) {
            throw new AppError(400, 'Failed to create user!');
        }

        const userObj = newUser[0].toObject()
        const jwtPayload = {
            email: userObj.email,
            role: userObj.role as string
        };

        const accessToken = createToken(
            jwtPayload,
            config.jwt_access_secret as string,
            config.jwt_access_expires_in as string
        );

        const refreshToken = createToken(
            jwtPayload,
            config.jwt_refresh_secret as string,
            config.jwt_refresh_expires_in as string
        );
        await session.commitTransaction();
        await session.endSession();
        return { accessToken, refreshToken };

    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(400, error.message || 'Error occurred during registration');
    }
};

// login user services
const loginUserServices = async (payload: TUserLogin) => {
    const user = await AuthUser.isUserExistsByEmail(payload.email)
    if (!user) {
        throw new AppError(404, 'This user is not found !')
    }
    const passMatch = await AuthUser.isPasswordMatch(payload.password, user.password)

    if (!passMatch) {
        throw new AppError(403, 'Invalid credentials')
    }

    const isBlocked = user.isBlocked
    if (isBlocked) {
        throw new AppError(403, 'This user is blocked !')
    }

    // create token and sent to the user
    const jwtPaylod = {
        email: user.email,
        role: user.role as string
    }

    const accessToken = createToken(jwtPaylod, config.jwt_access_secret as string, config.jwt_access_expires_in as string)
    const refreshToken = createToken(jwtPaylod, config.jwt_refresh_secret as string, config.jwt_refresh_expires_in as string)

    return { accessToken, refreshToken }

}

// refresh token services
const refreshToken = async (token: string) => {

    const decoded = jwt.verify(token, config.jwt_refresh_secret as string) as JwtPayload

    const { email, iat } = decoded;
    const user = await AuthUser.isUserExistsByEmail(email);

    if (!user) {
        throw new AppError(404, 'This user is not found !');
      }

      if (user?.isBlocked) {
        throw new AppError(401, 'This user is blocked !');
      }

    const jwtPayload = {
        email: user.email,
        role: user.role as string,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    );

    return {
        accessToken,
    };
};


export const authUserServices = {
    createUserIntoDB,
    loginUserServices,
    refreshToken
}
