function polygon(obj, side, part, ability_value, ability_name) {
  var ability = obj.getContext('2d')
  ability.canvas.width = window.innerWidth * 0.7
  ability.canvas.height = window.innerWidth * 0.7
  var width = obj.width
  var height = obj.height
  var xCenter = width * 0.5
  var yCenter = height * 0.5
  var radius = width * 0.3
  var space = radius / part
  var theta = (Math.PI * 2) / side

  //绘制渐变多边形底层
  for (var j = part; j >= 1; j--) {
    ability.beginPath()
    for (var i = 0; i <= side; i++) {
      ability.lineTo(
        Math.cos(i * theta) * space * j + xCenter,
        -Math.sin(i * theta) * space * j + yCenter
      )
    }
    var r = 73,
      g = 101,
      b = 115
    ability.fillStyle = 'rgba(' + 73 + ',' + 101 + ',' + 115 + ',' + 0.4 + ')'
    ability.fill()
    ability.closePath()
  }

  //绘制能力多边形
  ability.beginPath()
  for (var i = 0; i <= side; i++) {
    var x = Math.cos(i * theta) * radius * ability_value[i % side] + xCenter
    var y = -Math.sin(i * theta) * radius * ability_value[i % side] + yCenter
    ability.lineTo(x, y)
  }
  ability.strokeStyle = 'rgba(255,255,96,1)'
  ability.lineWidth = 4
  ability.stroke()
  ability.closePath()

  //绘制字体
  for (var i = 0; i < side; i++) {
    ability.fillStyle = 'rgba(0,0,0,1)'
    ability.font = 'normal 15px Microsoft Yahei'
    if (Math.cos(i * theta) * radius > 0) {
      var x = Math.cos(i * theta) * radius + 3 + xCenter
      var y = -Math.sin(i * theta) * radius * 1.3 + yCenter
    } else {
      var x = Math.cos(i * theta) * radius * 1.5 + xCenter
      var y = -Math.sin(i * theta) * radius * 1.3 + yCenter
    }
    ability.fillText(ability_name[i], x, y)
  }
}
