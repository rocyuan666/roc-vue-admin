<template>
  <div class="app-container">
    <p>代码编辑</p>
    <codemirror v-model="code" :options="cmOptions" />
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
// 引入样式
import 'codemirror/lib/codemirror.css'
// 引入主题 可以从 codemirror/theme/ 下引入多个
import 'codemirror/theme/idea.css'
import 'codemirror/theme/lesser-dark.css'
// 引入语言模式 可以从 codemirror/mode/ 下引入多个
import 'codemirror/mode/sql/sql.js'
import 'codemirror/mode/javascript/javascript.js'
export default {
  name: 'CodeEdit',
  components: {
    codemirror
  },
  data() {
    return {
      code: '',
      cmOptions: {
        // codemirror options
        tabSize: 2,
        mode: 'text/javascript',
        theme: 'lesser-dark',
        lineNumbers: true,
        line: true
        // more codemirror options, 更多 codemirror 的高级配置...
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
