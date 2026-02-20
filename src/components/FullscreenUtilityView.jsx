import f2 from '../assets/f2.png';

const FullscreenUtilityView = () => {

  return (
    <>
      <div className="flex m-4">
        <div className=''>
          <img src={f2} className="w-60 h-60 object-cover"></img>
          <div className='flex gap-2 items-center justify-between'>
            <div>
              like button
            </div>
            <div>
              controls (include play, pause, prev, next)
            </div>
            <div>
              more (clicking this overlays small box that gives options such as add to playlist, and other miscellaneous future options)
            </div>
          </div>
          <div>
            progress bar (for current song)
          </div>
          <div className='flex justify-between'>
            <div>shuffle</div>
            <div>repeat</div>
          </div>
        </div>

        <div className='flex-col'>
          <div id="small-horizontal-toggle-tab" className='flex gap-2'>
            <div>option 1: up-next/now-playing/queue</div>
            <div>option 2: lyrics</div>
          </div>
          <div>
            Actual big box for all the contents of each tab
            Example: Lyrics page with a small button at top right to switch language,
            list of the queueued songs,
            title details (like artist info) etc.
          </div>
        </div>
      </div>
    </>
  )
}

export default FullscreenUtilityView;