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

import { animate, inView, stagger, hover } from "motion";

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

const testimonials = [
  {
    quote:
      "Automator Hub saved me countless hours updating documentation. The AI-generated READMEs are comprehensive and actually match my codebase!",
    name: "Sarah Chen",
    role: "Senior Developer @TechCorp",
    rating: 5,
  },
  {
    quote:
      "Our team's documentation is now consistent across all repositories. The automatic updates have made onboarding new developers so much easier.",
    name: "Marcus Johnson",
    role: "CTO @DevStartup",
    rating: 5,
  },
  {
    quote:
      "What impressed me most was how the AI understood our code architecture and created documentation that actually makes sense to newcomers.",
    name: "Alex Rivera",
    role: "Lead Engineer @CodeLabs",
    rating: 5,
  },
];

const plans = [
  {
    name: "Free",
    price: "Start",
    isFree: true,
    features: ["3 repositories", "Basic README generation", "Manual updates"],
  },
  {
    name: "Pro",
    price: "$9/mo",
    isFree: false,
    popular: true,
    features: [
      "10 repositories",
      "Advanced documentation",
      "Automatic updates",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "$29/mo",
    isFree: false,
    features: [
      "Unlimited repositories",
      "Custom templates",
      "Team collaboration",
      "API access",
    ],
  },
];

const faqItems = [
  {
    question: "How does the AI generate documentation?",
    answer:
      "Our AI analyzes your repository's code structure, comments, commit history, and file organization to generate comprehensive documentation that accurately reflects your project's architecture, features, and setup instructions.",
  },
  {
    question: "Is my code secure when using Automator Hub?",
    answer:
      "Yes, your code remains secure. We use GitHub's OAuth integration and only request the minimum permissions needed. Your code is never stored on our servers permanently, and all communication is encrypted.",
  },
  {
    question: "How do automatic updates work?",
    answer:
      "With automatic updates (Pro plan feature), our system monitors your repository for significant changes. When detected, it automatically regenerates and updates your README file to reflect the latest code changes, saving you time and keeping documentation current.",
  },
  {
    question: "Can I customize the generated documentation?",
    answer:
      "Yes, you can edit the AI-generated documentation before it's committed to your repository. You can also provide custom sections or templates that the AI will incorporate into the final documentation.",
  },
  {
    question: "What if I'm not satisfied with the generated documentation?",
    answer:
      "You can provide feedback on the generated documentation, and our AI will learn from your preferences. We also offer a satisfaction guarantee - if you're not happy with the results, contact our support team for assistance.",
  },
];

const { status, signIn } = useAuth();
const mobileMenuOpen = ref(false);
const showFeatures = ref(false);
const activeSection = ref("hero");
const isScrolling = ref(false);
const scrollContainer = ref(null);
const scrollContent = ref(null);
let animationId = null;
let scrollPosition = 0;
const scrollSpeed = 0.5; // pixels per frame

// Function to handle the scrolling animation
const animateScroll = () => {
  if (!scrollContainer.value || !scrollContent.value) return;

  scrollPosition += scrollSpeed;

  // Reset scroll position when reaching the bottom
  if (
    scrollPosition >=
    scrollContent.value.scrollHeight - scrollContainer.value.clientHeight
  ) {
    // Pause at the bottom for 2 seconds before resetting
    setTimeout(() => {
      scrollPosition = 0;
    }, 2000);
  }

  scrollContainer.value.scrollTop = scrollPosition;
  animationId = requestAnimationFrame(animateScroll);
};

// Clean up the animation when the component is unmounted
onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});

const isAuthenticated = computed(() => status.value === "authenticated");

// Navigation links for header and footer
const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

onMounted(() => {
  setTimeout(() => {
    animationId = requestAnimationFrame(animateScroll);
    // Add pause on hover functionality
    if (scrollContainer.value) {
      scrollContainer.value.addEventListener("mouseenter", () => {
        cancelAnimationFrame(animationId);
      });

      scrollContainer.value.addEventListener("mouseleave", () => {
        animationId = requestAnimationFrame(animateScroll);
      });
    }
  }, 1000);

  // Initialize animations
  initAnimations();

  // Set up intersection observers for sections
  setupSectionObservers();

  // Show features with a slight delay
  setTimeout(() => {
    showFeatures.value = true;
  }, 500);

  // Add scroll event listener for header
  window.addEventListener("scroll", handleScroll);
});

