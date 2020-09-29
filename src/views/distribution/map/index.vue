<template>
  <div class="map-container">
    <div id="map" class="container"></div>
  </div>
</template>

<script>
  import axios from "axios";
  import * as mapv from "mapv"; //全部引入了

  export default {
    name: "Map",
    components: {},
    data() {
      return {
        testDataSet: [
          [116.31060211950484, 39.86465665074276],
          [116.3088593878534, 39.86424983775258],
          [116.30867972479656, 39.864746287179],
          [116.30844616282265, 39.86528410333738],
        ],
      };
    },
    created() {},
    mounted() {
      this.$nextTick(() => {
        const map = this.$baseMap();
        axios
          .get(
            "https://cdn.jsdelivr.net/npm/mapv@2.0.12/examples/data/od-xierqi.txt"
          )
          .then((rs) => {
            let data = [];
            let timeData = [];
            let coordinatesTest = [];
            rs = rs.data.split("\n");
            let maxLength = 0;
            for (let i = 0; i < rs.length; i++) {
              let item = rs[i].split(",");
              let coordinates = [];
              if (item.length > maxLength) {
                maxLength = item.length;
              }
              for (let j = 0; j < item.length; j += 2) {
                let x = (Number(item[j]) / 20037508.34) * 180;
                let y = (Number(item[j + 1]) / 20037508.34) * 180;
                y =
                  (180 / Math.PI) *
                  (2 * Math.atan(Math.exp((y * Math.PI) / 180)) - Math.PI / 2);
                if (x == 0 || y == NaN) {
                  continue;
                }
                coordinates.push([x, y]);
                timeData.push({
                  //多次将点放进一个array
                  geometry: {
                    type: "Point",
                    coordinates: [x, y],
                  },
                  count: 1,
                  time: j,
                });
              }
              data.push({
                geometry: {
                  type: "LineString",
                  coordinates: coordinates,
                },
              });
            }

            for (let k = 0; k < this.testDataSet.length; k++) {
              coordinatesTest.push({
                //多点测试
                geometry: {
                  type: "Point",
                  coordinates: this.testDataSet[k],
                },
              });
              console.log(this.testDataSet[k]);
            }
            let dataSetTest = new mapv.DataSet(coordinatesTest);
            let testOptions = {
              fillStyle: "rgba(255, 0, 0, 0.2)", //RBGA颜色
              globalCompositeOperation: "lighter",
              size: 10,
              /* animation: { 没懂拿来干嘛的，应该是一个渐进显示
                stepsRange: {
                  start: 0,
                  end: 100,
                },
                trails: 3,
                duration: 5,
              }, */
              draw: "simple",
            };

            let mapvLayer = new mapv.MaptalksLayer(
              "mapv1",
              dataSetTest,
              testOptions
            ).addTo(map);

            /* let dataSet = new mapv.DataSet(data);

            let options = {
              strokeStyle: "rgba(53,57,255,0.5)",
              // globalCompositeOperation: 'lighter',
              shadowColor: "rgba(53,57,255,0.2)",
              shadowBlur: 3,
              lineWidth: 3.0,
              draw: "simple",
            };

            let mapvLayer = new mapv.MaptalksLayer( //连线，横穿图层
              "mapv1",
              dataSet,
              options
            ).addTo(map); */

            var multipoint = new maptalks.MultiPoint( //talks官网方法，地图标注
              [
                [116.3088593878534, 39.86424983775258],
                [113.2759952545166, 23.117055306224895],
                [121.445, 31.213],
                [114.109, 22.544],
                [103.302, 31.243],
              ],
              {
                visible: true,
                editable: true,
                shadowBlur: 0,
                shadowColor: "blue",
                draggable: false,
                dragShadow: false, // display a shadow during dragging
                drawOnAxis: null, // force dragging stick on a axis, can be: x, y
              }
            );
            new maptalks.VectorLayer("vector", multipoint).addTo(map);

            let dataSet2 = new mapv.DataSet(timeData);

            let options2 = {
              fillStyle: "rgba(255, 250, 250, 0.2)", //RBGA颜色
              globalCompositeOperation: "lighter",
              size: 1.5,
              animation: {
                stepsRange: {
                  start: 0,
                  end: 100,
                },
                trails: 3,
                duration: 5,
              },
              draw: "simple",
            };

            let mapvLayer2 = new mapv.MaptalksLayer( //连线，横穿图层2
              "mapv2",
              dataSet2,
              options2
            ).addTo(map);

            /*  let drawOptions = {
              //点数据
              fillStyle: "rgba(255, 250, 250, 0.2)", // 填充颜色
              strokeStyle: "rgba(50, 50, 255, 0.8)", // 描边颜色，不传就不描边
              lineWidth: 3.0, // 描边宽度
              radius: 50, // 半径大小
              size: 1.5,
              unit: "px", // 半径对应的单位，px:默认值，屏幕像素单位,m:米,对应地图上的大约距离,18级别时候1像素大约代表1米
              draw: "simple", // 渲染数据方式, simple:普通的打点, [更多查看类参考](https://github.com/huiyan-fe/mapv/wiki/%E7%B1%BB%E5%8F%82%E8%80%83)
            };

            dataSet.push({
              geometry: {
                type: "Point",
                coordinates: [
                  {
                    lng: 116.46507, // 经度
                    lat: 39.929101, // 纬度
                    count: 10, // 当前点的权重值
                  },
                ],
              },
            });

            let dataPointSet = new mapv.DataSet(dataSet);

            var mapvLayer3 = new mapv.MaptalksLayer(
              "mapv3",
              dataPointSet,
              drawOptions
            ).addTo(map); */
          });
      });
    },
    methods: {},
  };
</script>

<style lang="scss" scoped>
  .map-container {
    .container {
      width: 100%;
      height: calc(100vh - 214px);
    }
  }
</style>
