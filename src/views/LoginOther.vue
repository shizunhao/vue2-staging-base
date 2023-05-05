<template>
  <div class="page-login">
    <div class="page-login--content-main">
      <div class="page-login--form">
        <transition name="fade-transverse" appear>
          <img height="200" :src="imageURL" alt="" />
        </transition>
        <div class="page-login--content-main-motto">
          <p>Moka系统</p>
        </div>
        <el-card shadow="hover">
          <el-form
            ref="loginForm"
            label-position="top"
            @submit.native.prevent
            :rules="rules"
            :model="formLogin"
            size="default"
          >
            <el-form-item prop="username">
              <el-input
                type="text"
                v-model="formLogin.username"
                placeholder="用户名（邮箱前缀）"
              >
                <template slot="append">@cyou-inc.com</template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                class="d2-mt-10"
                type="password"
                v-model="formLogin.password"
                placeholder="密码"
              >
              </el-input>
            </el-form-item>
            <el-button
              size="default"
              @click="submit"
              native-type="submit"
              type="primary"
              class="button-login d2-mt-10"
            >
              登录
            </el-button>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";
// store
export default {
  data() {
    return {
      imageURL: require("./image/HI.png"),
      // 表单
      formLogin: {
        username: "",
        password: "",
      },
      // 表单校验
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    console.log(this.$route, "this.$route");
    // window.open("10.12.28.70:8082/#" + this.$route.fullPath);
  },
  methods: {
    /**
     * @description 提交表单
     */
    // 提交登录信息
    submit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // 登录
          api
            .SYS_USER_LOGIN({
              username: this.formLogin.username,
              password: this.formLogin.password,
              client_id: "HrV2",
              client_secret: "12345",
              grant_type: "password",
            })
            .then((res) => {
              const token = res.data.access_token;
              const refToken = res.data.refresh_token;
              const exp = res.data.expires_in;
              api
                .loginOtherSave({
                  state: this.$route.query.state,
                  token,
                  refToken,
                  exp,
                })
                .then((res) => {
                  console.log(
                    `${this.$route.query.redirect_uri}?state=${this.$route.query.state}&code=${res.data}`,
                    "调转路由"
                  );
                  window.open(
                    `${this.$route.query.redirect_uri}?state=${this.$route.query.state}&code=${res.data}`,
                    "_self"
                  );
                })
                .catch((err) => {
                  this.$message.warning("操作失败，请联系管理员");
                  console.log(err, "111");
                });
              // this.$router.replace(this.$route.query.redirect || '/')
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          // 登录表单校验失败
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
  },
};
</script>

<style  scoped>
.el-button--primary:focus,
.el-button--primary:hover {
  background: #78b59e;
  border-color: #78b59e;
}
.el-button--primary {
  background-color: #56a286;
  border-color: #56a286;
}
.fade-transverse-leave-active,
.fade-transverse-enter-active {
  transition: all 0.8s;
}
.fade-transverse-enter {
  opacity: 0;
  transform: translateX(-200px);
}
.fade-transverse-leave-to {
  opacity: 0;
  transform: translateX(200px);
}
::v-deep .el-input-group__append {
  padding: 0px 5px;
}
.page-login {
  /* backgroundcolor: rgba(205, 251, 228, 0.5); */
  background: url("./image/wave-mid.png") no-repeat fixed 100% 100%;
  background-color: rgba(205, 251, 228, 0.5);
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.page-login--content-main {
  width: 100%;
  height: 100%;
  margin: 0 200px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.page-login--content-main-motto {
  margin: 0px;
  padding: 0px;
  margin-bottom: 1em;
  color: #303133;
  font-size: 38px;
}

.page-login--form {
  width: 330px;
  z-index: 10;
}
.page-login--form .el-card {
  margin-bottom: 15px;
}

.page-login--form .button-login {
  width: 100%;
}
.page-login--form .login-code {
  height: 40px - 2px;
  display: block;
  margin: 0px -20px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}

.page-login--form.page-login--options {
  margin: 0px;
  padding: 0px;
  font-size: 14px;

  margin-bottom: 15px;
  font-weight: bold;
}
</style>