const initAnimations = () => {
  // Animate hero section elements
  inView("section#hero h1", (target) => {
    animate(
      target,
      { opacity: [0, 1], y: [20, 0] },
      { duration: 0.8, delay: 0.2 }
    );
    return () =>
      animate(target, {
        opacity: 0,
        y: 20,
      });
  });
  inView("section#hero p", (target) => {
    animate(
      target,
      { opacity: [0, 1], y: [20, 0] },
      { duration: 0.8, delay: 0.4 }
    );
    return () =>
      animate(target, {
        opacity: 0,
        y: 20,
      });
  });
  inView("section#hero .hero-button", (target) => {
    animate(
      target,
      { opacity: [0, 1], y: [20, 0] },
      { duration: 0.5, delay: stagger(0.1, { start: 0.6 }) }
    );
    return () =>
      animate(target, {
        opacity: 0,
        y: 20,
      });
  });
  inView("section#hero .readme-container", (target) => {
    animate(
      target,
      { opacity: [0, 1], x: [100, 0], scale: [0.9, 1] },
      { duration: 0.9, easing: [0.17, 0.55, 0.55, 1] }
    );
    return () =>
      animate(target, {
        opacity: 0,
        x: 100,
        scale: 0.9,
      });
  });

  // Animate trusted by section
  inView("section#trusted-by", (target) => {
    animate(
      target.querySelectorAll(".company-card"),
      {
        opacity: [0, 1],
        scale: [0.9, 1],
      },
      { duration: 0.5, delay: stagger(0.15) }
    );
    return () =>
      animate(target.querySelectorAll(".company-card"), {
        opacity: 0,
        scale: 0.9,
      });
  });

  // Animate feature cards
  inView(".feature-card", (target) => {
    const index = parseInt(target.id.replace("feature-", ""));
    const isMobile = useDevice().isMobile;
    animate(
      target,
      { opacity: [0, 1], y: [100, 0], scale: [0.7, 1] },
      { duration: 0.5, delay: isMobile ? 0.15 : 0.15 * (index + 1) }
    );
    return () =>
      animate(target, {
        opacity: 0,
        y: 100,
        scale: 0.7,
      });
  });

  // Animate how it works steps
  inView(".steps-container", (target) => {
    animate(
      target.querySelectorAll(".step-card"),
      { opacity: 1, x: [-100, 0] },
      { delay: stagger(0.3), duration: 0.3 }
    );

    return () =>
      animate(target.querySelectorAll(".step-card"), {
        opacity: 0,
        x: -100,
      });
  });

  // Animate testimonials
  inView(".testimonials-container", (target) => {
    animate(
      target.querySelectorAll(".testimonial-card"),
      { opacity: [0, 1], scale: [0.95, 1] },
      { duration: 0.5, delay: stagger(0.15) }
    );
    return false;
  });
};

const setupSectionObservers = () => {
  const sections = document.querySelectorAll("section[id]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id;
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
};

const handleScroll = () => {
  isScrolling.value = window.scrollY > 50;
};

const handleGetStarted = () => {
  if (isAuthenticated.value) {
    navigateTo("/github");
  } else {
    signIn("github");
  }
};

const selectPlan = (plan) => {
  if (isAuthenticated.value) {
    if (plan.isFree) {
      // Handle free plan selection
      navigateTo("/github");
    } else {
      navigateTo("/payment");
    }
  } else {
    signIn("github");
  }
};

const contactSales = () => {
  window.location.href = "mailto:sales@automator-hub.com";
};

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
  // Close mobile menu after navigation
  mobileMenuOpen.value = false;
};
</script>

