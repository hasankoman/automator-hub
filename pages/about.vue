<template>
  <div
    class="flex flex-col bg-gray-50 rounded-2xl overflow-hidden border-1 border-gray-200 relative"
  >
    <div
      class="p-3 md:p-5 bg-white/70 backdrop-blur-sm border-b border-gray-200 absolute top-0 z-20 w-full"
      ref="aboutHeader"
    >
      <h2 class="font-bold text-gray-900">About Us</h2>
      <p class="mt-2 text-sm md:text-base text-gray-600">
        We are here to automate your GitHub documentation!
      </p>
    </div>

    <div class="flex-1 p-5 pt-30 gap-8 overflow-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div class="p-4 bg-white rounded-xl shadow-xs border border-gray-200">
          <h3 class="text-lg font-semibold">Our Mission</h3>
          <p class="text-gray-600">
            To provide AI-powered solutions to make it easier for developers to
            manage their documentation.
          </p>
        </div>
        <div
          class="flex flex-col gap-1 items-center p-4 bg-white rounded-xl shadow-xs border border-gray-200"
        >
          <h4 class="font-semibold">Hüseyin Koman</h4>
          <p class="text-gray-600">SEO & Full Stack Developer</p>
          <div class="flex gap-2">
            <Icon name="mdi:github" class="text-gray-600" />
            <Icon name="mdi:linkedin" class="text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
