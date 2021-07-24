<template>
  <div id="app"></div>
</template>

<script>
import axios from "axios";
export default {
  name: "app",
  created() {
    const whiteUrl = ["/login", "/book/home/v2"];
    const url = "/book/home/v2";
    const request = axios.create({
      baseURL: "https://test.youbaobao.xyz:18081",
      timeout: 5000,
    });
    request.interceptors.request.use(
      (config) => {
        const url = config.url.replace(config.baseURL, "");
        if (whiteUrl.some((wl) => url === wl)) {
          return config;
        }
        config.headers["token"] = "abcd";
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    request.interceptors.response.use(
      (response) => {
        const res = response.data;
        if (res.error_code != 0) {
          alert(res.msg);
          return Promise.reject(new Error(res.msg));
        } else {
          return res;
        }
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    request({
      url,
      method: "get",
      params: {
        openId: "1234",
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style lang="scss" scoped>
</style>