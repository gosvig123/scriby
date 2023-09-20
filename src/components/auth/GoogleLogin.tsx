import { useEffect } from 'react';
import { GoogleLogin as GoogleLoginButton } from 'react-google-login';
let gapi: any;
const clientId =
  '358155175620-tmo0ped23qte9gpnv4dovqr1i6tj11r6.apps.googleusercontent.com';


function GoogleLogin({ onSuccess }: any) {
  const handleSuccess = async (response: any) => {
    try {
      const userObj = response.profileObj;
      onSuccess(userObj.googleId); // pass googleId to parent's handleGoogleLogin


      // Try to login
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userObj.email,
          googleId: userObj.googleId,
        }),
      });

      if (loginResponse.ok) {
        // If login is successful, redirect to dashboard
        window.location.href = '/dashboard';
        return;
      }

      // If login failed, attempt to sign up
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userObj.email,
          googleId: userObj.googleId,
        }),
      });

      const data = await signupResponse.json();

      if (signupResponse.ok) {
        // If sign-up is successful, redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('gapi-script').then((module) => {
        gapi = module.gapi;
        gapi.load('client:auth2', () => {
          gapi.client.init({
            clientId: clientId,
            scope: '',
          });
        });
      });
    }
  }, []);




  const onFailure = (response: any) => {
    console.log(response);
  };
  return (
    <div id='signInButton' className='-w-full'>
      <GoogleLoginButton
        className='w-full h-10  mb-5  rounded-lg shadow-lg GoogleButton border-2 border-black'
        clientId={clientId}
        onSuccess={handleSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            className='w-full  mb-5 rounded-lg shadow-lg GoogleButton p-2  text-black  border-black flex justify-center border-2 mt-5 items-center'
          >
            <img
              src='/google_logo.png'
              alt='Google Logo'
              className='mr-2'
              width={30}
              height={30}
            />
            {window.location.pathname === '/signup' ? (
              <p>Sign up with Google</p>
            ) : (
              <p>Sign in with Google</p>
            )}
          </button>
        )}
      />
    </div>
  );
}

export default GoogleLogin;