<template>
  <div class="flex flex-col gap-3 w-full overflow-hidden">
    <div
      class="flex flex-col bg-white rounded-2xl overflow-auto border border-gray-200 shadow-inner"
    >
      <!-- Hero Section -->
      <section
        id="hero"
        class="py-5 xl:py-10 lg:min-h-[80vh] bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center"
      >
        <div class="max-w-screen-xl m-auto px-4">
          <div
            class="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-12 items-center"
          >
            <div
              class="col-span-1 flex flex-col gap-y-4 xl:gap-y-8 hero-content order-2 lg:order-1"
            >
              <h1
                class="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-gray-900 to-gray-300 bg-clip-text text-transparent"
              >
                Automation for Developers
              </h1>

              <p class="text-md md:text-xl text-gray-600 max-w-xl">
                Transform your repository documentation with intelligent README
                generation and management that keeps pace with your code
                changes.
              </p>

              <div class="flex flex-col items-start sm:flex-row gap-4">
                <Button
                  :label="isAuthenticated ? 'Go to Dashboard' : 'Get Started'"
                  class="hero-button"
                  @click="handleGetStarted"
                >
                  <template #icon>
                    <Icon
                      :name="
                        isAuthenticated
                          ? 'hugeicons:dashboard-square-02'
                          : 'hugeicons:github'
                      "
                      class="w-5 h-5"
                    />
                  </template>
                </Button>

                <NuxtLink to="/pricing" prefetch class="hero-button">
                  <Button
                    label="
                    View Plans
                  "
                    class="hero-button"
                  >
                    <template #icon>
                      <Icon name="hugeicons:tag-02" class="w-5 h-5" />
                    </template>
                  </Button>
                </NuxtLink>
              </div>
            </div>

            <div
              class="col-span-1 relative readme-container order-1 md:order-2"
            >
              <div
                class="relative bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200"
              >
                <!-- Window header with dots -->
                <div
                  class="absolute top-0 left-0 right-0 h-8 lg:h-12 bg-gray-100 flex items-center px-4"
                >
                  <div class="flex gap-x-2">
                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                    <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>

                <!-- Content area -->
                <div class="pt-8 lg:pt-12 p-4 lg:p-6">
                  <div class="flex items-center gap-3 my-3 lg:my-4">
                    <div
                      class="w-8 h-8 bg-black/10 rounded-md flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="text-black"
                      >
                        <path
                          d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
                        ></path>
                        <path d="M9 18c-4.51 2-5-2-7-2"></path>
                      </svg>
                    </div>
                    <h3 class="font-semibold">README.md</h3>
                  </div>

                  <!-- Scrollable content -->
                  <div ref="scrollContainer" class="h-80 overflow-hidden">
                    <div
                      ref="scrollContent"
                      class="gap-y-4 flex flex-col text-sm text-gray-700"
                    >
                      <p class="font-bold text-xl">Project Documentation</p>

                      <div class="flex flex-col gap-y-2">
                        <p class="font-semibold text-base">Overview</p>
                        <p>
                          This project is a comprehensive solution for managing
                          and visualizing data through an intuitive interface.
                          It provides a robust set of tools for data analysis,
                          user management, and third-party integrations.
                        </p>
                      </div>

                      <div class="flex flex-col gap-y-2">
                        <p class="font-semibold text-base">Features</p>
                        <ul class="list-disc pl-5 gap-y-1">
                          <li>
                            User authentication with multi-factor authentication
                            support
                          </li>
                          <li>
                            Role-based access control for secure data management
                          </li>
                          <li>
                            Interactive data visualization with customizable
                            charts and graphs
                          </li>
                          <li>Real-time data updates and notifications</li>
                          <li>
                            Comprehensive API integration with popular services
                          </li>
                          <li>
                            Export functionality for reports in multiple formats
                            (PDF, CSV, Excel)
                          </li>
                          <li>
                            Responsive design for desktop and mobile devices
                          </li>
                          <li>
                            Dark mode support for improved user experience
                          </li>
                        </ul>
                      </div>

                      <div class="flex flex-col gap-y-2">
                        <p class="font-semibold text-base">Installation</p>
                        <p>Clone the repository and install dependencies:</p>
                        <pre class="bg-gray-100 p-2 rounded-md">
git clone https://github.com/username/project.git
cd project
npm install</pre
                        >

                        <p class="mt-2">
                          Configure your environment variables:
                        </p>
                        <pre class="bg-gray-100 p-2 rounded-md">
cp .env.example .env
# Edit .env with your configuration</pre
                        >

                        <p class="mt-2">Start the development server:</p>
                        <pre class="bg-gray-100 p-2 rounded-md">
npm run dev</pre
                        >
                      </div>

                      <div class="flex flex-col gap-y-2">
                        <p class="font-semibold text-base">Usage</p>
                        <p>
                          After starting the development server, navigate to
                          <code>http://localhost:3000</code> in your browser.
                        </p>

                        <p class="mt-2">For production deployment:</p>
                        <pre class="bg-gray-100 p-2 rounded-md">
