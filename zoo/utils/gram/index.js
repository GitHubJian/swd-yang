class Gram {
  constructor(canvas, opts = {}) {
    this.canvas = canvas
    this.opts = opts

    this.ability = opts.ability || []
    this.style = opts.style
  }

  print() {
    let [name, value] = this.ability.reduce(
      (prev, [k, v]) => {
        prev[0].push(k)
        prev[1].push(v)

        return prev
      },
      [[], []]
    )

    let ctx = this.canvas.getContext('2d')
    ctx.canvas.width = window.innerWidth * 0.7
    ctx.canvas.height = window.innerHeight * 0.7

    let width = ctx.width,
      height = ctx.height,
      xCenter = width * 0.5,
      yCenter = height * 0.5
  }
}
