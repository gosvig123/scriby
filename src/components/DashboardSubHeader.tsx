export default function DashboardSubHeader() {
  //TODO get user minutes
  return (
    <div className='w-full flex flex-auto px-5 '>
      <div className='w-full gap-5   bg-white text-center items-center px-4 py-4 flex flex-auto justify-between rounded-lg shadow-lg'>
        <h1 className='text-2xl font-mono font-bold'>Dashboard</h1>
        <p className='text-lg '>
          You currently have x minutes remaining.
        </p>
        <button className='solidGreenButton'>Buy Credits</button>
      </div>
    </div>
  );
}
