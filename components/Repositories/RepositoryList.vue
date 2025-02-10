<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useGitHubStore } from "~/store/github";
import MultiSelect from "primevue/multiselect";

const githubStore = useGitHubStore();

const { selectedRepositories, repositories, currentStep } =
  storeToRefs(githubStore);

const searchTerm = ref("");
const selectedLanguages = ref([]);
const isExpanded = ref(false);
const searchInput = ref(null);

onMounted(() => {
  if (repositories.value.length === 0) {
    githubStore.fetchRepositories();
  }
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const handleClickOutside = (event) => {
  if (!event.target.closest("#search-container")) {
    collapseInput();
  }
};

const expandInput = () => {
  if (isExpanded.value) return;

  isExpanded.value = true;
  console.log(searchInput.value);
  setTimeout(() => {
    searchInput.value?.$el.focus();
  }, 100);
};

const collapseInput = () => {
  if (!searchTerm.value) {
    isExpanded.value = false;
  }
};

const languageOptions = computed(() => {
  const langs = new Set();
  githubStore.repositories.forEach((repository) => {
    if (repository.languages && typeof repository.languages === "object") {
      Object.keys(repository.languages).forEach((lang) => langs.add(lang));
    }
  });
  return Array.from(langs);
});

const filteredRepositories = computed(() => {
  const search = searchTerm.value.toLowerCase();

  return githubStore.repositories.filter((repository) => {
    const searchMatches =
      !searchTerm.value ||
      (repository.fullName &&
        repository.fullName.toLowerCase().includes(search)) ||
      (repository.description &&
        repository.description.toLowerCase().includes(search)) ||
      (repository.languages &&
        typeof repository.languages === "object" &&
        Object.keys(repository.languages).some((lang) =>
          lang.toLowerCase().includes(search)
        ));

    const languagesFilterMatches =
      selectedLanguages.value.length === 0 ||
      (repository.languages &&
        typeof repository.languages === "object" &&
        Object.keys(repository.languages).some((lang) =>
          selectedLanguages.value.includes(lang)
        ));

    return searchMatches && languagesFilterMatches;
  });
});
</script>

<template>
  <div class="flex flex-col gap-3 w-full overflow-hidden">
    <Header>
      <template #right>
        <div class="flex items-center relative" id="search-container">
          <div
            class="flex items-center bg-white rounded-xl"
            @click="expandInput"
          >
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
          </template> </MultiSelect
      ></template>
    </Header>

    <div
      class="grid grid-cols-1 gap-5 p-5 bg-white rounded-t-2xl overflow-auto border-t-1 border-x-1 border-gray-200 shadow-inner"
    >
      <template
        v-for="repository in filteredRepositories"
        :key="repository.id || repository.fullName"
      >
        <repositories-repository-list-item :repository="repository" />
      </template>
    </div>
  </div>
  <div
    class="flex items-center sticky bottom-0 z-10 justify-between gap-3 border border-gray-200 bg-white px-5 py-3 mt-auto w-full rounded-b-2xl"
  >
    <Button
      label="Previous"
      @click="currentStep -= 1"
      class="px-8 mr-auto"
      outlined
      v-if="currentStep !== 1"
    />
    <Button
      label="Next"
      @click="currentStep += 1"
      class="px-8 ml-auto"
      :disabled="Object.keys(selectedRepositories).length === 0"
    />
  </div>
</template>
