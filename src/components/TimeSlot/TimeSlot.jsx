import './TimeSlot.css'

export default function TimeSlot({ time, available, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`time-slot ${selected ? 'is-selected' : ''}`}
      disabled={!available}
      onClick={() => onSelect(time)}
    >
      {time}
    </button>
  )
}
