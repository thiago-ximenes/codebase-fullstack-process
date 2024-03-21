<template>
  <div
      :class="`
      border-dashed border-2 p-6 rounded-lg cursor-pointer transition-all ease-in-out duration-300
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
    <input type="file" ref="fileInput" @change="handleFileSelect" style="display: none" />
    <slot></slot>
    <div>{{ message }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FileDropzone',
  data() {
    return {
      message: 'Arraste e solte ou clique para carregar um arquivo',
      dragOverCount: 0,
    };
  },
  computed: {
    isDraggingOver() {
      return this.dragOverCount > 0;
    },
  },
  methods: {
    dragEnter() {
      this.dragOverCount++;
    },
    dragLeave() {
      this.dragOverCount--;
    },
    handleDrop(e: DragEvent) {
      e.preventDefault();

      this.dragOverCount = 0;
      const files = e.dataTransfer?.files;

      if (!files?.length) {
        return;
      }

      this.handleFiles(files);
    },
    openFileSelector() {
      (this.$refs.fileInput as HTMLInputElement).click();
    },
    handleFileSelect(e: Event) {
      const files = (e.target as HTMLInputElement).files;
      if (!files?.length) return;

      this.handleFiles(files);
    },
    handleFiles(files: FileList) {
      this.message = 'Carregando...';

      const validExtensionsRegex = new RegExp(/\.(csv|xlsx)$/i);

      const isValidFile = validExtensionsRegex.test(files.item(0)?.name || '');

      if (!isValidFile) {
        this.message = 'Formato de arquivo inválido. Apenas .csv e .xlsx são aceitos.';
        return;
      }

      console.log(files);
      this.message = 'Arquivo carregado com sucesso!';
    },
  },
});
</script>