<template>
  <div class="not-found">
    <div class="container">
      <div class="text-center">
        <h1>404</h1>
        <h2>頁面未找到</h2>
        <p>抱歉，您訪問的頁面不存在。</p>
        <router-link to="/" class="btn btn-primary">返回首頁</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found h1 {
  font-size: 6rem;
  color: var(--maincolor);
}

.not-found h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.btn {
  padding: 10px 20px;
  background: var(--maincolor);
  color: black;
  font-weight: bold;
  text-decoration: none;
  border-radius: 5px;
  margin-top: 20px;
  display: inline-block;
}
</style>
