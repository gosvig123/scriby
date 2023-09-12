import Header from '@/components/Header';
import ProfileSettings from '@/components/settings';
interface IUser {
  email: string;
  userId: number;
  iat: number;
}

interface settingsProps {
  user: IUser;
}

const settings = ({ user }: settingsProps) => {
  return (
    <div>
      <Header user={user} />
      <ProfileSettings />
    </div>
  );
};
import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies';
import { ENCRYPTION_KEY } from '../../constants';
import decrypt from '../../lib/jwt/cryptography/decryption';

export const getServerSideProps: GetServerSideProps = async (
  context
) => {
  try {
    const cookies = parseCookies(context);
    const encryptedToken = cookies.token;

    if (!encryptedToken) {
      return {
        redirect: {
          destination: '/signup',
          permanent: false,
        },
      };
    }

    const decryptedToken = decrypt(
      encryptedToken,
      Buffer.from(await ENCRYPTION_KEY)
    );

    const SECRET = process.env.JWT_SECRET;

    if (!SECRET) {
      throw new Error('No JWT secret found');
    }

    const decoded = jwt.verify(decryptedToken, SECRET);

    return {
      props: { user: decoded }, // The decoded user data
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);

    return {
      redirect: {
        destination: '/', // Redirect to login page if an error occurs
        permanent: false,
      },
    };
  }
};

export default settings;
