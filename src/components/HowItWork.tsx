
const HowItWork = () => {
  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 pt-[50px] text-center">
        <h2 className="headerClass ">HOW IT WORKS</h2>
        <p className="sub-title mb-16">
          WE MADE IT SIMPLE. YOU MAKE IT STYLISH.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-4">
            <h3 className="text-[22px] tracking-widest  font-inter uppercase">BOOK</h3>
            <p className="text-[14px] font-inter">
              Choose your size and rental dates and what&lsquo;s available instantly.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[22px] tracking-widest  font-inter uppercase">WEAR</h3>
            <p className="text-[14px] font-inter">
              Collect locally or enjoy fast delivery to your door your look, your way.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[22px] tracking-widest font-inter uppercase">RETURN</h3>
            <p className="text-[14px] font-inter">
              Drop it off or use the included return label. No stress, no dry cleaning.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWork
