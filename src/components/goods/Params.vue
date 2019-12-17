<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！"
                type="warning"
                show-icon
                :closable="false">
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>请选择商品分类：</span>
          <!-- 选择商品分类的级联选择器 -->
          <el-cascader v-model="selectedKeys"
                       :options="cateList"
                       :props="cascaderProps"
                       @change="cateChange"
                       clearable></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs标签页区域 -->
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <!-- 添加动态参数的面版 -->
        <el-tab-pane label="动态参数"
                     name="many">
          <!-- 添加参数的按钮 -->
          <el-button type="primary"
                     size="mini"
                     :disabled="isBtnDisabled"
                     @click="showAddDialog">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="tableData"
                    border
                    stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag v-for="(item,i) in scope.row.attr_vals"
                        :key="i"
                        closable
                        @close="handleClose(i,scope.row)">{{item}}
                </el-tag>
                <!-- 输入的文本框 每个文本框各自的属性值 -->
                <el-input class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称"
                             prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini"
                           type="primary"
                           icon="el-icon-edit"
                           @click="showEditParams(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini"
                           type="danger"
                           icon="el-icon-delete"
                           @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面版 -->
        <el-tab-pane label="静态属性"
                     name="only">
          <!-- 添加参数的按钮 -->
          <el-button type="primary"
                     size="mini"
                     :disabled="isBtnDisabled"
                     @click="showAddDialog">添加参数</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="tableData"
                    border
                    stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag v-for="(item,i) in scope.row.attr_vals"
                        :key="i"
                        closable
                        @close="handleClose(i,scope.row)">{{item}}
                </el-tag>
                <!-- 输入的文本框 每个文本框各自的属性值 -->
                <el-input class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称"
                             prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini"
                           type="primary"
                           icon="el-icon-edit"
                           @click="showEditParams(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini"
                           type="danger"
                           icon="el-icon-delete"
                           @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加'+titleText"
               :visible.sync="addDialogVisible"
               @close="addDialogClose">
      <!-- 内容主体区域 -->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="100px">
        <el-form-item :label="titleText"
                      prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog :title="'修改'+titleText"
               :visible.sync="editDialogVisible"
               @close="editDialogClose">
      <!-- 内容主体区域 -->
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef"
               label-width="100px">
        <el-form-item :label="titleText"
                      prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
    <!--  -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 选中的父级分组ID数组
      selectedKeys: [],
      // 商品分类列表
      cateList: [],
      // 配置选项
      cascaderProps: {
        // 次级菜单的展开方式
        expandTrigger: 'hover',
        // 指定选项的值为选项对象的某个属性值
        value: 'cat_id',
        // 指定选项标签为选项对象的某个属性值
        label: 'cat_name',
        // 指定选项的子选项为选项对象的某个属性值
        children: 'children'
      },
      // 被激活的页签的名称
      activeName: 'many',
      // 动态参数的数据
      /*  manyTableData: [], */
      // 静态属性的数据
      /*  onlyTableData: [], */
      // 获取的数据
      tableData: [],
      // 添加参数对话框的显示
      addDialogVisible: false,
      // 添加数据对象
      addForm: {
        attr_name: ''
      },
      // 添加数据的验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 修改参数对话框的显示
      editDialogVisible: false,
      // 修改参数数据对象
      editForm: {
        attr_name: ''
      },
      // 修改参数数据的验证规则
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) { return this.$message.error('获取商品分类数据列表失败！') }
      this.cateList = res.data
      /* console.log(this.cateList) */
    },
    // 级联选择器选中项变化，会触发这个函数
    cateChange () {
      // 选中的,不是三级分类
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.tableData = []
        return
      }
      // 证明选中的,是三级分类
      console.log(this.selectedKeys)
      this.getParamsList()
    },
    // tab页签点击事件的处理函数
    handleClick () {
      this.getParamsList()
    },
    // 获取分类参数列表
    async getParamsList () {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } })
      if (res.meta.status !== 200) { return this.$message.warning('请选择三级分类') }
      // 将得到的数据进行forEach循环，将字符串attr_vals，转换成数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })
      console.log(res.data)
      this.tableData = res.data
      // 不同的表格渲染不同的数据
      /* if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else { this.onlyTableData = res.data } */
    },
    // 展示添加参数对话框
    showAddDialog () {
      this.addDialogVisible = true
    },
    // 监听添加对话框关闭
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 确定添加参数
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败！')
        }
        this.$message.success('添加成功！')
        this.addDialogVisible = false
        this.getParamsList()
      })
    },
    // 展示修改参数对话框
    async showEditParams (attrId) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`,
        { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) { return this.$message.error('查询参数失败！') }
      this.editForm = res.data
    },
    // 监听添加对话框关闭
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 确定修改参数
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          })
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败！')
        }
        this.$message.success('更新成功！')
        this.editDialogVisible = false
        this.getParamsList()
      })
    },
    // 删除参数
    removeParams (attrId) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        // 确认后的操作
      }).then(async () => {
        const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除参数失败！')
        }
        this.$message.success('删除参数成功！')
        this.getParamsList()
        // 失败后的操作
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 文本框失去焦点，或摁下Enter键触发
    handleInputConfirm (row) {
      // 删除字符串首尾的空白格
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return，则怎么输入的内容需要做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 需要发起请求，保存这次操作
      this.saveAttrVals(row)
    },
    // 点击按钮，展示文本输入框
    showInput (row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick 方法的作用 就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 将对 attr_vals的操作，保存到数据库中
    async saveAttrVals (row) {
      // 需要发起请求，保存这次操作
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数可选项失败！')
      }
      this.$message.success('修改参数可选项成功！')
    },
    // 删除对应的参数可选项
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  // 计算属性
  computed: {
    // 通过返回的布尔值，控制是否禁用按钮
    isBtnDisabled () {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的Id
    cateId () {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    //
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-cascader {
  width: 300px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 150px;
}
</style>