npm run build
npm run start</pre
                        >
                      </div>

                      <div class="flex flex-col gap-y-2">
                        <p class="font-semibold text-base">API Documentation</p>
                        <p>
                          The API endpoints are documented using Swagger and can
                          be accessed at <code>/api/docs</code> when running the
                          development server.
                        </p>

                        <p class="mt-2">Example API request:</p>
                        <pre class="bg-gray-100 p-2 rounded-md">
fetch('/api/data', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  }
})</pre
                        >
                      </div>

                      <div class="flex flex-col gap-y-2">
                        <p class="font-semibold text-base">Contributing</p>
                        <p>
                          Contributions are welcome! Please follow these steps:
                        </p>
                        <ol class="list-decimal pl-5 gap-y-1">
                          <li>Fork the repository</li>
                          <li>
                            Create a feature branch:
                            <code>git checkout -b feature/your-feature</code>
                          </li>
                          <li>
                            Commit your changes:
                            <code>git commit -m 'Add your feature'</code>
                          </li>
                          <li>
                            Push to the branch:
                            <code>git push origin feature/your-feature</code>
                          </li>
                          <li>Submit a pull request</li>
                        </ol>
                      </div>

                      <div class="flex flex-col gap-y-2">
                        <p class="font-semibold text-base">License</p>
                        <p>
                          This project is licensed under the MIT License - see
                          the LICENSE file for details.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="mt-3 lg:mt-4 flex justify-end">
                    <div
                      class="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                    >
                      Automator Hub generated
                    </div>
                  </div>
                </div>
              </div>

              <!-- Decorative elements -->
              <div
                class="absolute -z-10 -bottom-10 -right-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"
              ></div>
              <div
                class="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-2xl"
              ></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Trusted By Section -->
      <section class="py-12 px-4 bg-white" id="trusted-by">
        <div class="max-w-screen-xl mx-auto flex flex-col items-center gap-3">
          <p class="text-center text-gray-600 font-medium text-lg">
            Companies of all sizes trust Automator Hub to document their
            projects.
          </p>
          <div
            class="flex flex-wrap justify-center gap-4 lg:gap-8 company-container"
          >
            <div
              v-for="company in [
                { icon: 'mdi:microsoft', label: 'Microsoft' },
                { icon: 'mdi:apple', label: 'Apple' },
                { icon: 'mdi:google', label: 'Google' },
                { icon: 'mdi:amazon', label: 'Amazon' },
                { icon: 'mdi:facebook', label: 'Facebook' },
                { icon: 'mdi:github', label: 'GitHub' },
              ]"
              :key="company.label"
              class="py-1 px-3 lg:py-3 lg:px-6 bg-gray-200 rounded-md opacity-70 flex items-center justify-center gap-3 company-card"
            >
              <Icon :name="company.icon" class="text-lg lg:text-2xl" />
              <span class="text-lg">{{ company.label }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="py-20 md:py-28 bg-gray-50">
        <div
          class="max-w-screen-xl flex flex-col gap-y-16 items-center text-center mx-auto px-4"
        >
          <div class="flex flex-col items-center gap-4">
            <h2 class="font-bold flex items-center flex-col lg:flex-row">
              <CommonShine text="Supercharge Your" />
              <span class="text-gray-800 ml-2 text-xl lg:text-2xl xl:text-3xl"
                >Documentation</span
              >
            </h2>
            <p class="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI-powered tools make creating and maintaining GitHub
              documentation effortless
            </p>
          </div>

          <div
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 features-container overflow-hidden"
          >
            <div
              v-for="(feature, index) in features"
              :key="feature.title"
              class="bg-gradient-to-r from-gray-300 to-gray-800 p-1 rounded-xl gradient-shine opacity-0 feature-card"
              :id="`feature-${index}`"
            >
              <div
                class="bg-white/95 backdrop-blur-sm rounded-xl p-6 h-full flex flex-col items-center"
              >
                <Icon :name="feature.icon" class="!text-4xl !h-12" />
                <h3 class="text-xl font-semibold mb-3">
                  {{ feature.title }}
                </h3>
                <p class="text-sm">
                  {{ feature.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section id="how-it-works" class="py-20 md:py-28 bg-white">
        <div class="flex flex-col gap-6 mx-auto px-4">
          <div class="flex flex-col items-center gap-4">
            <h2 class="font-bold flex items-center flex-col lg:flex-row">
              <CommonShine text="Simple Process" />
              <span class="text-gray-800 ml-2 text-xl lg:text-2xl xl:text-3xl"
                >Big Results</span
              >
            </h2>
            <p class="text-lg text-gray-600 max-w-3xl mx-auto">
              Get your repository documentation updated in three simple steps
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 steps-container">
            <div
              v-for="(step, index) in 3"
              :key="index"
              class="step-card relative bg-gray-50 rounded-xl p-8 border border-gray-200 hover:border-black/30 hover:shadow-md opacity-0"
              :style="{
                transform: 'translateX(-100%)',
                zIndex: 10 - index,
              }"
            >
              <div class="flex flex-col items-center text-center">
                <div
                  class="bg-black/10 p-5 rounded-full mb-6 relative flex items-center justify-center"
                >
                  <span
                    class="absolute -top-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold shadow-lg"
                    >{{ index + 1 }}</span
                  >
                  <Icon
                    :name="
                      [
                        'hugeicons:github',
                        'hugeicons:book-open-01',
                        'hugeicons:magic-wand-02',
                      ][index]
                    "
                    class="text-4xl text-black"
                  />
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-3">
                  {{
                    [
                      "Connect GitHub",
                      "Select Repositories",
                      "Generate Documentation",
                    ][index]
                  }}
                </h3>
                <p class="text-gray-600">
                  {{
                    [
                      "Securely connect your GitHub account to access your repositories",
                      "Choose which repositories need documentation updates",
                      "Our AI analyzes your code and creates professional README files",
                    ][index]
                  }}
                </p>
              </div>

              <!-- Connection lines between steps (only on desktop) -->
              <div
                v-if="index < 2"
                class="hidden md:block absolute top-1/2 right-0 translate-x-full w-8 h-0.5 bg-gray-300"
              ></div>
            </div>
          </div>

          <!-- Demo button -->
          <div class="mt-12 text-center">
            <button
              class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Icon name="hugeicons:play-circle" class="text-black" />
              <span>Watch how it works</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Pricing Section -->
      <section id="pricing" class="py-20 md:py-28 bg-gray-50" v-if="false">
        <div class="flex flex-col gap-6 mx-auto px-4">
          <div class="flex flex-col items-center gap-4">
            <span
              class="inline-block px-4 py-1 bg-black/10 text-black rounded-full text-sm font-medium mb-4"
              >Pricing</span
            >
            <h2 class="font-bold flex items-center flex-col lg:flex-row">
              <CommonShine text="Affordable, Flexible" />
              <span class="text-gray-800 ml-2 text-xl lg:text-2xl xl:text-3xl"
                >Solutions</span
              >
            </h2>
            <p class="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Choose the plan that works best for your documentation needs
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div
              v-for="(plan, index) in plans"
              :key="plan.name"
              :class="[
                'bg-white rounded-xl p-8 border transition-all duration-300',
                plan.popular
                  ? 'border-black shadow-xl scale-105 relative z-10'
                  : 'border-gray-200 shadow-md hover:shadow-lg',
              ]"
            >
              <!-- Popular badge -->
              <div
                v-if="plan.popular"
                class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-sm font-medium"
              >
                Most Popular
              </div>

              <div class="flex flex-col h-full">
                <div class="mb-6">
                  <h3 class="text-2xl font-bold mb-2">{{ plan.name }}</h3>
                  <div class="flex items-end gap-1">
                    <span class="text-3xl font-bold">{{ plan.price }}</span>
                    <span v-if="!plan.isFree" class="text-gray-500 mb-1"
                      >/month</span
                    >
                  </div>
                </div>

                <ul class="gap-y-3 mb-8 flex-grow">
                  <li
                    v-for="feature in plan.features"
                    :key="feature"
                    class="flex items-center gap-2"
                  >
                    <Icon
                      name="hugeicons:check-circle"
                      class="text-green-500 w-5 h-5"
                    />
                    <span>{{ feature }}</span>
                  </li>
                </ul>

                <button
                  :class="[
                    'w-full py-3 rounded-lg font-medium transition-colors',
                    plan.popular
                      ? 'bg-black text-white hover:bg-black/90'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
                  ]"
                  @click="selectPlan(plan)"
                >
                  {{ plan.isFree ? "Get Started" : "Subscribe" }}
                </button>
              </div>
            </div>
          </div>

          <!-- Enterprise callout -->
          <div
            class="mt-12 max-w-4xl mx-auto bg-white rounded-xl p-8 border border-gray-200 shadow-md"
          >
            <div
              class="flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div>
                <h3 class="text-xl font-bold mb-2">Need a custom solution?</h3>
                <p class="text-gray-600">
                  Contact our sales team for volume discounts and custom
                  features
                </p>
              </div>
              <button
                class="whitegap-nowrap px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                @click="contactSales"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="py-20 md:py-28 bg-white">
        <div class="flex flex-col gap-6 mx-auto px-4">
          <div class="flex flex-col items-center gap-4">
            <h2 class="font-bold flex items-center flex-col lg:flex-row">
              <CommonShine text="Real Developer" />
              <span class="text-gray-800 ml-2 text-xl lg:text-2xl xl:text-3xl"
                >Experiences</span
              >
            </h2>
            <p class="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from developers who have transformed their documentation
              workflow
            </p>
          </div>

          <div
            class="grid grid-cols-1 md:grid-cols-3 gap-8 testimonials-container"
          >
            <div
              v-for="(testimonial, index) in testimonials"
              :key="index"
              class="testimonial-card bg-gray-50 rounded-xl p-8 border border-gray-200 hover:shadow-md transition-all"
            >
              <div class="flex flex-col h-full gap-y-4">
                <div class="flex items-center">
                  <div class="text-yellow-400 flex">
                    <Icon
                      name="line-md:star-filled"
                      class="text-xl"
                      v-for="i in testimonial.rating"
                      :key="i"
                    />
                  </div>
                </div>
                <p class="text-gray-700 mb-6 italic flex-grow">
                  "{{ testimonial.quote }}"
                </p>
                <div class="mt-auto flex items-center">
                  <div
                    class="w-12 h-12 bg-black/20 rounded-full mr-4 flex items-center justify-center"
                  >
                    <Icon name="hugeicons:user-circle" class="text-black" />
                  </div>
                  <div>
                    <h4 class="font-semibold">{{ testimonial.name }}</h4>
                    <p class="text-sm text-gray-600">
                      {{ testimonial.role }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section id="faq" class="py-20 md:py-28 bg-gray-50">
        <div class="flex flex-col gap-6 mx-auto px-4">
          <div class="flex flex-col items-center gap-4">
            <h2 class="font-bold flex items-center flex-col lg:flex-row">
              <CommonShine text="Common Questions" />
              <span class="text-gray-800 ml-2 text-xl lg:text-2xl xl:text-3xl"
                >Expert Answers</span
              >
            </h2>
            <p class="text-lg text-gray-600 max-w-3xl mx-auto">
              Get answers to common questions about Automator Hub
            </p>
          </div>

          <div class="max-w-3xl mx-auto">
            <div class="flex flex-col gap-y-4">
              <div
                v-for="(item, index) in faqItems"
                :key="index"
                class="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <Accordion :value="null">
                  <AccordionPanel>
                    <AccordionHeader>
                      {{ item.question }}
                    </AccordionHeader>
                    <AccordionContent
                      :pt="{
                        content: '!p-0 !pt-1 !bg-transparent',
                      }"
                    >
                      <p class="p-4 text-gray-700">
                        {{ item.answer }}
                      </p>
                    </AccordionContent>
                  </AccordionPanel>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Call to Action Section -->
      <section class="py-20 md:py-28 bg-white">
        <div class="flex flex-col gap-6 mx-auto px-4">
          <div
            class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-10 md:p-16 text-center relative overflow-hidden"
          >
            <!-- Decorative elements -->
            <div
              class="absolute top-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl opacity-30"
            ></div>
            <div
              class="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-30"
            ></div>

            <div class="relative z-10">
              <span
                class="inline-block px-4 py-1 bg-white/10 text-white rounded-full text-sm font-medium mb-6"
                >Ready?</span
              >
              <h2
                class="font-bold flex items-center flex-col lg:flex-row text-white"
              >
                <CommonShine text="Revolutionize Your" />
                <span class="ml-2 text-xl lg:text-2xl xl:text-3xl"
                  >GitHub Experience</span
                >
              </h2>
              <h2 class="text-3xl md:text-4xl font-bold mb-6 text-white">
                Transform your documentation workflow today
              </h2>
              <p class="text-lg text-gray-300 max-w-3xl mx-auto mb-10">
                Join thousands of developers who are saving time and improving
                their GitHub repositories with AI-powered documentation.
              </p>
              <div class="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  class="flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-lg hover:bg-black/90 transition-all shadow-lg hover:shadow-xl"
                  @click="handleGetStarted"
                >
                  <Icon
                    :name="
                      isAuthenticated
                        ? 'hugeicons:dashboard-square-02'
                        : 'hugeicons:github'
                    "
                    class="w-5 h-5"
                  />
                  <span>{{
                    isAuthenticated ? "Go to Dashboard" : "Get Started Free"
                  }}</span>
                </button>

                <NuxtLink to="/pricing" prefetch>
                  <button
                    class="flex items-center justify-center gap-2 px-8 py-4 border-2 border-white bg-transparent text-white rounded-lg hover:bg-white/10 transition-all"
                  >
                    <Icon name="hugeicons:tag-02" class="w-5 h-5" />
                    <span>Explore Plans</span>
                  </button>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-gray-900 text-white py-16">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div class="flex items-center gap-2 mb-6">
                <div
                  class="w-10 h-10 bg-black rounded-lg flex items-center justify-center"
                >
                  <Icon
                    name="hugeicons:book-open-01"
                    class="text-white text-xl"
                  />
                </div>
                <span class="font-bold text-xl">Automator Hub</span>
              </div>
              <p class="text-gray-400 mb-6">
                AI-powered GitHub documentation that saves developers time and
                improves repository quality.
              </p>
              <div class="flex gap-x-4">
                <a
                  href="#"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  <Icon name="hugeicons:github" class="text-xl" />
                </a>
                <a
                  href="#"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  <Icon name="hugeicons:twitter" class="text-xl" />
                </a>
                <a
                  href="#"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  <Icon name="hugeicons:linkedin" class="text-xl" />
                </a>
              </div>
            </div>

            <div>
              <h3 class="font-semibold text-lg mb-6">Product</h3>
              <ul class="gap-y-4">
                <li v-for="link in navLinks" :key="link.name">
                  <a
                    :href="link.href"
                    class="text-gray-400 hover:text-white transition-colors"
                    @click.prevent="scrollToSection(link.href.substring(1))"
                  >
                    {{ link.name }}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="text-gray-400 hover:text-white transition-colors"
                    >Roadmap</a
                  >
                </li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-lg mb-6">Resources</h3>
              <ul class="gap-y-4">
                <li>
                  <a
                    href="#"
                    class="text-gray-400 hover:text-white transition-colors"
                    >Documentation</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="text-gray-400 hover:text-white transition-colors"
                    >Blog</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="text-gray-400 hover:text-white transition-colors"
                    >Support</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="text-gray-400 hover:text-white transition-colors"
                    >API</a
                  >
                </li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-lg mb-6">Company</h3>
              <ul class="gap-y-4">
                <li>
                  <a
                    href="#"
                    class="text-gray-400 hover:text-white transition-colors"
                    >About Us</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="text-gray-400 hover:text-white transition-colors"
                    >Careers</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="text-gray-400 hover:text-white transition-colors"
                    >Privacy Policy</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="text-gray-400 hover:text-white transition-colors"
                    >Terms of Service</a
                  >
                </li>
              </ul>
            </div>
          </div>

          <div
            class="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          >
            <p class="text-gray-400 mb-4 md:mb-0">
              © {{ new Date().getFullYear() }} Automator Hub. All rights
              reserved.
            </p>
            <div class="flex items-center gap-6">
              <a
                href="#"
                class="text-gray-400 hover:text-white text-sm transition-colors"
                >Privacy</a
              >
              <a
                href="#"
                class="text-gray-400 hover:text-white text-sm transition-colors"
                >Terms</a
              >
              <a
                href="#"
                class="text-gray-400 hover:text-white text-sm transition-colors"
                >Cookies</a
              >
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.gradient-shine {
  background-size: 200% auto;
  animation: textShine 1s ease-in-out infinite alternate;
}

.gradient-shine .gradient-text {
  background-size: 200% auto;
  animation: textShine 1s ease-in-out infinite alternate;
}

.icon-wrapper {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.icon-wrapper::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, #1f2937, #6b7280);
  -webkit-mask: var(--un-icon) no-repeat;
  mask: var(--un-icon) no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  background-size: 200% auto;
  animation: textShine 1.5s ease-in-out infinite alternate;
}

.icon-wrapper :deep(span) {
  opacity: 0;
}

@keyframes textShine {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}
</style>
