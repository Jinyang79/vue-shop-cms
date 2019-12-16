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
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- treetable表格 -->
      <tree-table :data="cateList"
                  :columns="columns"
                  :selection-type="false"
                  :expand-type="false"
                  show-index
                  index-text="#"
                  border
                  :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot="isOk"
                  slot-scope="scope">
          <i class="el-icon-success"
             v-if="scope.row.cat_deleted===false"
             style="color:lightgreen"></i>
          <i class="el-icon-error"
             v-else
             style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order"
                  slot-scope="scope">
          <el-tag size="mini"
                  v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag size="mini"
                  type="success"
                  v-if="scope.row.cat_level==1">二级</el-tag>
          <el-tag size="mini"
                  type="warning"
                  v-if="scope.row.cat_level==2">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt"
                  slot-scope="scope">
          <!-- 编辑按钮 -->
          <el-button type="primary"
                     icon="el-icon-edit"
                     size="mini"
                     @click="showEditDialog(scope.row.cat_id)">
            编辑
          </el-button>
          <!-- 删除按钮 -->
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="mini"
                     @click="removeCateById(scope.row.cat_id)">
            删除
          </el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="querInfo.pagenum"
                     :page-sizes="[3, 5, 10, 15]"
                     :page-size="querInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
      <!-- 添加分类对话框 -->
      <el-dialog title="添加分类"
                 :visible.sync="addCatedialogVisible"
                 @close="addDialogClose">
        <!-- 内容主体区域 -->
        <el-form :model="addCateForm"
                 :rules="addCateFormRules"
                 ref="addCateFormRef"
                 label-width="100px">
          <el-form-item label="分类名称"
                        prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- v-model 选中项绑定值 -->
            <!-- options 可选项数据源，键名可通过 Props 属性配置 -->
            <el-cascader v-model="selectedKeys"
                         :options="parentCateList"
                         :props="cascaderProps"
                         @change="parentCateChange"
                         clearable>
            </el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="addCatedialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="addCate">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑对话框 -->
      <el-dialog title="修改分类"
                 :visible.sync="editCatedialogFormVisible"
                 @close="editDialogClosed">
        <!-- 内容主体区域 -->
        <el-form :model="editCateForm"
                 label-width="100px"
                 ref="editFormRef">
          <el-form-item label="活动名称">
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="editCatedialogFormVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="editCateInfo">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品分类的数据列表
      cateList: [],
      // 查询条件
      querInfo: {
        type: 3,
        // 当前页码值
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 5
      },
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isOk'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }],
      // 控制添加分类对话框的显示
      addCatedialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是一级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        // 是否严格的遵守父子节点不互相关联
        checkStrictly: true,
        // 次级菜单的展开方式
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的ID数组
      selectedKeys: [],
      // 控制修改分类对话框的显示
      editCatedialogFormVisible: false,
      // 修改用户的表单数据
      editCateForm: {}
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.querInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败！')
      }
      this.cateList = res.data.result
      // 为总条数赋值
      this.total = res.data.total
    },
    // 监听当前每页显示多少条数据改变
    handleSizeChange (newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听当前的页面改变
    handleCurrentChange (newNum) {
      this.querInfo.pagenum = newNum
      this.getCateList()
    },
    // 展示添加分类的对话框
    showAddCateDialog () {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      // 再展示出对话框
      this.addCatedialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories',
        { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据列表失败！')
      }
      this.parentCateList = res.data
    },
    // 选择项发生变化触发这个函数
    parentCateChange () {
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击确认按钮，添加分类
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        console.log(this.addCateForm)
        this.getCateList()
        this.addCatedialogVisible = false
      })
    },
    // 监听添加分类对话框的关闭事件
    addDialogClose () {
      /* this.$refs.addCateFormRef.resetFields() */
      // 重置数据
      this.selectedKeys = []
      this.addCateForm.cat_name = ''
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 展示编辑分类的对话框
    async showEditDialog (catId) {
      const { data: res } = await this.$http.get('categories/' + catId)
      if (res.meta.status !== 200) { return this.$message.error('查询分类失败！') }
      this.editCateForm = res.data
      this.editCatedialogFormVisible = true
    },
    // 监听编辑分类对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑分类信息并提交
    editCateInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('categories/' + this.editCateForm.cat_id, {
          cat_name: this.editCateForm.cat_name
        })
        if (res.meta.status !== 200) {
          this.$message.error('更新分类信息失败！')
        }
        this.$message.success('更新分类信息成功！')
        // 关闭对话框
        this.editCatedialogFormVisible = false
        // 刷新数据列表
        this.getCateList()
      })
    },
    // 删除分类
    removeCateById (Catid) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        // 确认后的操作
      }).then(async () => {
        const { data: res } = await this.$http.delete('categories/' + Catid)
        if (res.meta.status !== 200) {
          return this.$message.error('删除分类失败！')
        }
        this.$message.success('删除分类成功！')
        this.getCateList()
        // 失败后的操作
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-button {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
