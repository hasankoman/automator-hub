<script setup>
const { data: authData, status, signIn } = useAuth();

const features = [
  {
    title: "GitHub Integration",
    description: "Seamlessly manage your GitHub repositories and workflows",
    icon: "hugeicons:github",
  },
  {
    title: "Repository Management",
    description: "Organize and track your repositories efficiently",
    icon: "hugeicons:folder-02",
  },
  {
    title: "Easy Settings",
    description: "Customize your experience with simple configuration options",
    icon: "hugeicons:settings-01",
  },
  {
    title: "Usage Analytics",
    description: "Monitor your GitHub activity and repository metrics",
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
    <Header />
    <div
      class="flex flex-col gap-5 p-5 bg-white rounded-2xl overflow-auto border border-gray-200 shadow-inner"
    >
      <div class="bg-white rounded-xl p-8 shadow-md border-1 border-gray-200">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl font-bold text-gray-800 mb-4">
            Welcome to GitHub Manager
          </h1>
          <p class="text-xl text-gray-600 mb-8">
            Your all-in-one solution for managing GitHub repositories and
            workflows
          </p>
          <div class="flex gap-4 justify-center">
            <Button
              :label="
                status === 'authenticated'
                  ? 'Get Started'
                  : 'Sign In with GitHub'
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
                      ? 'hugeicons:play-circle'
                      : 'hugeicons:github'
                  "
                />
              </template>
            </Button>
            <Button
              label="View Pricing"
              class="flex items-center gap-2"
              size="large"
              outlined
              @click="$router.push('/pricing')"
            >
              <template #icon>
                <Icon name="hugeicons:tag-02" />
              </template>
            </Button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="bg-white rounded-xl p-6 shadow-md transition-shadow border-1 border-gray-200"
        >
          <div class="flex flex-col items-center text-center">
            <Icon :name="feature.icon" class="text-4xl mb-4 text-primary" />
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              {{ feature.title }}
            </h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>

      <div class="bg-primary/10 rounded-xl p-8 text-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">
          Ready to streamline your GitHub workflow?
        </h2>
        <p class="text-gray-600 mb-6">
          Join thousands of developers who are already using GitHub Manager
        </p>
        <Button
          :label="
            status === 'authenticated'
              ? 'Start Managing Your Repositories'
              : 'Sign In with GitHub'
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
                  ? 'hugeicons:github'
                  : 'hugeicons:github'
              "
            />
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>
