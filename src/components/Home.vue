<template>
  <el-container>
    <!-- 头部区 -->
    <el-header>
      <div>
        <img src="../assets/heima.png"
             alt="">
        <span>电商管理后台系统</span>
      </div>
      <el-button type="info"
                 @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#373c41"
                 text-color="#fff"
                 active-text-color="#ffd04b">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''"
                      v-for="item in menulist"
                      :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图案 -->
              <i class="el-icon-location"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="subitem.id+''"
                          v-for="subitem in item.children"
                          :key="subitem.id">
              <template slot="title">
                <!-- 图案 -->
                <i class="el-icon-location"></i>
                <!-- 文本 -->
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  data () {
    return {
      menulist: []
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      /* console.log(res) */
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    }
  }

}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #373c41;
  padding-left: 0;
  font-size: 20px;
  color: white;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }
}
.el-aside {
  background-color: #373c41;
}
.el-main {
  background-color: #fff;
}
</style>
