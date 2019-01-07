<template>
  <div>
    <canvas id="polygon"></canvas>
  </div>
</template>

<script>
export default {
  name: "SwdGram",
  data() {
    return {};
  },
  mounted() {
    this.print();
  },
  methods: {
    print() {
      function polygon(obj, side, part, ability_value, ability_name) {
        var ability = obj.getContext("2d");
        ability.canvas.width = window.innerWidth;
        ability.canvas.height = window.innerWidth;
        var width = obj.width;
        var height = obj.height;
        var xCenter = width * 0.5;
        var yCenter = height * 0.5;
        var radius = width * 0.3;
        var space = radius / part;
        var theta = (Math.PI * 2) / side;

        //绘制渐变多边形底层
        for (var j = part; j >= 1; j--) {
          ability.beginPath();
          for (var i = 1; i <= side; i++) {
            ability.lineTo(
              Math.cos(Math.PI / 2 + (i - 1) * theta) * space * j + xCenter,
              -Math.sin(Math.PI / 2 + (i - 1) * theta) * space * j + yCenter
            );
          }

          ability.fillStyle =
            "rgba(" + 73 + "," + 101 + "," + 115 + "," + 0.4 + ")";
          ability.fill();
          ability.closePath();
          ability.stroke();
        }

        //绘制能力多边形
        ability.beginPath();
        for (var i = 1; i <= side; i++) {
          var x =
            Math.cos(Math.PI / 2 + (i - 1) * theta) *
              radius *
              ability_value[i - 1] +
            xCenter;
          var y =
            -Math.sin(Math.PI / 2 + (i - 1) * theta) *
              radius *
              ability_value[i - 1] +
            yCenter;

          ability.lineTo(x, y);
        }

        ability.strokeStyle = "rgba(255,255,96,1)";
        ability.lineWidth = 2;
        ability.closePath();
        ability.stroke();

        //绘制字体
        for (var i = 1; i <= side; i++) {
          ability.fillStyle = "rgba(0,0,0,1)";
          ability.font = "normal 15px Microsoft Yahei";
          let flag = Math.cos(i * theta) * radius > 0;
          debugger;
          switch (i) {
            case 1:
              var x = xCenter - 12;
              var y =
                -Math.sin(Math.PI / 2 + (i - 1) * theta) * radius -
                12 +
                yCenter;
              break;
            case 2:
              var x =
                Math.cos(Math.PI / 2 + (i - 1) * theta) * radius -
                12 -
                24 -
                6 +
                xCenter;
              var y =
                -Math.sin(Math.PI / 2 + (i - 1) * theta) * radius + 6 + yCenter;
              break;
            case 3:
              var x =
                Math.cos(Math.PI / 2 + (i - 1) * theta) * radius -
                12 -
                6 +
                xCenter;
              var y =
                -Math.sin(Math.PI / 2 + (i - 1) * theta) * radius +
                24 +
                yCenter;
              break;
            case 4:
              var x =
                Math.cos(Math.PI / 2 + (i - 1) * theta) * radius - 12 + xCenter;
              var y =
                -Math.sin(Math.PI / 2 + (i - 1) * theta) * radius +
                24 +
                yCenter;
              break;
            case 5:
              var x =
                Math.cos(Math.PI / 2 + (i - 1) * theta) * radius + 12 + xCenter;
              var y =
                -Math.sin(Math.PI / 2 + (i - 1) * theta) * radius + 6 + yCenter;
              break;
          }

          ability.fillText(ability_name[i - 1], x, y);
        }
      }

      var hex = document.getElementById("polygon");

      var ability_value = new Object();
      var ability_name = new Object();
      //设置能力值
      ability_value[0] = 0.8;
      ability_value[1] = 0.5;
      ability_value[2] = 0.7;
      ability_value[3] = 0.6;
      ability_value[4] = 0.5;
      // ability_value[5] = 0.7;
      //设置能力属性名
      ability_name[0] = "物理";
      ability_name[1] = "魔法";
      ability_name[2] = "韧性";
      ability_name[3] = "敏捷";
      ability_name[4] = "防御";
      // ability_name[5] = "智力";
      polygon(hex, 5, 5, ability_value, ability_name);
    }
  }
};
</script>

<style>
</style>
