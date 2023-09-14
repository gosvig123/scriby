interface SliderProps {
  hours: number;
  setHours: (hours: number) => void;
}
export default function ButtonCounter({ hours, setHours }: SliderProps) {
  return (
    <div className='bg-white flex p-1 justify-center rounded-xl items-center mb-8'>
      <button onClick={() => setHours(hours - 1 < 1 ? 1 : hours - 1)} className='bg-gray-200 rounded-lg w-9 h-9'>
        -
      </button>
      <p className=' ml-3 font-mono h-full mr-3'>{hours}</p>
      <button onClick={() => setHours(hours + 1)} className=' w-9 h-9 text-white pBackground rounded-lg'>
        +
      </button>
      <p className='ml-3'>Hours</p>
    </div>
  );
}
