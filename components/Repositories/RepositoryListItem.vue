<script setup>
import { computed } from "vue";
import { useGitHubStore } from "~/store/github";
import { storeToRefs } from "pinia";

const githubStore = useGitHubStore();
const { selectedRepositories } = storeToRefs(githubStore);

const { repository } = defineProps({
  repository: Object,
});

const handleRepositoryClick = (repository) => {
  if (isSelected.value) {
    delete selectedRepositories.value[repository.id];
  } else {
    selectedRepositories.value = {
      ...selectedRepositories.value,
      [repository.id]: repository,
    };
  }
};

const languageColors = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  C: "#555555",
  "C++": "#f34b7d",
  Go: "#00ADD8",
  Rust: "#dea584",
  PHP: "#4F5D95",
  Swift: "#ffac45",
  Kotlin: "#A97BFF",
  Ruby: "#701516",
  "Objective-C": "#438eff",
  Shell: "#89e051",
  Vue: "#42b883",
  React: "#61dafb",
  SCSS: "#c6538c",
  Dart: "#00b4ab",
};

const getLanguageColor = (language) => {
  return languageColors[language] || "#cccccc";
};

const formattedLanguages = computed(() => {
  if (!repository.languages) return [];

  const total = Object.values(repository.languages).reduce(
    (acc, value) => acc + value,
    0
  );

  let languages = Object.entries(repository.languages)
    .map(([lang, value]) => [lang, ((value / total) * 100).toFixed(1)])
    .sort((a, b) => b[1] - a[1]);

  if (languages.length > 6) {
    const topSix = languages.slice(0, 6);
    const otherTotal = languages
      .slice(6)
      .reduce((acc, [, percent]) => acc + parseFloat(percent), 0)
      .toFixed(1);

    return [...topSix, ["Other", otherTotal]];
  }

  return languages;
});

const isSelected = computed(() => {
  return Object.keys(selectedRepositories.value).includes(repository.id);
});
</script>

<template>
  <div
    class="p-4 bg-white rounded-xl shadow-sm flex flex-col md:flex-row gap-3 col-span-1 border-1 transition-all ease-linear duration-200 relative cursor-pointer"
    :class="isSelected ? 'border-emerald-500' : 'border-gray-200 '"
    @click="handleRepositoryClick(repository)"
  >
    <div class="absolute left-0 top-0 -translate-2 bg-white">
      <div
        class="w-6 h-6 flex items-center justify-center rounded-lg border-2 cursor-pointer transition-all ease-linear duration-200"
        :class="
          isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-gray-200 '
        "
      >
        <Icon
          name="material-symbols:check-rounded"
          v-if="isSelected"
          class="text-white text-2xl"
          weight="700"
        />
      </div>
    </div>
    <div class="flex flex-col gap-3 w-full items-start">
      <el-link
        :href="repository.url"
        target="_blank"
        class="!text-gray-800 !font-medium"
        type="info"
        @click.stop
      >
        <span class="font-semibold">{{ repository.fullName }}</span>
      </el-link>

      <p class="text-gray-600 text-sm mb-3 line-clamp-2">
        {{ repository.description || "No description available" }}
      </p>

      <div class="flex items-center gap-4 mt-auto text-gray-600 text-sm">
        <div class="flex items-center gap-1">
          <Icon name="hugeicons:star" class="text-yellow-500" />
          {{ repository.stargazers_count }}
        </div>

        <div class="flex items-center gap-1">
          <Icon name="hugeicons:git-fork" class="text-gray-500" />
          {{ repository.forks_count }}
        </div>

        <div
          v-if="repository.default_branch"
          class="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded text-xs"
        >
          <Icon name="hugeicons:git-branch" class="text-gray-500" />
          {{ repository.default_branch }}
        </div>
      </div>

      <div v-if="false" class="text-xs text-gray-500 mt-2">
        <span class="font-medium">Last commit:</span>
        <span>{{ repository.last_commit.message }}</span>
        <span
          >({{ new Date(repository.last_commit.date).toLocaleString() }})</span
        >
      </div>

      <div v-if="repository.updated_at" class="text-xs text-gray-500 mt-1">
        <span class="font-medium">Updated at: </span>
        <span>{{ new Date(repository.updated_at).toLocaleString() }}</span>
      </div>
    </div>
    <div
      v-if="formattedLanguages.length > 0"
      class="flex flex-col gap-2 w-full md:w-1/3"
    >
      <div class="w-full h-2 rounded-lg bg-gray-200 overflow-hidden flex">
        <div
          v-for="[language, percentage] in formattedLanguages"
          :key="language"
          class="h-2"
          :style="{
            width: `${percentage}%`,
            backgroundColor: getLanguageColor(language),
          }"
        ></div>
      </div>
      <div class="flex items-center gap-2 flex-wrap text-sm">
        <div
          v-for="[language, percentage] in formattedLanguages"
          :key="language"
          class="flex items-center gap-1"
        >
          <div
            class="w-2 h-2 rounded-full"
            :style="{ backgroundColor: getLanguageColor(language) }"
            :title="`${language}: ${percentage}%`"
          ></div>
          <span class="text-gray-600">{{ language }}</span>
          <span class="text-xs text-gray-400">%({{ percentage }})</span>
        </div>
      </div>
    </div>
  </div>
</template>
