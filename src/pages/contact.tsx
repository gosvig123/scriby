import TypewriterComponent from '../components/Typewriter';
import Header from '../components/Header';
export default function Contact() {
  return (
    <div className='flex flex-col'>
      <Header />
      <div className='mx-auto'>
        <h1 className='purpleText text-5xl mt-10'>
          Got questions? drop us a line
        </h1>
      </div>
      <div className='mx-auto mt-10 bg-white w-4/5 rounded-lg flex flex-1 p-10 border shadow-xl'>
        <div
          className='w-full flex flex-col flex-1 rounded p-5'
          style={{ flexGrow: 0, flexShrink: 0, flexBasis: '50%' }}
        >
          <h2 className='text-lg font-bold mb-5'>Contact Us</h2>

          <form>
            <div className='my-5'>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700'
              >
                Name
              </label>
              <input
                type='text'
                id='name'
                className='mt-1 w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500'
              />
            </div>
            <div className='my-5'>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email
              </label>
              <input
                type='email'
                id='email'
                className='mt-1 w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500'
              />
            </div>
            <div className='my-5'>
              <label
                htmlFor='message'
                className='block text-sm font-medium text-gray-700'
              >
                Message
              </label>
              <textarea
                id='message'
                className='mt-1 w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500'
              />
            </div>
            <div className='my-5'>
              <button className='solidPurpleButton bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500'>
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className='flex-col max-w-lg ml-5  h-full flex  mt-5 items-center'>
          <TypewriterComponent
            baseText='We are here to help, just let us know how?'
            rotatingText={['']}
          />
        </div>
      </div>
    </div>
  );
}
