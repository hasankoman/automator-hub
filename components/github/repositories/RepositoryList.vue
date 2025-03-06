<script setup>
import { computed, onMounted } from "vue";

import { storeToRefs } from "pinia";

const githubStore = useGitHubStore();
const headerStore = useHeaderStore();
const route = useRoute();

const { repositories } = storeToRefs(githubStore);

const { actionType } = defineProps({
  actionType: {
    type: String,
    required: true,
  },
});

onMounted(() => {
  githubStore.fetchRepositories(actionType);
});

const filteredRepositories = computed(() =>
  headerStore.getFilteredRepositories(repositories.value)
);

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
  <div class="flex-1 p-3 md:p-4 gap-4 flex flex-col overflow-auto">
    <div
      class="flex items-center justify-end pb-3 border-b border-gray-200 gap-3"
    >
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
          <Icon name="hugeicons:filter" class="text-black text-xl" />
        </template>
      </MultiSelect>
    </div>
    <div class="grid grid-cols-1 auto-rows-min gap-5">
      <template
        v-for="repository in filteredRepositories"
        :key="repository.id || repository.fullName"
      >
        <GithubRepositoriesRepositoryListItem
          :repository="repository"
          :actionType="actionType"
        />
      </template>
    </div>
  </div>
</template>
