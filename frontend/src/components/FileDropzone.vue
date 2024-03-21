<template>
  <div
      :class="`
      border-dashed border-2 p-6 rounded-lg cursor-pointer transition-all ease-in-out duration-300 w-full text-center min-h-40 flex justify-center items-center text-2xl

      ${error ? 'border-red-500 bg-red-100 text-red-800' : 'border-gray-300'}

      ${
        isDraggingOver ?
        'border-gray-400 bg-gray-100 text-gray-800' :
        'border-gray-300 hover:border-gray-400 hover:bg-gray-100 hover:text-gray-800'
      }`"
      @dragover.prevent
      @dragenter="dragEnter"
      @dragleave="dragLeave"
      @drop="handleDrop"
      @click="openFileSelector"
  >
    <input type="file" ref="fileInput" @change="handleFileSelect" style="display: none"/>
    <slot></slot>
    <div>{{ state.message }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, reactive, ref, watchEffect, withDefaults } from 'vue';

type Props = {
  message?: string;
  handleFiles: (files: FileList, setMessage: (message: string) => void) => void;
};

const { message, handleFiles } = withDefaults(defineProps<Props>(), {
  message: 'Arraste e solte um arquivo aqui ou clique para selecionar',
});


const state = reactive({
  message,
  dragOverCount: 0,
});

const error = ref(false);

const isDraggingOver = ref(state.dragOverCount > 0);

const setMessage = (message: string, isError = false) => {
  state.message = message;
  error.value = isError;
};

watchEffect(() => {
  isDraggingOver.value = state.dragOverCount > 0;
});

const dragEnter = () => {
  state.dragOverCount++;
};

const dragLeave = () => {
  state.dragOverCount--;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();

  state.dragOverCount = 0;
  const files = e.dataTransfer?.files;

  if (!files?.length) {
    return;
  }

  handleFiles(files, setMessage);
};

const fileInput = ref<HTMLInputElement | null>(null);

const openFileSelector = () => {
  fileInput.value?.click();
};

const handleFileSelect = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files?.length) return;

  handleFiles(files, setMessage);
};

</script>
