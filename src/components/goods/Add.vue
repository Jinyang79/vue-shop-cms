<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert title="添加商品学习"
                type="info"
                center
                show-icon>
      </el-alert>
      <!-- active 设置当前激活步骤 类型 number -->
      <el-steps :space="200"
                :active="activeIndex - 0"
                finish-status="success"
                align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <!-- value/v-model绑定值，选中选项卡的 name 类型string -->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="100px"
               label-position="top">
        <el-tabs :tab-position="'left'"
                 v-model="activeIndex"
                 :before-leave="beforeTabLeave">
          <el-tab-pane label="基本信息"
                       name="0">
            <!-- 基本信息表单 -->
            <el-form-item label="商品名称"
                          prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格"
                          prop="goods_price">
              <el-input v-model="addForm.goods_price"
                        type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量"
                          prop="goods_weight">
              <el-input v-model="addForm.goods_weight"
                        type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量"
                          prop="goods_number">
              <el-input v-model="addForm.goods_number"
                        type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量"
                          prop="goods_cat">
              <!-- 选择商品分类的级联选择器 -->
              <el-cascader v-model="addForm.goods_cat"
                           :options="cateList"
                           :props="cascaderProps"
                           @change="cateChange"
                           clearable></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数"
                       name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性"
                       name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片"
                       name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容"
                       name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 激活项
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        good_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
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
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败！')
      }
      this.cateList = res.data
    },
    // 级联选择器选中项变化，会触发这个函数
    cateChange () {
      // 选中的,不是三级分类
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        return
      }
      // 证明选中的,是三级分类
      console.log(this.addForm.goods_cat)
    },
    // 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' &&
        this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类！')
        return false
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
