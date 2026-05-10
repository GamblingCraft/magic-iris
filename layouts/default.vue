<template>
  <div class="site-frame">
    <SiteHeader />
    <main>
      <slot />
    </main>
    <LazySiteFooter hydrate-on-visible />
  </div>
</template>
