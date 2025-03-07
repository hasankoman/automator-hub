<script setup>
useHead({
  title: "Automate Your GitHub Documentation",
  meta: [
    {
      name: "description",
      content:
        "Transform your repository documentation with AI-powered README generation and management.",
    },
    { property: "og:title", content: "Automate Your GitHub Documentation" },
    {
      property: "og:description",
      content:
        "Transform your repository documentation with AI-powered README generation and management.",
    },
    {
      property: "og:image",
      content: "https://www.automator-hub.com/_nuxt/gh-manager-icon.png",
    },
    { property: "og:url", content: "https://www.automator-hub.com" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Automate Your GitHub Documentation" },
    {
      name: "twitter:description",
      content:
        "Transform your repository documentation with AI-powered README generation and management.",
    },
    {
      name: "twitter:image",
      content: "https://www.automator-hub.com/_nuxt/gh-manager-icon.png",
    },
  ],
});

const { status, signIn } = useAuth();

const features = [
  {
    title: "AI-Powered README Updates",
    description:
      "Automatically generate and update your repository documentation using advanced AI",
    icon: "hugeicons:magic-wand-02",
  },
  {
    title: "GitHub Integration",
    description: "Seamlessly connect and manage your GitHub repositories",
    icon: "hugeicons:github",
  },
  {
    title: "Multiple Update Modes",
    description:
      "Choose between manual updates or automated monitoring (Premium)",
    icon: "hugeicons:refresh",
  },
  {
    title: "Usage Analytics",
    description: "Track your documentation updates and repository metrics",
    icon: "hugeicons:chart-breakout-square",
  },
];

const handleGetStarted = () => {
  if (status.value === "authenticated") {
    navigateTo("/github");
  } else {
    signIn("github");
  }
};
</script>

<template>
  <div class="flex flex-col gap-3 w-full overflow-hidden">
    <div
      class="flex flex-col gap-3 md:gap-5 p-3 md:p-5 bg-white rounded-2xl overflow-auto border border-gray-200 shadow-inner"
    >
      <div
        class="bg-gradient-to-t from-gray-100 to-gray-300 rounded-xl p-8 shadow-md"
      >
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-3xl md:text-5xl font-bold mb-4">
            Automate Your GitHub Documentation
          </h1>
          <p class="text-lg md:text-xl mb-8">
            Transform your repository documentation with AI-powered README
            generation and management
          </p>
          <div class="flex flex-col md:flex-row gap-4 justify-center">
            <Button
              :label="
                status === 'authenticated'
                  ? 'Go to Dashboard'
                  : 'Connect GitHub'
              "
              class="flex items-center gap-2"
              size="large"
              @click="handleGetStarted"
            >
              <template #icon>
                <Icon
                  :name="
                    status === 'authenticated'
                      ? 'hugeicons:dashboard-square-02'
                      : 'hugeicons:github'
                  "
                />
              </template>
            </Button>
            <NuxtLink to="/pricing" prefetch>
              <Button
                label="View Plans"
                class="flex items-center gap-2 !border-black !bg-transparent"
                size="large"
                outlined
              >
                <template #icon>
                  <Icon name="hugeicons:tag-02" />
                </template>
              </Button>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
        >
          <div class="flex flex-col items-center text-center">
            <div class="bg-primary/10 p-4 rounded-full mb-4">
              <Icon :name="feature.icon" class="text-4xl text-primary" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              {{ feature.title }}
            </h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-xl p-8 text-center">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Ready to enhance your GitHub workflow?
        </h2>
        <p class="text-gray-600 mb-6 text-base md:text-lg">
          Join developers who are streamlining their documentation process with
          AI
        </p>
        <Button
          :label="
            status === 'authenticated' ? 'Access Dashboard' : 'Get Started Free'
          "
          class="flex items-center gap-2"
          severity="primary"
          size="large"
          @click="handleGetStarted"
        >
          <template #icon>
            <Icon
              :name="
                status === 'authenticated'
                  ? 'hugeicons:dashboard-square-02'
                  : 'hugeicons:github'
              "
            />
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>
