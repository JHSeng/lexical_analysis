<template>
  <!--v-if触发goto主函数里面的popup,才会显示页面-->
  <el-container class="popBox" id="popBox-demo" v-if="popup">
    <div class="popBox-mask"></div>
    <el-container class="popBox-content">
      <el-header>
        <h1 style="font-size: 3.5rem">连线练习</h1>
        <i class="el-icon-close btn-close" @click="hidePopBox" style="font-size: x-large">关闭</i>
      </el-header>
      <div style="font-size: 3rem">正则表达式：{{RE}}</div>
      <div class="main-content">
        <div id="elements">
          <div>
            <div id="description">说明：选择节点，在右边画板处任意位置点击鼠标即可新建节点。选择边，在右边画板处先后点击两个节点即可新建有向边。</div>
            <el-button class="element-button" @click="updateNodes">画节点</el-button>
            <el-button class="element-button" @click="updateEdges('ε')">画边 ε</el-button>
            <el-button
              class="element-button"
              @click="updateEdges(item)"
              v-for="item in unduplicated_edges"
            >画边 {{item}}</el-button>
          </div>
          <div>
            <el-button class="element-button" id="commit" @click="judge">提交</el-button>
          </div>
        </div>
        <div id="board"></div>
      </div>
    </el-container>
  </el-container>
</template>

<script>
import { DataSet, Network } from "vis";
import { createNodes, createEdges } from "../../api/vis_api";

export default {
  data() {
    //node_id用于接受点击节点返回的节点id
    return {
      popup: false,
      unduplicated_edges: [],
      nodes: [],
      edges: [],
      network: null
    };
  },
  props: ["treeArray", "RE"],
  methods: {
    showPopBox() {
      this.popup = true;

      // 清空数据
      this.unduplicated_edges = [];
      this.nodes = [];
      this.edges = [];

      // 记录不重复的叶子节点
      var tree = this.treeArray;
      for (let i = 0; i < tree.length; i++) {
        let node = tree[i];
        if (
          node.leftId == -1 &&
          node.rightId == -1 &&
          this.unduplicated_edges.indexOf(node.str) == -1
        ) {
          this.unduplicated_edges.push(node.str);
        }
        if (tree[i].leftId != -1 || tree[i].rightId != -1) break;
      }

      // 初始化
      this.nodes.push({
        id: -1,
        label: "",
        x: 0,
        y: 0,
        color: { border: "#ffffff" }
      });
      this.nodes.push({ id: 0, label: "0", x: 150, y: 0 });
      this.edges.push({ from: -1, to: 0, label: "Start" });
      this.$nextTick(function() {
        this.updateNetwork();
      });
    },

    hidePopBox() {
      this.popup = false;
    },

    updateNodes() {
      let nodes_length = this.nodes.length;
      var nodes = this.nodes;
      var network = this.network;
      var draw = this.updateNetwork;

      this.network.once("click", function(params) {
        console.log("params", params);
        if (!params.nodes[0]) {
          nodes.push({
            id: nodes_length - 1,
            label: (nodes_length - 1).toString(),
            x: params.pointer.canvas.x,
            y: params.pointer.canvas.y
          });
          // draw();
          network.body.data.nodes.add([nodes[nodes.length - 1]]);
          return;
        }
      });
    },

    updateEdges(label) {
      let edges_length = this.edges.length;
      var edges = this.edges;
      var network = this.network;
      var select_nodes = [];
      var draw = this.updateNetwork;
      this.network.on("click", function(params) {
        console.log("params nodes", params.nodes);
        if (params.nodes[0] != undefined) {
          console.log("click", params.nodes[0]);
          select_nodes.push(params.nodes[0]);
          if (select_nodes.length == 2) {
            console.log("select_nodes", select_nodes);
            edges.push({
              from: select_nodes[0],
              to: select_nodes[1],
              label: label
            });
            draw();
            // console.log(edges[edges.length - 1]);
            // network.body.data.edges.add([edges[edges.length - 1]]);
            return;
          }
        }
      });
    },

    updateNetwork() {
      console.log("edges", this.edges);
      var container = document.getElementById("board");
      var data = {
        nodes: new DataSet(this.nodes),
        edges: new DataSet(this.edges)
      };
      var options = {
        physics: {
          enabled: true
        },
        nodes: {
          color: {
            background: "white",
            highlight: {
              border: "rgba(139,183,233,1)",
              background: "white"
            }
          }
        },
        edges: {
          arrows: {
            to: { enabled: true, scaleFactor: 1, type: "arrow" }
          },
          color: {
            color: "#2b7ce9"
          },
          font: {
            size: 45,
            align: "top"
          },
          smooth: {
            type: "continuous",
            roundness: 0.5,
            forceDirection: "none"
          }
        }
      };
      console.log("new");
      this.network = new Network(container, data, options);
      console.log("over");
    },

    // 调用api判断提交结果是否正确
    judge() {}
  }
};
</script>

<style scoped>
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

.el-icon-close {
  cursor: pointer;
}

.el-icon-close:hover {
  color: #ef5f65;
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

.main-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

#elements {
  width: 15%;
  height: 90%;
  border: 1px solid #c0c0c0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

#description {
  font-size: 1.5rem;
  margin: 5px;
  text-align: left;
}

.element-button {
  background-color: #409ef4;
  color: #ffffff;
  width: 70%;
  margin: 10px auto 0 auto;
}

.element-button:hover {
  background: rgba(16, 106, 209, 0.8);
}

#commit {
  margin-bottom: 10px;
}

#board {
  width: 80%;
  height: 90%;
  border: 1px solid #c0c0c0;
}
</style>

