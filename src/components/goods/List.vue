<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索栏和添加按钮 -->
      <el-row>
        <el-col>
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    class="input-with-select"
                    clearable
                    @clear="getGoodsList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getGoodsList"></el-button>
          </el-input>
          <el-button type="primary"
                     @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="goodsList"
                stripe
                border>
        <el-table-column type="index"
                         label="#">
        </el-table-column>
        <el-table-column prop="goods_name"
                         label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price"
                         label="商品价格(元)"
                         width="95px">
        </el-table-column>
        <el-table-column prop="goods_weight"
                         label="商品重量"
                         width="70px">
        </el-table-column>
        <el-table-column prop="add_time"
                         label="创建时间"
                         width="140px">
          <template slot-scope="scope">{{scope.row.add_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作"
                         width="130px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini">
            </el-button>
            <!-- 删除按钮 -->
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="removeGoods(scope.row.goods_id)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[3, 5, 10, 15]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
                     background>
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品数据列表
      goodsList: [],
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表数据
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) { return this.$message.error('获取商品列表数据失败！') }
      console.log(res.data)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 监听当前每页显示多少条数据
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    // 监听当前的页面改变
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    // 删除商品
    removeGoods (goodsId) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        // 确认后的操作
      }).then(async () => {
        const { data: res } = await this.$http.delete(`goods/${goodsId}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除参数失败！')
        }
        this.$message.success('删除参数成功！')
        this.getGoodsList()
        // 失败后的操作
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 跳转到添加商品页面
    goAddpage () {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style lang="less" scoped>
.input-with-select {
  width: 350px;
  margin-right: 15px;
}
</style>
