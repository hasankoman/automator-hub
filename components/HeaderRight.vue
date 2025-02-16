<script setup>
import { useGitHubStore } from "~/store/github";
import { useHeaderStore } from "~/store/header";
import MultiSelect from "primevue/multiselect";
import { storeToRefs } from "pinia";
import { computed, onMounted, onUnmounted } from "vue";

const githubStore = useGitHubStore();
const headerStore = useHeaderStore();
const { repositories } = storeToRefs(githubStore);
const { isExpanded, searchInput, searchTerm, selectedLanguages } =
  storeToRefs(headerStore);
const { expandInput, setupListeners, removeListeners } = headerStore;

const languageOptions = computed(() =>
  headerStore.getLanguageOptions(repositories.value)
);

onMounted(() => {
  setupListeners();
});

onUnmounted(() => {
  removeListeners();
});
</script>

<template>
  <div class="flex items-center relative" id="search-container">
    <div class="flex items-center bg-white rounded-xl" @click="expandInput">
      <div
        class="w-10 h-10 absolute flex items-center justify-center"
        :class="isExpanded ? '' : 'cursor-pointer'"
      >
        <Icon name="hugeicons:search-01" class="text-black text-xl" />
      </div>
      <InputText
        ref="searchInput"
        v-model="searchTerm"
        type="text"
        placeholder=""
        class="outline-none border-none w-10 shadow-none !transition-all duration-500 ease-in-out"
        :class="{ 'w-48': isExpanded }"
        :style="{
          paddingLeft: isExpanded ? '40px' : '',
        }"
      />
    </div>
  </div>
  <MultiSelect
    v-model="selectedLanguages"
    :options="languageOptions"
    class="!bg-white"
    variant="filled"
    filter
    :pt="{
      labelcontainer: 'w-0',
    }"
  >
    <template #dropdownicon>
      <Icon name="fa6-solid:filter" v-if="false" class="text-black" />
      <Icon name="hugeicons:filter" class="text-black text-xl" />
    </template>
  </MultiSelect>
</template>
