<script setup lang="ts">
import FileDropzone from '@/components/FileDropzone.vue' ;
import postSheetService from '@/services/post-sheet.service';

const handleFiles = async (files: FileList, setMessage: (message: string, error?: boolean) => void) => {
  setMessage('Carregando...');

  const validExtensionsRegex = new RegExp(/\.(csv|xlsx)$/i);

  const isValidFile = validExtensionsRegex.test(files.item(0)?.name || '');

  if (!isValidFile) {
    setMessage('Formato de arquivo inválido. Apenas .csv e .xlsx são aceitos.', true);
    return;
  }

  try {
    const formData = new FormData();

    formData.append('file', files.item(0) as File);

    await postSheetService(formData);
  } catch {
    return setMessage('Erro ao processar arquivo', true);
  }

  setMessage('Arquivo carregado com sucesso!');
};
</script>

<template>
  <main class="flex flex-col items-center justify-center h-full p-6">
    <h1 class="text-5xl text-center text-white mb-6">Upload de planilhas</h1>
    <FileDropzone :handle-files="handleFiles"/>
  </main>
</template>