<template>
  <div class="echarts-container">
    <div class="personalCenter-container">
      <el-tabs
        v-model="activeName"
        :tab-position="tabPosition"
        @tab-click="handleClick"
      >
        <el-tab-pane label="台风" name="台风"></el-tab-pane>
        <el-tab-pane label="暴雨" name="暴雨"></el-tab-pane>
        <el-tab-pane label="地震" name="地震"></el-tab-pane>
      </el-tabs>
    </div>
    <el-row :gutter="20">
      <!-- <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
        <el-card shadow="hover">
          <div slot="header">柱状图</div>
          <div>
            <vab-chart autoresize :options="chart1" />
          </div>
        </el-card>
      </el-col> -->
      <!-- <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
        <el-card shadow="hover">
          <div slot="header">环形图</div>
          <div>
            <vab-chart
              ref="myCircle"
              theme="vab-echarts-theme"
              :options="chart2"
              class="my-circle"
            />
          </div>
        </el-card>
      </el-col> -->
      <!-- <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
        <el-card shadow="hover">
          <div slot="header">关系图</div>
          <div>
            <vab-chart
              ref="myLine1"
              theme="vab-echarts-theme"
              autoresize
              :options="chart3"
              class="my-line1"
            />
          </div>
        </el-card>
      </el-col> -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="card" shadow="never">
          <div slot="header">
            <span>中国地图</span>
          </div>
          <vab-chart
            :autoresize="true"
            theme="vab-echarts-theme"
            :options="zgdt"
          />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="card" shadow="never">
          <div slot="header">
            <span>世界地图</span>
          </div>
          <vab-chart
            :autoresize="true"
            theme="vab-echarts-theme"
            :options="sjdt"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import * as echarts from "echarts";
  import VabChart from "@/plugins/echarts";
  import {
    getEarthQuakeData,
    getTyphoonData,
    getStormData,
  } from "@/api/getMapData";

  export default {
    name: "Echarts",
    components: {
      VabChart,
    },
    data() {
      return {
        tabPosition: "top",
        activeName: "地震", //默认首次进入就是地震页面
        totalCount: null,

        //中国地图
        zgdt: {
          title: {
            text: "2020-国内微博总量",
            subtext: "该数据爬取自微博(Sina Weibo)",
          },
          tooltip: {
            trigger: "item",
          },
          dataRange: {
            orient: "horizontal",
            min: 0,
            max: 55000,
            text: ["高", "低"],
            splitNumber: 0,
          },
          series: [
            {
              name: "2020年全国微博总量",
              type: "map",
              roam: false,
              mapType: "china",
              mapLocation: {
                x: "center",
              },
              selectedMode: "multiple",
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                },
                emphasis: {
                  label: {
                    show: true,
                  },
                },
              },
              data: null,
            },
          ],
        },
        //世界地图
        sjdt: {
          title: {
            text: "2020-世界微博总量",
            subtext: "该数据爬取自微博(Sina Weibo)",
          },
          dataRange: {
            orient: "horizontal",
            min: 0,
            max: 55000,
            text: ["高", "低"],
            splitNumber: 0,
          },
          tooltip: {
            trigger: "item",
            formatter: "{b}",
          },
          series: [
            {
              name: "2020年世界微博总数",
              type: "map",
              mapType: "world",
              selectedMode: "multiple",
              roam: false,
              label: {
                normal: {
                  show: false,
                },
                emphasis: {
                  show: true,
                },
              },
              data: [{ name: "China", value: 99999, selected: true }],
            },
          ],
        },
      };
    },
    mounted() {},
    created() {
      this.fetchEarthQuakeData(); //默认先拿地震数据
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
        if (tab.name == "台风") {
          // 触发台风
          this.taiFeng();
        } else if (tab.name == "地震") {
          // 触发地震
          this.diZhen();
        } else if (tab.name == "暴雨") {
          // 触发暴雨
          this.baoYu();
        } else {
          // 触发疫情
          this.yiQing();
        }
      },
      diZhen() {
        console.log("这是地震");
        this.fetchEarthQuakeData();
      },
      taiFeng() {
        console.log("这是台风");
        this.fetchTyphoonData();
      },
      baoYu() {
        console.log("这是暴雨");
        this.fetchStormData();
      },

      async fetchEarthQuakeData() {
        this.listLoading = true;
        const { data } = await getEarthQuakeData();
        this.zgdt.series[0].data = data;
        setTimeout(() => {
          this.listLoading = false;
        }, 300);
      },
      async fetchTyphoonData() {
        this.listLoading = true;
        const { data } = await getTyphoonData();
        this.zgdt.series[0].data = data;
        setTimeout(() => {
          this.listLoading = false;
        }, 300);
      },
      async fetchStormData() {
        this.listLoading = true;
        const { data } = await getStormData();
        this.zgdt.series[0].data = data;
        setTimeout(() => {
          this.listLoading = false;
        }, 300);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .echarts {
    width: 100%;
  }
</style>
