<template>
  <div>
    <div class="index-container">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
          <el-card shadow="never">
            <div slot="header">
              <span>全国各月地震灾害数量</span>
            </div>
            <vab-chart
              :autoresize="true"
              theme="vab-echarts-theme"
              :options="fwl"
            />
            <div class="bottom">
              <span>
                月均地震灾害数量:
                <vab-count
                  :start-val="config1.startVal"
                  :end-val="config1.endVal"
                  :duration="config1.duration"
                  :separator="config1.separator"
                  :prefix="config1.prefix"
                  :suffix="config1.suffix"
                  :decimals="config1.decimals"
                />
              </span>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
          <el-card shadow="never">
            <div slot="header">
              <span>柱状图</span>
            </div>
            <vab-chart
              :autoresize="true"
              theme="vab-echarts-theme"
              :options="zzt"
            />
            <div class="bottom">
              <span>
                柱状图总数:
                <vab-count
                  :start-val="config2.startVal"
                  :end-val="config2.endVal"
                  :duration="config2.duration"
                  :separator="config2.separator"
                  :prefix="config2.prefix"
                  :suffix="config2.suffix"
                  :decimals="config2.decimals"
                />
              </span>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-card shadow="never">
            <div slot="header">
              <span>词云</span>
            </div>
            <vab-chart
              :autoresize="true"
              theme="vab-echarts-theme"
              :options="cy"
              @zr:click="handleZrClick"
              @click="handleClick"
            />
            <div class="bottom">
              <span>
                词云数量:
                <vab-count
                  :start-val="config3.startVal"
                  :end-val="config3.endVal"
                  :duration="config3.duration"
                  :separator="config3.separator"
                  :prefix="config3.prefix"
                  :suffix="config3.suffix"
                  :decimals="config3.decimals"
                />
              </span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 这里开始放表格 -->
    <div class="table-container">
      <vab-query-form>
        <!-- 左选择框体 -->
        <vab-query-form-left-panel>
          <el-button type="info" plain>华西</el-button>
          <el-button type="danger" plain>华北(东北)</el-button>
          <el-button type="warning" plain>华中</el-button>
          <el-button type="primary" plain>华东</el-button>
          <el-button type="success" plain @click="handleSouth">华南</el-button>
          <el-button type="success" plain>特别行政区</el-button>
        </vab-query-form-left-panel>
        <!--右选择框体-->
        <vab-query-form-right-panel>
          <el-form
            ref="form"
            :model="queryForm"
            :inline="true"
            @submit.native.prevent
          >
            <el-form-item>
              <el-input v-model="queryForm.province" placeholder="省份" />
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-search"
                type="primary"
                native-type="submit"
                @click="handleQuery"
              >
                查询
              </el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>

      <el-table
        v-loading="listLoading"
        :data="list"
        :element-loading-text="elementLoadingText"
        @selection-change="setSelectRows"
      >
        <el-table-column
          show-overflow-tooltip
          type="selection"
          width="55"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="编号"
          prop="number"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="市级地区"
          prop="city"
          sortable
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="县级地区"
          prop="area"
          sortable
        ></el-table-column>
        <!-- 地区具有对应颜色 -->
        <el-table-column show-overflow-tooltip label="地区">
          <template slot-scope="scope">
            <el-tooltip
              :content="scope.row.province"
              class="item"
              effect="dark"
              placement="top-start"
            >
              <el-tag :type="scope.row.province | provinceFilter">
                {{ scope.row.province }}
              </el-tag>
            </el-tooltip>
          </template>
        </el-table-column>

        <!--时间-->
        <el-table-column
          show-overflow-tooltip
          label="时间"
          prop="time"
          width="200"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="info"
          label="内容简介"
          width="300"
        ></el-table-column>
      </el-table>
      <el-pagination
        :background="background"
        :current-page="queryForm.pageNo"
        :layout="layout"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
    <!-- 表格结束 -->
  </div>
</template>

