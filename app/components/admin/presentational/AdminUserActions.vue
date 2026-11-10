<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId } from "vue";
import type { CSSProperties } from "vue";
import type { AdminUser } from "~/types/admin";

const props = defineProps<{
  user: AdminUser;
}>();

const emit = defineEmits<{
  edit: [user: AdminUser];
  resetPassword: [user: AdminUser];
  ban: [user: AdminUser];
  unban: [user: AdminUser];
  remove: [user: AdminUser];
  viewSessions: [user: AdminUser];
}>();

type UserAction = "edit" | "resetPassword" | "ban" | "unban" | "remove" | "viewSessions";

const menuId = `admin-user-actions-${useId()}`;
const trigger = ref<HTMLButtonElement | null>(null);
const menu = ref<HTMLUListElement | null>(null);
const isOpen = ref(false);
const menuStyle = ref<CSSProperties>({
  position: "fixed",
  top: "0px",
  left: "0px",
  visibility: "hidden",
});

function updateMenuPosition() {
  const triggerRect = trigger.value?.getBoundingClientRect();
  const menuRect = menu.value?.getBoundingClientRect();
  if (!triggerRect || !menuRect) return;

  const margin = 8;
  const gap = 4;
  const left = Math.max(
    margin,
    Math.min(
      triggerRect.right - menuRect.width,
      window.innerWidth - menuRect.width - margin,
    ),
  );
  const below = triggerRect.bottom + gap + menuRect.height <= window.innerHeight - margin;
  const top = below
    ? triggerRect.bottom + gap
    : Math.max(margin, triggerRect.top - menuRect.height - gap);

  menuStyle.value = {
    position: "fixed",
    top: `${top}px`,
    left: `${left}px`,
    visibility: "visible",
  };
}

function menuItems() {
  return Array.from(
    menu.value?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [],
  );
}

function removeListeners() {
  document.removeEventListener("pointerdown", handleOutsidePointerDown);
  document.removeEventListener("keydown", handleDocumentKeydown);
  window.removeEventListener("resize", updateMenuPosition);
  window.removeEventListener("scroll", updateMenuPosition, true);
}

function closeMenu(restoreFocus = false) {
  isOpen.value = false;
  removeListeners();
  if (restoreFocus) trigger.value?.focus();
}

async function toggleMenu() {
  if (isOpen.value) {
    closeMenu(true);
    return;
  }

  isOpen.value = true;
  await nextTick();
  updateMenuPosition();
  document.addEventListener("pointerdown", handleOutsidePointerDown);
  document.addEventListener("keydown", handleDocumentKeydown);
  window.addEventListener("resize", updateMenuPosition);
  window.addEventListener("scroll", updateMenuPosition, true);
  menuItems()[0]?.focus();
}

function handleOutsidePointerDown(event: PointerEvent) {
  const target = event.target;
  if (
    target instanceof Node &&
    !menu.value?.contains(target) &&
    !trigger.value?.contains(target)
  ) {
    closeMenu();
  }
}

function handleDocumentKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    closeMenu(true);
  }
}

function handleMenuKeydown(event: KeyboardEvent) {
  const items = menuItems();
  const currentIndex = items.indexOf(event.target as HTMLButtonElement);
  if (currentIndex < 0 || items.length === 0) return;

  let nextIndex: number | undefined;
  if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % items.length;
  if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + items.length) % items.length;
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = items.length - 1;

  if (nextIndex !== undefined) {
    event.preventDefault();
    items[nextIndex]?.focus();
  }
}

function handleFocusOut(event: FocusEvent) {
  const nextTarget = event.relatedTarget;
  if (
    nextTarget instanceof Node &&
    (menu.value?.contains(nextTarget) || trigger.value?.contains(nextTarget))
  ) {
    return;
  }
  closeMenu();
}

function handleAction(action: UserAction) {
  closeMenu(true);
  switch (action) {
    case "edit":
      emit("edit", props.user);
      break;
    case "resetPassword":
      emit("resetPassword", props.user);
      break;
    case "ban":
      emit("ban", props.user);
      break;
    case "unban":
      emit("unban", props.user);
      break;
    case "remove":
      emit("remove", props.user);
      break;
    case "viewSessions":
      emit("viewSessions", props.user);
      break;
  }
}

onBeforeUnmount(removeListeners);
</script>

<template>
  <button
    :id="`${menuId}-trigger`"
    ref="trigger"
    class="btn btn-sm"
    type="button"
    aria-haspopup="menu"
    :aria-expanded="isOpen"
    :aria-controls="menuId"
    :aria-label="`Actions for ${user.name}`"
    @click="toggleMenu"
  >
    Actions
  </button>

  <Teleport to="body">
    <ul
      v-if="isOpen"
      :id="menuId"
      ref="menu"
      class="menu max-h-[calc(100dvh-1rem)] w-56 overflow-y-auto rounded-box border border-base-300 bg-base-100 p-2 shadow-lg z-[1000]"
      role="menu"
      :aria-labelledby="`${menuId}-trigger`"
      :style="menuStyle"
      @keydown="handleMenuKeydown"
      @focusout="handleFocusOut"
    >
      <li>
        <button
          type="button"
          role="menuitem"
          tabindex="-1"
          @click="handleAction('edit')"
        >
          Edit
        </button>
      </li>
      <li>
        <button
          type="button"
          role="menuitem"
          tabindex="-1"
          @click="handleAction('resetPassword')"
        >
          Reset password
        </button>
      </li>
      <li>
        <button
          v-if="user.banned"
          type="button"
          role="menuitem"
          tabindex="-1"
          @click="handleAction('unban')"
        >
          Unban
        </button>
        <button
          v-else
          type="button"
          role="menuitem"
          tabindex="-1"
          @click="handleAction('ban')"
        >
          Ban
        </button>
      </li>
      <li>
        <button
          type="button"
          role="menuitem"
          tabindex="-1"
          @click="handleAction('viewSessions')"
        >
          View sessions
        </button>
      </li>
      <li>
        <button
          class="text-error"
          type="button"
          role="menuitem"
          tabindex="-1"
          @click="handleAction('remove')"
        >
          Remove
        </button>
      </li>
    </ul>
  </Teleport>
</template>
