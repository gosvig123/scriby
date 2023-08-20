import { GoogleLogin as GoogleLoginButton } from 'react-google-login';

const clientId =
  '358155175620-tmo0ped23qte9gpnv4dovqr1i6tj11r6.apps.googleusercontent.com';

function GoogleLogin() {
  const onSuccess = async (response: any) => {
    try {
      const userObj = response.profileObj;

      const signupResponse = await fetch('/api/signup', {
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
        // Handle successful signup logic here (e.g., redirect to dashboard, set user in state, etc.)
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const onFailure = (response: any) => {
    console.log(response);
  };
  return (
    <div id='signInButton' className='-w-full'>
      <GoogleLoginButton
        className='w-full h-10  mb-5  rounded-lg shadow-lg GoogleButton border-2 border-black'
        clientId={clientId}
        onSuccess={onSuccess}
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
            Sign up with Google
          </button>
        )}
      />
    </div>
  );
}

export default GoogleLogin;
