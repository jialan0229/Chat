<script setup>
import { useRouter } from 'vue-router';
import Header from '@/components/Header/index.vue';
import Footer from '@/components/Footer/index.vue';

const router = useRouter();

router.push('/login');
</script>

<template>
  <Header />
  <h1>Home Page</h1>
  <Footer />
</template>

<style scoped>
</style>