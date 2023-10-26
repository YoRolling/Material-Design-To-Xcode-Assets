<script setup lang="ts">
import Text from '@/components/Text'
import { reactive, ref } from 'vue'
import { parseZip } from '@/utils/unzip'
import { buildTree, gen } from './utils/zip'
const paleteModel = ref<boolean>(false)
const colorsModel = ref<boolean>(false)
const file = ref<File | null>(null)

function checkFile(ev: DragEvent) {
  ev.preventDefault()
  ev.stopPropagation()
}
function dragOverHandler(ev: Event) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault()
}
function dropHandler(ev: DragEvent) {
  console.log('File(s) dropped')

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault()

  // Use DataTransferItemList interface to access the file(s)
  const { items } = ev.dataTransfer ?? { items: new DataTransferItemList() }
  const dataTransferItem = Array.from(items)
    .filter((v) => v.type === 'application/zip' && v.kind === 'file')
    .shift()

  if (dataTransferItem !== undefined) {
    const materialDesignZip = dataTransferItem.getAsFile()
    file.value = materialDesignZip
  }
}

const fileChange = async (event: Event) => {
  const { files } = event.target as HTMLInputElement
  if (files !== null) {
    const _file = files.item(0)
    file.value = _file
  }
}

async function parseFiles() {
  if (file.value !== null) {
    const result = await parseZip(file.value, {
      palette: paleteModel.value,
      moudleModifier: colorsModel.value
    })

    // const inputArgs = buildTree(result)
    await gen(result)
  }
}
</script>

<template>
  <header>
    <Text title="Material Design Token to Xcode Assets" />
    <h6 class="text-lg mt-8 italic font-serial">
      You can build your own Material Design Token in
      <a href="https://m3.material.io/theme-builder" target="_blank">theme builder</a>
    </h6>
  </header>
  <main class="mt-8">
    <div
      class="p-4 h-40 border border-dashed border-gray-400 rounded-lg relative flex items-center justify-center"
      @dragstart="checkFile"
      @dragover="dragOverHandler"
      @drop="dropHandler"
    >
      <div>
        <label
          for="fileInput"
          class="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm0 3a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm16-3v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2zm-4 7l-3 3v-2H5V8h2V6l3 3h3v1z"
            />
          </svg>
          Choose a .zip file
          <input
            id="fileInput"
            type="file"
            class="hidden"
            accept=".zip"
            @change="fileChange"
            :multiple="false"
          />
        </label>
        <div id="dropArea">Drag & Drop your .zip file here</div>
      </div>
    </div>

    <div class="mt-3 flex">
      <label class="inline-flex items-center">
        <input type="checkbox" class="border-solid text-indigo-600" v-model="paleteModel" />
        <span class="ml-2">Include Palette(s) </span>
      </label>
      <VTooltip>
        <label class="inline-flex items-center ml-8">
          <input type="checkbox" class="border-solid text-indigo-600" v-model="colorsModel" />
          <span class="ml-2">Include `colors.module`</span>
        </label>
        <template #popper> colors.module.css will transform as SwiftUI Modifier</template>
      </VTooltip>
    </div>

    <div class="mt-4">
      <button
        class="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
        @click="parseFiles"
        :class="{ 'cursor-not-allowed': file == null }"
        :disabled="file === null"
      >
        Process
      </button>
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    flex-direction: column;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
    justify-content: center;
  }
}
</style>