<script>
  import VabChart from "@/plugins/echarts";
  import { dependencies, devDependencies } from "../../../package.json";
  import { getclList } from "@/api/changeLog";
  import { getNoticeList } from "@/api/notice";
  import { getRepos, getStargazers } from "@/api/github";
  import { getList, doDelete, getList1, getLine1 } from "@/api/table";

  export default {
    name: "Index",
    components: {
      VabChart,
    },
    filters: {
      //表格要用的过滤器: 主要是针对返回内容的状态（status），更改对应组件的格式
      statusFilter(status) {
        const statusMap = {
          //创建一个map，key-value的对应格式，对应status对应格式
          published: "success",
          draft: "danger",
          deleted: "danger",
        };
        return statusMap[status];
      },
      provinceFilter(province) {
        const provinceMap = {
          //创建一个map，key-value的对应格式，对应province所在的地区
          //华北+东北
          北京市: "danger",
          天津省: "danger",
          河北省: "danger",
          山西省: "danger",
          内蒙古自治区: "danger",
          辽宁省: "danger",
          吉林省: "danger",
          黑龙江: "danger",

          //华东
          上海市: "primary",
          江苏省: "primary",
          浙江省: "primary",
          安徽省: "primary",
          福建省: "primary",
          江西省: "primary",
          山东省: "primary",

          //华中
          河南省: "warning",
          湖北省: "warning",
          湖南省: "warning",

          //华西
          重庆市: "info",
          四川省: "info",
          贵州省: "info",
          云南省: "info",
          西藏自治区: "info",
          新疆维吾尔自治区: "info",
          宁夏回族自治区: "info",
          青海省: "info",
          甘肃省: "info",
          陕西省: "info",

          //华南
          广东省: "success",
          广西省: "success",
          海南: "success",

          //特别行政区
          香港: "success",
          澳门: "success",
          台湾: "success",
        };
        return provinceMap[province];
      },
    },
    data() {
      return {
        //表格数据
        list: [],
        dataList: [],
        line: [],
        line1X: [],
        line1Y: [],
        listLoading: true,
        layout: "total, sizes, prev, pager, next, jumper",
        total: 0,
        background: true,
        selectRows: "",
        elementLoadingText: "正在加载...",
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          province: "", //限定想要搜索的标题内容
        },
        querySouth: {
          pageNo: 1,
          pageSize: 20,
          provinceList: ["广东省", "广西省", "海南市"],
        },

        //图表数据：动态显示
        timer: 0,
        updateTime: process.env.VUE_APP_UPDATE_TIME,
        nodeEnv: process.env.NODE_ENV,
        dependencies: dependencies,
        devDependencies: devDependencies,
        config1: {
          startVal: 0,
          endVal: 0, //平均数
          decimals: 0,
          prefix: "",
          suffix: "",
          separator: ",",
          duration: 8000,
        },
        config2: {
          startVal: 0,
          endVal: 2000,
          decimals: 0,
          prefix: "",
          suffix: "",
          separator: ",",
          duration: 8000,
        },
        config3: {
          startVal: 0,
          endVal: this.$baseLodash.random(1000, 20000),
          decimals: 0,
          prefix: "",
          suffix: "",
          separator: ",",
          duration: 8000,
        },

        //访问量
        fwl: {
          grid: {
            top: "4%",
            left: "2%",
            right: "4%",
            bottom: "0%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              boundaryGap: false,
              data: [],
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: "value",
            },
          ],
          series: [
            {
              name: "全国各月地震灾害数量",
              type: "line",
              data: [],
              smooth: true,
              areaStyle: {},
            },
          ],
        },
        //柱状图
        zzt: {
          grid: {
            top: "4%",
            left: "2%",
            right: "4%",
            bottom: "0%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              /*boundaryGap: false,*/
              data: ["0时", "4时", "8时", "12时", "16时", "20时", "24时"],
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: "value",
            },
          ],
          series: [
            {
              name: "授权数",
              type: "bar",
              barWidth: "60%",
              data: [10, 52, 20, 33, 39, 33, 22],
            },
          ],
        },
        //词云
        cy: {
          grid: {
            top: "4%",
            left: "2%",
            right: "4%",
            bottom: "0%",
          },
          series: [
            {
              type: "wordCloud",
              gridSize: 15,
              sizeRange: [12, 40],
              rotationRange: [0, 0],
              width: "100%",
              height: "100%",
              textStyle: {
                normal: {
                  color() {
                    const arr = [
                      "#1890FF",
                      "#36CBCB",
                      "#4ECB73",
                      "#FBD437",
                      "#F2637B",
                      "#975FE5",
                    ];
                    let index = Math.floor(Math.random() * arr.length);
                    return arr[index];
                  },
                },
              },
              data: [
                {
                  name: "地震",
                  value: 15000,
                },
                {
                  name: "汶川",
                  value: 10081,
                },
                {
                  name: "猪坚强",
                  value: 9386,
                },

                {
                  name: "救援",
                  value: 6500,
                },
                {
                  name: "众志成城",
                  value: 6000,
                },
                {
                  name: "可乐男孩",
                  value: 4500,
                },
                {
                  name: "大爱无疆",
                  value: 3800,
                },
                {
                  name: "背妻男",
                  value: 3000,
                },
                {
                  name: "范跑跑",
                  value: 2500,
                },
                {
                  name: "捐款",
                  value: 2300,
                },
                {
                  name: "庐山地震",
                  value: 2000,
                },
                {
                  name: "广州地震",
                  value: 1900,
                },
                {
                  name: "唐山",
                  value: 1800,
                },
                {
                  name: "雄起",
                  value: 1700,
                },
                {
                  name: "坚强",
                  value: 1600,
                },
                {
                  name: "感恩",
                  value: 1500,
                },
                {
                  name: "自救知识",
                  value: 1200,
                },
                {
                  name: "小学",
                  value: 1100,
                },
                {
                  name: "中央指示",
                  value: 900,
                },
                {
                  name: "救援队伍",
                  value: 800,
                },
                {
                  name: "感动人心",
                  value: 700,
                },
                {
                  name: "联合国卫生组织致辞",
                  value: 800,
                },
                {
                  name: "你捐了吗",
                  value: 9000,
                },
                {
                  name: "灾难",
                  value: 9200,
                },
              ],
            },
          ],
        },

        //更新日志
        reverse: true,
        activities: [],
        noticeList: [],
        //其他信息
        userAgent: navigator.userAgent,
      };
    },
    created() {
      /* this.fetchData(); */
      this.fetchTableData(); //查询表格数据
      this.fetchLineData();
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
    mounted() {
      /* let base = +new Date(2020, 1, 1);
        let oneDay = 24 * 3600 * 1000;
        let date = []; //创建日期数组

        let data = [Math.random() * 1500];
        let now = new Date(base);

        const addData = (shift) => {
          now = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/");
          date.push(now);
          data.push(this.$baseLodash.random(20000, 60000));

          if (shift) {
            //数据相应的也平移
            date.shift();  //移除第一个值
            data.shift();
          }
          now = new Date(+new Date(now) + oneDay);
        };

        for (let i = 1; i < 6; i++) {
          //间隔3秒转移到新的数据
          addData();
        }
        addData(true);
        this.fwl.xAxis[0].data = date; //横轴赋值为新的日期数据
        this.fwl.series[0].data = data; //纵轴赋值为新的量值数据
        this.timer = setInterval(() => {
          addData(true);
          this.fwl.xAxis[0].data = date; //添加横轴数据
          this.fwl.series[0].data = data; //添加纵轴数据
        }, 3000); */
    },
    methods: {
      setSelectRows(val) {
        //表格方法：整理行
        this.selectRows = val;
      },
      //表格两个change函数
      handleSizeChange(val) {
        this.queryForm.pageSize = val;
        this.fetchTableData();
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val;
        this.fetchTableData();
      },
      handleQuery() {
        //表格方法：查询
        this.queryForm.pageNo = 1;
        this.fetchTableData();
      },

      handleClick(e) {
        this.$baseMessage(`点击了${e.name},这里可以写跳转`);
      },
      handleZrClick(e) {},
      handleChangeTheme() {
        this.$baseEventBus.$emit("theme");
      },
      async fetchData() {
        const { data } = await getList();
        data.map((item, index) => {
          if (index === data.length - 1) {
            item.color = "#0bbd87";
          }
        });
        this.activities = data;
        const res = await getNoticeList();
        this.noticeList = res.data;
        /* getRepos({
          token: "1061286824f978ea3cf98b7b8ea26fe27ba7cea1",
        }).then((res) => {
          const per_page = Math.ceil(res.data.stargazers_count / 100);
          alert(per_page);
          getStargazers({
            token: "1061286824f978ea3cf98b7b8ea26fe27ba7cea1",
            page: 1,
            per_page: res.per_page,
          }).then((res) => {
            alert(JSON.stringify(res));
          });
        }); */
      },
      async fetchLineData() {
        //查询赋值给折线图
        const { data } = await getLine1();
        this.line = data;
        let sumx = 0;
        for (let i = 0; i < this.line.length; i++) {
          //提取所有name值并赋值给x轴
          let a = this.line[i].name;
          this.line1X.push(a);
        }
        for (let j = 0; j < this.line.length; j++) {
          //提取所有value值并赋值给y轴
          let b = this.line[j].value;
          this.line1Y.push(b);
          sumx += this.line[j].value;
        }
        this.fwl.xAxis[0].data = this.line1X;
        this.fwl.series[0].data = this.line1Y;
        this.config1.endVal = Math.ceil(sumx / this.line.length);
      },

      async fetchTableData() {
        //表格的内容
        this.listLoading = true; //开启加载效果
        const { data, totalCount } = await getList1(this.queryForm); //网页测试数据

        this.dataList = data; //传输表格数据，所有数据给dataList
        this.total = totalCount;

        this.initData(); //调用生成数据的方法

        /* data.map((item, index) => {
            if (index === data.length - 1) {
              item.color = "#0bbd87";
            }
          });
          this.activities = data;
          const res = await getNoticeList();
          this.noticeList = res.data; */

        setTimeout(() => {
          this.listLoading = false;
        }, 500);
      },
      async initData() {
        //大神给的改写翻页和查询的方法
        let no = (this.queryForm.pageNo - 1) * this.queryForm.pageSize;
        let size = this.queryForm.pageNo * this.queryForm.pageSize;
        if (!this.queryForm.province) {
          this.list = this.dataList.slice(no, size);
        } else {
          let search = this.dataList.filter(
            (item) => item.province.indexOf(this.queryForm.province) >= 0
          );
          this.total = search.length;
          this.list = search.slice(no, size);
        }
      },
      handleSouth() {
        this.listLoading = true; //开启加载效果

        //开始处理数据
        let no = (this.queryForm.pageNo - 1) * this.queryForm.pageSize;
        let size = this.queryForm.pageNo * this.queryForm.pageSize;

        let search = this.dataList.filter(
          (item) =>
            item.province.indexOf(this.querySouth.provinceList.entries) >= 0
        );
        this.total = search.length;
        this.list = search.slice(no, size);

        setTimeout(() => {
          this.listLoading = false;
        }, 500);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .index-container {
    padding: 0 !important;
    margin: 0 !important;
    background: #f5f7f8 !important;

    ::v-deep {
      .el-alert {
        padding: $base-padding;

        &--info.is-light {
          min-height: 82px;
          padding: $base-padding;
          margin-bottom: 15px;
          color: #909399;
          background-color: $base-color-white;
          border: 1px solid #ebeef5;
        }
      }

      .el-card__body {
        .echarts {
          width: 100%;
          height: 125px;
        }
      }
    }

    .card {
      min-height: 400px;

      ::v-deep {
        .el-card__body {
          .echarts {
            width: 100%;
            height: 305px;
          }
        }
      }
    }

    .bottom {
      padding-top: 20px;
      margin-top: 5px;
      color: #595959;
      text-align: left;
      border-top: 1px solid $base-border-color;
    }

    .table {
      width: 100%;
      color: #666;
      border-collapse: collapse;
      background-color: #fff;

      td {
        position: relative;
        min-height: 20px;
        padding: 9px 15px;
        font-size: 14px;
        line-height: 20px;
        border: 1px solid #e6e6e6;

        &:nth-child(odd) {
          width: 20%;
          text-align: right;
          background-color: #f7f7f7;
        }
      }
    }

    .icon-panel {
      height: 100px;
      text-align: center;
      cursor: pointer;

      svg {
        font-size: 40px;
      }

      p {
        margin-top: 10px;
      }
    }

    .bottom-btn {
      button {
        margin: 5px 10px 15px 0;
      }
    }
  }
</style>
