<script setup lang="ts">
import Text from '@/components/Text'
import { ref } from 'vue'
import { parseZip } from '@/utils/unzip'
const paleteModel = ref<boolean>(false)
const colorsModel = ref<boolean>(false)
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
    parseFiles(materialDesignZip)
  }
}

const fileChange = async (event: Event) => {
  const { files } = event.target as HTMLInputElement
  if (files !== null) {
    const file = files.item(0)
    parseFiles(file)
  }
}

async function parseFiles(file: File | null) {
  if (file !== null) {
    await parseZip(file, {
      palette: paleteModel.value,
      moudleModifier: colorsModel.value
    })
  }
}
</script>

<template>
  <header>
    <Text title="Material Design Token to Xcode Assets" />
  </header>

  <main>
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
      <label class="inline-flex items-center ml-3">
        <input type="checkbox" class="border-solid text-indigo-600" v-model="colorsModel" />
        <span class="ml-2">Include `colors.modules`</span>
      </label>
    </div>

    <div class="mt-4">
      <button
        class="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
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
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
    justify-content: center;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
