<template>
  <el-container class="popBox" id="popBox-demo" v-if="popup">
    <div class="popBox-mask"></div>
    <el-container class="popBox-content">
      <el-header height="50px">
        <h1 style="font-size: xx-large">NFA的生成过程</h1>
        <i class="el-icon-close btn-close" @click="hidePopBox" style="font-size: x-large">关闭</i>
      </el-header>
      <div style="padding-left: 25px;">
        <div class="left">
          <p style="font-size: xx-large">基础的NFA</p>
          <el-row v-for="item in basicNFA">
            <el-col>
              <p style="font-size:large">{{treeArray[item].str}}:</p>
            </el-col>
            <el-col>
              <div class="mynetwork0"></div>
            </el-col>
          </el-row>
        </div>
        <div class="center">
          <div style="width: 100%">
            <div style="font-size: xx-large">正则表达式:</div>
            <div>
              <p v-for="item in input" style="font-size: xx-large">{{item}}</p>
            </div>
          </div>
          <p id="secTitle" style="font-size: x-large"></p>
          <div id="mynetwork1"></div>
          <span>
            <button class="button" @click="lastone" :disabled="counter<=0">
              <img src="static/img/arrow_back_24.png" />
            </button>
            <button class="button" @click="nextone" :disabled="counter>=maxStep">
              <img src="static/img/arrow_forward_24.png" />
            </button>
          </span>
        </div>
        <div class="right">
          <p style="font-size: xx-large">已完成的NFA</p>
          <el-row v-for="item in counter">
            <el-col>
              <p style="font-size:large">{{treeArray[item+buttonLength-1].str}}:</p>
            </el-col>
            <el-col>
              <div class="mynetwork2"></div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-container>
  </el-container>
</template>

<script>
import { DataSet, Network } from "vis";
import { createNodes, createEdges } from "../../api/vis_api";

export default {
  data() {
    return {
      popup: false,
      hasbegin: false,
      secTitle: "",
      counter: 0,
      maxStep: 0,
      basicNFA: [],
      buttonLength: 0,
      input: []
    };
  },

  props: ["treeArray", "RE"],

  /* mounted () {
      this.counter=0;
      var tree=this.treeArray;
      for(let i=0;i<tree.length;++i)
        if(tree[i].leftId!=-1||tree[i].rightId!=-1){
          this.buttonLength=i;
          break;
        }
      for(let i=0;i<this.buttonLength;++i){
        var isRepeat=false
        for(let j=0;j<i;++j){
          if(tree[i].str==tree[j].str){
            isRepeat=true;
            break;
          }
        }
        if(isRepeat==false){
          this.basicNFA.push(i);
        }
      }
      this.maxStep=tree.length-this.buttonLength-1;
    }, */

  methods: {
    //显示弹框
    showPopBox() {
      this.popup = true;
      this.input = this.RE.split("\n");
      this.leftNFA();
      this.updateSecTitle();
      this.$nextTick(function() {
        this.leftDiv();
        this.centerDiv();
      });
    },
    //关闭弹框
    hidePopBox() {
      this.popup = false;
    },
    lastone() {
      this.counter--;
    },
    nextone() {
      this.counter++;
    },
    leftNFA() {
      this.counter = 0;
      this.basicNFA.length = 0;
      var tree = this.treeArray;
      console.log("tree:");
      console.log(tree);
      for (let i = 0; i < tree.length; ++i)
        if (tree[i].leftId != -1 || tree[i].rightId != -1) {
          this.buttonLength = i;
          break;
        }
      for (let i = 0; i < this.buttonLength; ++i) {
        var isRepeat = false;
        for (let j = 0; j < i; ++j) {
          if (tree[i].str == tree[j].str) {
            isRepeat = true;
            break;
          }
        }
        if (isRepeat == false) {
          this.basicNFA.push(i);
        }
      }
      this.maxStep = tree.length - this.buttonLength - 1;
    },
    updateSecTitle() {
      this.secTitle = "第" + (this.counter + 1) + "步   生成";
      this.secTitle += this.treeArray[this.buttonLength + this.counter].str;
      this.secTitle += "的NFA";
      this.$nextTick(function() {
        document.getElementById("secTitle").innerHTML = this.secTitle;
      });
    },
    centerDiv() {
      var NFAdata = this.treeArray[this.buttonLength + this.counter].NFA;
      var edges = new DataSet(
        createEdges(NFAdata.stateTransitionArray, NFAdata.alphabet, false)
      );
      var nodes = new DataSet(
        createNodes(
          NFAdata.stateTransitionArray,
          NFAdata.acceptStateList,
          NFAdata.alphabet
        )
      );
      console.log("nodes", nodes);

      var options = {
        nodes: {
          color: {
            background: "white",
            highlight: {
              border: "rgba(139,183,233,1)",
              background: "white"
            }
          },
          //shape: 'dot',
          size: 30,
          font: {
            size: 18
          },
          borderWidth: 1
        },
        edges: {
          color: {
            color: "#2b7ce9"
          },
          font: {
            size: 35,
            align: "top"
          },
          smooth: {
            type: "continuous",
            roundness: 0.5,
            forceDirection: "none"
          }
        },
        autoResize: true,
        height: "100%",
        width: "100%",
        clickToUse: true,
        layout: {
          hierarchical: {
            // enabled: true,
            // direction: 'LR', // UD, DU, LR, RL
            // sortMethod: 'directed' // hubsize, directed
            enabled: true,
            direction: "LR"
          }
        },
        physics: {
          enabled: false
        }
      };
      var container = document.getElementById("mynetwork1");
      var data = { nodes: nodes, edges: edges };
      console.log(data);
      var network = new Network(container, data, options);
    },
    leftDiv() {
      var objs = document.getElementsByClassName("mynetwork0");
      var options = {
        nodes: {
          color: {
            background: "white",
            highlight: {
              border: "rgba(139,183,233,1)",
              background: "white"
            }
          },
          //shape: 'dot',
          size: 30,
          font: {
            size: 18
          },
          borderWidth: 1
        },
        edges: {
          color: {
            color: "#2b7ce9"
          },
          font: {
            size: 20,
            align: "top"
          },
          smooth: {
            type: "continuous",
            roundness: 0.5,
            forceDirection: "none"
          }
        },
        autoResize: true,
        height: "100%",
        width: "100%",
        clickToUse: true,
        layout: {
          hierarchical: {
            // enabled: true,
            // direction: 'LR', // UD, DU, LR, RL
            // sortMethod: 'directed' // hubsize, directed
            enabled: true,
            direction: "LR",
            levelSeparation: 100
          }
        },
        physics: {
          enabled: false
        }
      };
      for (let i = 0; i < objs.length; i++) {
        objs[i].id = "mynetwork0" + i;
        var NFAdata = this.treeArray[this.basicNFA[i]].NFA;
        var edges = new DataSet(
          createEdges(NFAdata.stateTransitionArray, NFAdata.alphabet, false)
        );
        var nodes = new DataSet(
          createNodes(
            NFAdata.stateTransitionArray,
            NFAdata.acceptStateList,
            NFAdata.alphabet
          )
        );

        var container = document.getElementById(objs[i].id);
        var data = { nodes: nodes, edges: edges };
        var network = new Network(container, data, options);
      }
    },
    rightDiv: function() {
      var objs = document.getElementsByClassName("mynetwork2");
      var options = {
        nodes: {
          color: {
            background: "white",
            highlight: {
              border: "rgba(139,183,233,1)",
              background: "white"
            }
          },
          //shape: 'dot',
          size: 30,
          font: {
            size: 18
          },
          borderWidth: 1
        },
        edges: {
          color: {
            color: "#2b7ce9"
          },
          font: {
            size: 20,
            align: "top"
          },
          smooth: {
            type: "continuous",
            roundness: 0.5,
            forceDirection: "none"
          }
        },
        autoResize: true,
        height: "100%",
        width: "100%",
        clickToUse: true,
        layout: {
          hierarchical: {
            // enabled: true,
            // direction: 'LR', // UD, DU, LR, RL
            // sortMethod: 'directed' // hubsize, directed
            enabled: true,
            direction: "LR",
            levelSeparation: 100
          }
        },
        physics: {
          enabled: false
        }
      };
      for (let i = 0; i < objs.length; i++) {
        objs[i].id = "mynetwork2" + i;
        var NFAdata = this.treeArray[this.buttonLength + i].NFA;
        var edges = new DataSet(
          createEdges(NFAdata.stateTransitionArray, NFAdata.alphabet, false)
        );
        var nodes = new DataSet(
          createNodes(
            NFAdata.stateTransitionArray,
            NFAdata.acceptStateList,
            NFAdata.alphabet
          )
        );

        var container = document.getElementById(objs[i].id);
        var data = { nodes: nodes, edges: edges };
        var network = new Network(container, data, options);
      }
    }
  },

  watch: {
    counter: function() {
      this.updateSecTitle();
      this.$nextTick(function() {
        this.centerDiv();
        this.rightDiv();
      });
    }
  }
};
</script>

