<script setup lang="ts">
const form = reactive({
  identifier: "",
  password: "",
});

async function login() {
  if (form.identifier.includes("@")) {
    console.log(`${form.identifier} is an email`);
  } else {
    console.log(`${form.identifier} is a username`);
  }
}
</script>

<template>
  <form @submit.prevent="login">
    <fieldset
      class="fieldset bg-base-200 border-base-300 rounded-box w-sm border p-4"
    >
      <legend class="fieldset-legend">Login</legend>

      <label class="label">Email or Username</label>
      <input
        v-model="form.identifier"
        type="text"
        class="input"
        placeholder="Email"
      />

      <label class="label">Password</label>
      <input
        v-model="form.password"
        type="password"
        class="input"
        placeholder="Password"
      />

      <button class="btn btn-neutral mt-4">Login</button>
    </fieldset>
  </form>
</template>
