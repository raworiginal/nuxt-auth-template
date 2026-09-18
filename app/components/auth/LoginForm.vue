<script setup lang="ts">
import { loginSchema } from "#shared/utils/authSchemas";

const emailLogin = useSignIn("email");
const usernameLogin = useSignIn("username");

const form = reactive({
  identifier: "",
  password: "",
});

const isEmail = computed(() => form.identifier.trim().includes("@"));

const error = computed(() =>
  isEmail.value ? emailLogin.error.value : usernameLogin.error.value,
);
const isPending = computed(() =>
  isEmail.value
    ? emailLogin.status.value === "pending"
    : usernameLogin.status.value === "pending",
);

async function login() {
  const result = loginSchema.safeParse(form);

  if (isEmail.value) {
    console.log("email login");
    await emailLogin.execute({
      email: form.identifier,
      password: form.password,
    });
    return;
  }
  console.log("username login");
  await usernameLogin.execute({
    username: form.identifier,
    password: form.password,
  });
}

const logout = useSignOut().execute();
</script>

<template>
  <form @submit.prevent="login">
    <fieldset
      class="fieldset bg-base-200 border-base-300 rounded-box w-sm border p-4"
    >
      <legend class="fieldset-legend">Login</legend>
      <div v-if="error" role="alert" class="alert alert-error alert-soft">
        <span>{{ error.message }}</span>
      </div>
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

      <button class="btn btn-neutral mt-4">
        <span v-if="isPending" class="loading"></span>
        <span v-else>Login</span>
      </button>
    </fieldset>
  </form>

  <button @click="logout" class="btn btn-error">logout</button>
</template>
