<template>
  <div class="code">
    <div class="setting">
      <textarea id="editor1" name="editor1">
      </textarea>
    </div>
    <div v-if="!hasinput" @click="focusevent()"
      style="z-index:1;position:absolute;top:2px;left:40px;font-size:18px;font-family: Arial;color:#b4b7b9;">
      词法规则定义规范：<br />(Token类型=规则)<br /><br />例如：<br />
      T_DOUBLE=double<br />T_DO=do</div>
    <el-tooltip class="item" effect="dark" content="清空" placement="top">
      <button v-if="hasinput" class="resetbutton" @click="resetForm ('REForm')"><img
          src="static/img/reset.png" /></button>
    </el-tooltip>
  </div>
</template>

<script>
  import * as CodeMirror from 'codemirror/lib/codemirror'
  import '../../../static/codemirrorSetting/neat.css'// 白色朴素
  import '../../../static/codemirrorSetting/liquibyte.css'// 白色高亮
  import '../../../static/codemirrorSetting/cobalt.css'// 黑色朴素
  import 'codemirror/lib/codemirror.css'
  import 'codemirror/mode/javascript/javascript'
  import 'codemirror/mode/clike/clike'
  import 'codemirror/mode/go/go'
  import 'codemirror/mode/htmlmixed/htmlmixed'
  import 'codemirror/mode/http/http'
  import 'codemirror/mode/php/php'
  import 'codemirror/mode/python/python'
  import 'codemirror/mode/sql/sql'
  import 'codemirror/mode/vue/vue'
  import 'codemirror/mode/xml/xml'
  import 'codemirror/addon/scroll/simplescrollbars.css'
  import 'codemirror/addon/scroll/simplescrollbars'
  import 'codemirror/addon/fold/markdown-fold'
  import 'codemirror/mode/meta'
  import 'codemirror/addon/fold/foldgutter.css'
  import 'codemirror/addon/fold/foldcode'
  import 'codemirror/addon/fold/brace-fold'
  import 'codemirror/addon/selection/active-line'

  export default {
    data() {
      return {
        CodeMirrorEditor: null,
        hasinput: false
      }
    },

    mounted() {
      this.setmirror()
      let str = ''
      console.log('2018/7/6')
      if (str = localStorage.getItem('collectionToWatch')) {
        console.log(str)
        this.$nextTick(() => {
          this.showcode(str)
          localStorage.removeItem('collectionToWatch')
        })
      }
    },

    methods: {
      focusevent() {
        document.getElementsByClassName('CodeMirror-overlayscroll')[0].focus()
        console.log(11111)
      },
      transToSrc(name) {
        return 'assets/codemirror/mode/' + name + '/' + name + '.js'
      },
      setmirror() {
        let myTextarea = document.getElementById('editor1')
        this.CodeMirrorEditor = CodeMirror.fromTextArea(myTextarea, {
          theme: 'neat',
          lineNumbers: true,
          tabSize: 10,
          smartIndent: false,
          scrollbarStyle: 'overlay'
        })
        this.CodeMirrorEditor.on('change', () => {
          // 编译器内容更改事件
          this.$emit('reformchange', this.CodeMirrorEditor.getValue())
          if (this.CodeMirrorEditor.getValue() !== '') {
            this.hasinput = true
          } else {
            this.hasinput = false
          }
        })
        this.CodeMirrorEditor.setSize(300, window.innerHeight * 0.32)
      },
      resetForm(formName) {
        this.CodeMirrorEditor.setValue('')
      },
      showcode(str) {
        console.log('收到了')
        this.CodeMirrorEditor.setValue(str)
        this.$nextTick(() => {
          this.$emit('reformchange', this.CodeMirrorEditor.getValue())
        })
      }
    }

  }
</script>

<style scoped>
  .code {
    position: relative;
    margin: 0;
    width: auto;
    height: auto;
    background-color: rgb(255, 255, 255);
    border: 1px solid rgb(210, 210, 210);
    /*h1 {
    margin: 0;
  }*/
  }

  .resetbutton {
    position: absolute;
    right: 0px;
    top: 4.2px;
    cursor: pointer;
    width: 30px;
    height: 30px;
    border: none;
    background-color: #ffffff;
    outline: none;
    margin: 0;
    z-index: 5;
  }

  .setting {
    width: 93%;
    background-color: rgb(255, 255, 255);
  }
</style>
<style>
  .CodeMirror pre {
    font-size: 20px;
    font-family: Arial;
  }

  .CodeMirror {
    background: #ffffff00;
    z-index: 2;
  }
</style>