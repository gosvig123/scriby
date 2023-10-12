interface SliderProps {
  hours: number;
  setHours: (hours: number) => void;
}
export default function Slider({ hours, setHours }: SliderProps) {
  const handleSliderChange = (e: { target: { value: any } }) => {
    setHours(Number(e.target.value));
  };

  return (
    <input
      type='range'
      id='hours'
      name='hours'
      min='1'
      max='60'
      value={hours}
      onChange={handleSliderChange}
      className='slider'
      style={{
        background: `linear-gradient(90deg, #805AD5 ${
          (hours / 60) * 100
        }%, #E5E7EB ${(hours / 60) * 100}% 100%)`,
        backgroundImage: `-webkit-gradient(linear, left top, right top, color-stop(${
          (hours / 60) * 90
        }%, #805AD5), color-stop(${(hours / 60) * 100}%, #E5E7EB))`,
        backgroundSize: '100% 100%',
      }}
    />
  );
}

console.log('slider');