<template>
    <div class="not-found">
      <h1>404</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <router-link to="/">Go Home</router-link>
    </div>
  </template>
  
  <script setup lang="ts">
  // No specific logic needed
  </script>
  
  <style scoped>
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 70vh;
    text-align: center;
  }
  .not-found h1 {
    font-size: 8rem;
    margin: 0;
    color: #ff6f61;
  }
  .not-found p {
    font-size: 1.5rem;
    margin: 1rem 0;
  }
  .not-found a {
    color: #409eff;
    text-decoration: underline;
    font-size: 1.2rem;
  }
  </style>