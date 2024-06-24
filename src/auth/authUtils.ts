import { ReferralOptions } from "global";
import { Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import prisma from "../app/api/_db/db";
import { generateReferalCode } from "../app/api/_utils/referralCode";
import loggerServer from "../loggerServer";
import { hash } from "bcrypt";
import { ObjectId } from "mongodb";
import { InvalidCredentialsError } from "../models/errors/InvalidCredentialsError";
import { UnknownUserError } from "../models/errors/UnknownUserError";
import UserAlreadyExistsError from "../models/errors/UserAlreadyExistsError";
import { cookies } from "next/headers";

const getReferralOptions = (): ReferralOptions => {
  const referralCode = cookies().get("referralCode")?.value;
  return {
    referralCode,
  };
};

const clearReferralCode = () => {
  cookies().set("referralCode", "", {
    expires: new Date(0),
  });
};

export const authorize = async (
  credentials: any & {
    email: string;
    password: string;
    displayName: string;
    isSignIn: string;
    referralCode: string;
  },
  req: any,
) => {
  if (!credentials) {
    throw new Error("Unknown errror");
  }

  const hashedPassword = await hash(credentials.password, 10);

  const user = await prisma.appUser.findFirst({
    where: {
      email: credentials.email,
    },
  });
  if (credentials.isSignIn === "true") {
    if (user) {
      const isValid = hashedPassword === user.password;
      if (!isValid) {
        throw new InvalidCredentialsError();
      }
      return user;
    } else {
      throw new UnknownUserError();
    }
  } else {
    if (user) {
      throw new UserAlreadyExistsError();
    }
    try {
      const newUser = await prisma.appUser.create({
        data: {
          displayName: credentials.displayName,
          email: credentials.email,
          password: hashedPassword,
          userId: new ObjectId().toHexString(),
        },
      });
      // set userId to be newUser.userId
      await prisma.appUser.update({
        where: {
          email: credentials.email,
        },
        data: {
          userId: newUser.id,
        },
      });
      const data: {
        userId: string;
        referralCode: string;
        options?: ReferralOptions;
      } = {
        userId: newUser.id,
        referralCode: generateReferalCode(newUser.id),
      };

      const referralOptions: ReferralOptions = getReferralOptions();
      data.options = referralOptions;

      const appUserMetadata = await prisma.appUserMetadata.create({
        data,
      });
      clearReferralCode();
      return { ...newUser, meta: appUserMetadata };
    } catch (e: any) {
      loggerServer.error("Error creating user", "new_user", { error: e });
      throw e;
    }
  }
};

export const getSession = async ({
  session,
  token,
  user,
}: {
  session: Session;
  token: JWT;
  user: AdapterUser;
}) => {
  let userInDB = await prisma.appUser.findFirst({
    where: {
      userId: token.sub,
    },
    include: {
      meta: true,
      settings: true,
    },
  });
  if (session?.user) {
    if (session?.user.image !== userInDB?.photoURL) {
      await prisma.appUser.update({
        where: {
          userId: token.sub,
        },
        data: {
          photoURL: session.user.image,
        },
      });
    }

    if (!session.user.meta) {
      session.user.meta = {
        referralCode: "",
        pushToken: "",
      };
    }
    session.user.userId = token.sub!;
    session.user.meta = {
      referralCode: userInDB?.meta?.referralCode || "",
    };
    session.user.settings = userInDB?.settings || {
      showNotifications: true,
    };
  }

  if (!session.user.meta.referralCode) {
    try {
      const referralCode = generateReferalCode(session.user.userId);
      await prisma.appUserMetadata.update({
        where: {
          userId: token.sub,
        },
        data: {
          referralCode,
        },
      });
      session.user.meta.referralCode = referralCode;
    } catch (e: any) {
      loggerServer.error("Error updating referral code", session.user.userId, {
        error: e,
      });
    }
  }
  session.user.role = userInDB?.role || "";
  return session;
};

export const signIn = async (session: any) => {
  try {
    let additionalUserData = {};
    let userInDB = await prisma.appUser.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        meta: true,
      },
    });

    if (!userInDB) {
      const referralOptions: ReferralOptions = getReferralOptions();
      const newUser = await prisma.appUser.create({
        data: {
          userId: session.user.id,
          email: session.user.email || "",
          photoURL: session.user.image || "",
          displayName: session.user.name || "",
          meta: {
            create: {
              referredBy: referralOptions.referralCode,
              referralCode: generateReferalCode(session.user.id),
            },
          },
          settings: {
            create: {
              showNotifications: true,
            },
          },
        },
      });
      additionalUserData = { ...newUser };
    }
    const userData = {
      ...session,
      ...additionalUserData,
      user: { ...session.user, role: userInDB?.role || "" },
    };
    return userData;
  } catch (e: any) {
    loggerServer.error("Error signing in", session.user.id, { error: e });
  }
};
