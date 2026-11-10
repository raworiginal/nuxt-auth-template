<script setup lang="ts">
const open = defineModel<boolean>("open", { required: true });

const props = withDefaults(
  defineProps<{
    title: string;
    closeDisabled?: boolean;
  }>(),
  {
    closeDisabled: false,
  },
);

function close() {
  if (props.closeDisabled) return;
  open.value = false;
}
</script>

<template>
  <dialog
    v-if="open"
    open
    class="modal"
    role="dialog"
    aria-modal="true"
    :aria-label="props.title"
    tabindex="-1"
    @click.self="close"
    @keydown.esc.prevent="close"
  >
    <div class="modal-box">
      <div class="flex items-center justify-between gap-4">
        <h2 class="text-lg font-bold">{{ props.title }}</h2>
        <button
          class="btn btn-sm btn-circle btn-ghost"
          type="button"
          aria-label="Close dialog"
          :disabled="props.closeDisabled"
          @click="close"
        >
          ×
        </button>
      </div>

      <div class="mt-4">
        <slot />
      </div>
    </div>
  </dialog>
</template>