<style scoped>
.el-header {
  text-align: center;
}

.el-header h1 {
  font-size: large;
  color: #756c83;
}

.close {
  text-align: center;
  line-height: 40px;
}

.el-icon-close {
  cursor: pointer;
}

.el-icon-close:hover {
  color: #ef5f65;
}
.popBox-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0.6;
  z-index: 999;
  background-color: #000;
}
.popBox-content {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
}
/*各个弹框下的样式可以自己更改*/
#popBox-demo .popBox-content {
  width: 1800px;
  height: 10000px;
  background-color: #fff;
  text-align: center;
  max-height: 750px;
  overflow-y: auto;
}

#popBox-demo .btn-close {
  position: absolute;
  top: 10px;
  right: 10px;
}
.mynetwork0 {
  width: 225px;
  height: 100px;
  border: 1px solid lightgray;
  margin: auto;
}
#mynetwork1 {
  width: 875px;
  height: 500px;
  border: 1px solid lightgray;
  margin: auto;
}
.mynetwork2 {
  width: 575px;
  height: 100px;
  border: 1px solid lightgray;
  margin: auto;
}
.left {
  width: 250px;
  height: 10000px;
  float: left;
  border: 1px solid #c0c0c0;
  max-height: 680px;
  overflow-y: auto;
}
.center {
  width: 900px;
  height: 10000px;
  float: left;
  border: 1px solid #c0c0c0;
  max-height: 680px;
  overflow-y: auto;
}
.right {
  width: 600px;
  height: 10000px;
  float: left;
  border: 1px solid #c0c0c0;
  max-height: 680px;
  overflow-y: auto;
}
.button {
  background: rgba(0, 0, 0, 0.3);
  width: 3rem;
  height: 3rem;
  outline: none;
  margin: 0;
  position: relative;
  z-index: 5;
}
.button:disabled {
  opacity: 0.6;
  background: rgba(0, 0, 0, 0.3);
}
.button:hover:after {
  opacity: 1; /*鼠标放上时透明度为完全显示*/
  z-index: 1000;
}
</style>
