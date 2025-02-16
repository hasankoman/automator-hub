import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useHeaderStore = defineStore("header", () => {
  // UI State
  const isExpanded = ref(false);
  const searchInput = ref(null);
  const searchTerm = ref("");
  const selectedLanguages = ref([]);

  // UI Methods
  const handleClickOutside = (event) => {
    if (!event.target.closest("#search-container")) {
      collapseInput();
    }
  };

  const expandInput = () => {
    if (isExpanded.value) return;

    isExpanded.value = true;
    setTimeout(() => {
      searchInput.value?.$el.focus();
    }, 100);
  };

  const collapseInput = () => {
    if (!searchTerm.value) {
      isExpanded.value = false;
    }
  };

  const setupListeners = () => {
    document.addEventListener("click", handleClickOutside);
  };

  const removeListeners = () => {
    document.removeEventListener("click", handleClickOutside);
  };

  // Search and Filter Methods
  const getLanguageOptions = (repositories) => {
    const langs = new Set();
    repositories.forEach((repository) => {
      if (repository.languages && typeof repository.languages === "object") {
        Object.keys(repository.languages).forEach((lang) => langs.add(lang));
      }
    });
    return Array.from(langs);
  };

  const getFilteredRepositories = (repositories) => {
    const search = searchTerm.value.toLowerCase();

    return repositories.filter((repository) => {
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
  };

  return {
    // State
    isExpanded,
    searchInput,
    searchTerm,
    selectedLanguages,

    // Methods
    expandInput,
    collapseInput,
    setupListeners,
    removeListeners,
    getLanguageOptions,
    getFilteredRepositories,
  };
});
