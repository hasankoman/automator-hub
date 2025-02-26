<script setup>
import MultiSelect from "primevue/multiselect";
import { storeToRefs } from "pinia";
import { computed, onMounted, onUnmounted, ref } from "vue";

const githubStore = useGitHubStore();
const headerStore = useHeaderStore();
const readmeOperationsStore = useReadmeOperationsStore();
const { repositories } = storeToRefs(githubStore);
const { isExpanded, searchInput, searchTerm, selectedLanguages } =
  storeToRefs(headerStore);
const { operations } = storeToRefs(readmeOperationsStore);
const { expandInput, setupListeners, removeListeners } = headerStore;

const languageOptions = computed(() =>
  headerStore.getLanguageOptions(repositories.value)
);

const menu = ref(null);
const readmeMenuVisible = ref(false);

onMounted(() => {
  setupListeners();
  readmeOperationsStore.fetchOperations();
});

onUnmounted(() => {
  removeListeners();
});

const getStatusIcon = (status) => {
  switch (status) {
    case 'success':
      return 'hugeicons:check-circle';
    case 'failed':
      return 'hugeicons:close-circle';
    case 'pending':
      return 'hugeicons:clock-circle';
    default:
      return 'hugeicons:info-circle';
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'success':
      return 'text-green-500';
    case 'failed':
      return 'text-red-500';
    case 'pending':
      return 'text-yellow-500';
    default:
      return 'text-gray-500';
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const toggleReadmeMenu = (event) => {
  menu.value.toggle(event);
};
</script>

<template>
  <div class="flex items-center gap-3">
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
    
    <!-- Readme İşlemleri Menüsü -->
    <div class="relative">
      <Button
        icon="hugeicons:book-open"
        class="p-button-rounded p-button-text"
        @click="toggleReadmeMenu"
        aria-haspopup="true"
        aria-controls="readme_menu"
      />
      
      <Menu
        ref="menu"
        id="readme_menu"
        :model="[]"
        :popup="true"
        :pt="{
          root: 'rounded-xl shadow-lg',
          list: 'p-2 max-h-80 overflow-y-auto',
        }"
      >
        <template #default>
          <div class="w-80">
            <div class="p-3 border-b border-gray-200">
              <h3 class="text-lg font-semibold">README İşlemleri</h3>
            </div>
            
            <div v-if="operations.length === 0" class="p-4 text-center text-gray-500">
              Henüz hiç README işlemi bulunmuyor.
            </div>
            
            <div v-else class="divide-y divide-gray-100">
              <div
                v-for="op in operations"
                :key="op.id"
                class="p-3 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center gap-2">
                  <Icon :name="getStatusIcon(op.status)" :class="getStatusClass(op.status)" class="text-xl" />
                  <div class="flex-1">
                    <div class="font-medium">{{ op.repositoryName }}</div>
                    <div class="text-sm text-gray-500 flex items-center gap-1">
                      <span>{{ op.operationType === 'manual' ? 'Manuel' : 'Otomatik' }} güncelleme</span>
                      <span class="text-xs">•</span>
                      <span>{{ formatDate(op.createdAt) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Menu>
    </div>
  </div>
</template>
