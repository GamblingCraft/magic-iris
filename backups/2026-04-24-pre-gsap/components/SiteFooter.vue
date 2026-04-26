<script setup lang="ts">
import { contactInfo, footerColumns, showPrograms } from '~/data/site'

const featuredProgram = computed(() => showPrograms[0])
</script>

<template>
  <footer id="contacts" class="site-footer s-footer">
    <div class="container">
      <div class="footer">
        <div class="footer__col">
          <p class="footer__nav-title">{{ footerColumns[0]?.title || 'услуги' }}</p>
          <nav class="footer__nav">
            <NuxtLink v-for="link in footerColumns[0]?.links" :key="link.href + link.label" :to="link.href">
              {{ link.label }}
            </NuxtLink>
          </nav>
          <div class="footer__col__bottom"></div>
        </div>

        <div class="footer__col">
          <p class="footer__nav-title">{{ footerColumns[1]?.title || 'праздники' }}</p>
          <nav class="footer__nav">
            <NuxtLink v-for="link in footerColumns[1]?.links" :key="link.href + link.label" :to="link.href">
              {{ link.label }}
            </NuxtLink>
          </nav>
          <div class="footer__col__bottom"></div>
        </div>

        <div class="footer__col">
          <p class="footer__nav-title">{{ footerColumns[2]?.title || 'о нас' }}</p>
          <nav class="footer__nav">
            <NuxtLink v-for="link in footerColumns[2]?.links" :key="link.href + link.label" :to="link.href">
              {{ link.label }}
            </NuxtLink>
          </nav>
          

          <div style="margin-top: 24px;">
            <p class="footer__nav-title" style="margin-bottom: 0.55em;">популярное</p>
            <nav class="footer__nav">
              <NuxtLink to="/pod-klyuch">праздники «под ключ»</NuxtLink>
              <NuxtLink to="/corporate">корпоративным клиентам</NuxtLink>
            </nav>
          </div>
          <div class="footer__col__bottom"></div>
        </div>

        <div class="footer__col footer__col--last">
          <div class="footer__col__phone-actions">
            <a class="footer__phone" :href="`tel:${contactInfo.phoneRaw}`">{{ contactInfo.phoneDisplay }}</a>
            <a
              class="button button--accent btn footer__callback"
              :href="contactInfo.max || contactInfo.whatsapp"
              target="_blank"
              rel="noreferrer"
            >
              <span>Консультация</span>
            </a>
          </div>

          <div class="footer__col__bottom">
            <div class="footer__messengers">
              <!-- Telegram -->
              <a class="footer__messenger" :href="contactInfo.telegram" target="_blank" rel="noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 33 32" fill="none">
                  <g clip-path="url(#clip_tg_footer)">
                    <path d="M16.5 0C12.2575 0 8.185 1.68675 5.1875 4.68625C2.18693 7.68696 0.500859 11.7565 0.5 16C0.5 20.2417 2.1875 24.3142 5.1875 27.3137C8.185 30.3132 12.2575 32 16.5 32C20.7425 32 24.815 30.3132 27.8125 27.3137C30.8125 24.3142 32.5 20.2417 32.5 16C32.5 11.7583 30.8125 7.68575 27.8125 4.68625C24.815 1.68675 20.7425 0 16.5 0Z" fill="url(#paint_tg_footer)"/>
                    <path d="M7.7425 15.832C12.4075 13.8 15.5175 12.4604 17.0725 11.813C21.5175 9.96478 22.44 9.64378 23.0425 9.63291C23.175 9.63078 23.47 9.66353 23.6625 9.81916C23.8225 9.95041 23.8675 10.1279 23.89 10.2525C23.91 10.377 23.9375 10.6608 23.915 10.8823C23.675 13.4123 22.6325 19.5518 22.1025 22.3855C21.88 23.5845 21.4375 23.9865 21.01 24.0258C20.08 24.1113 19.375 23.4118 18.475 22.822C17.0675 21.8988 16.2725 21.3243 14.905 20.4235C13.325 19.3825 14.35 18.8103 15.25 17.8753C15.485 17.6305 19.58 13.9068 19.6575 13.569C19.6675 13.5268 19.6775 13.3693 19.5825 13.2863C19.49 13.203 19.3525 13.2315 19.2525 13.254C19.11 13.286 16.8625 14.773 12.5025 17.7148C11.865 18.1533 11.2875 18.367 10.7675 18.3558C10.1975 18.3435 9.0975 18.0328 8.28 17.7673C7.28 17.4415 6.4825 17.2693 6.5525 16.716C6.5875 16.428 6.985 16.1333 7.7425 15.832Z" fill="white"/>
                  </g>
                  <defs>
                    <linearGradient id="paint_tg_footer" x1="1600.5" y1="0" x2="1600.5" y2="3200" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#2AABEE"/>
                      <stop offset="1" stop-color="#229ED9"/>
                    </linearGradient>
                    <clipPath id="clip_tg_footer">
                      <rect width="32" height="32" fill="white" transform="translate(0.5)"/>
                    </clipPath>
                  </defs>
                </svg>
                <span>Telegram</span>
              </a>

              <!-- MAX (вместо WhatsApp) -->
              <a class="footer__messenger" :href="contactInfo.max || contactInfo.whatsapp" target="_blank" rel="noreferrer">
                <svg width="18" height="18" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M41.6748 20.8374C41.6748 9.32922 32.3456 0 20.8374 0C9.32922 0 0 9.32922 0 20.8374C0 32.3456 9.32922 41.6748 20.8374 41.6748C32.3456 41.6748 41.6748 32.3456 41.6748 20.8374Z" fill="url(#paint_max_footer)"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M21.0498 30.6693C19.1091 30.6693 18.2071 30.3847 16.6393 29.2465C15.6477 30.527 12.5074 31.5278 12.3704 29.8156C12.3704 28.5303 12.0871 27.4443 11.766 26.2586C11.3835 24.7978 10.949 23.1711 10.949 20.814C10.949 15.1843 15.5485 10.949 20.998 10.949C26.452 10.949 30.7257 15.393 30.7257 20.866C30.744 26.2546 26.415 30.6406 21.0498 30.6693ZM21.1302 15.8151C18.4763 15.6775 16.4079 17.5224 15.9499 20.4156C15.572 22.8106 16.2426 25.7274 16.8141 25.8791C17.088 25.9456 17.7774 25.3859 18.2071 24.9543C18.9176 25.4473 19.7451 25.7434 20.606 25.8127C23.3559 25.9456 25.7055 23.8431 25.8901 21.0843C25.9976 18.3196 23.8804 15.978 21.1302 15.8199V15.8151Z" fill="white"/>
                  <defs>
                    <linearGradient id="paint_max_footer" x1="-2.13509e-08" y1="20.8374" x2="40.7013" y2="23.7031" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#4757F9"/>
                      <stop offset="1" stop-color="#9261EA"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span>MAX</span>
              </a>

              <!-- VK -->
              <a class="footer__messenger" :href="contactInfo.vk" target="_blank" rel="noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.162 5.656c.132-.412 0-.656-.54-.656H19.27c-.453 0-.663.236-.78.495 0 0-1.498 3.594-2.132 4.396-.41.428-.598.564-.822.564-.112 0-.274-.136-.274-.548V5.656c0-.44-.12-.656-.518-.656h-3.16c-.288 0-.462.21-.462.41 0 .43.654.53.72 1.74v2.63c0 .576-.104.68-.332.68-.598 0-2.05-2.18-2.91-4.672-.17-.488-.34-.668-.79-.668H5.63c-.508 0-.61.236-.61.495 0 .464.614 2.766 2.86 5.81 1.494 2.115 3.6 3.26 5.52 3.26 1.15 0 1.29-.258 1.29-.704v-1.624c0-.484.102-.582.444-.582.252 0 .684.126 1.694 1.094 1.152 1.152 1.342 1.668 1.99 1.668h2.474c.508 0 .762-.258.616-.766-.16-.502-.74-1.23-1.506-2.094-.426-.498-1.064-1.034-1.26-1.302-.27-.352-.192-.508 0-.822.004 0 2.2-3.096 2.43-4.146z" fill="#0077FF"/>
                </svg>
                <span>VK</span>
              </a>
            </div>
            <p class="footer__socials__note">
              Свяжемся, подберём формат и соберём сценарий под площадку, тайминг и гостей.
            </p>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-bottom__logo">{{ contactInfo.siteName || 'Magic Iris' }}</div>
        <p class="footer-bottom__wide">
          {{ contactInfo.siteName || 'Magic Iris' }} · шоу и мастер-классы для свадеб, корпоративов, городских событий и камерных праздников.
        </p>
        <p>{{ contactInfo.city || 'Иркутск' }} · выездной формат · сервис и техника под ключ.</p>
        <a :href="contactInfo.max || contactInfo.whatsapp" target="_blank" rel="noreferrer">Написать в MAX</a>
        <a :href="contactInfo.telegram" target="_blank" rel="noreferrer">Написать в Telegram</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Центрирование контента футера */
.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 32px;
  width: 100%;
}

.site-footer {
  width: 100%;
  background: var(--black, #0a0a0c);
}

.footer {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(20px, 2vw, 40px);
  padding: clamp(44px, 7vw, 84px) 0;
  width: 100%;
}

.footer__col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer__col--last {
  justify-content: space-between;
}

.footer__nav-title {
  margin: 0 0 0.55em;
  font-family: var(--font-title, system-ui);
  font-size: clamp(20px, 1.8vw, 32px);
  line-height: 1;
  color: #fff;
  font-weight: 600;
  text-transform: uppercase;
}

.footer__nav {
  display: grid;
  gap: 0.5em;
  font-family: var(--font-title, system-ui);
  font-size: 15px;
}

.footer__nav a {
  color: rgba(255, 255, 255, 0.72);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer__phone {
  font-family: var(--font-title, system-ui);
  font-size: clamp(22px, 2vw, 34px);
  line-height: 1;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
}

.button--accent {
  background: var(--salat, #b7d968);
  color: #1a1a1a;
}

.footer__callback {
  width: 100%;
  margin-top: 14px;
  text-align: center;
}

.footer__messengers {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border-radius: 15px;
  background: #7364ca;
  margin-bottom: 12px;
}

.footer__messenger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 40px;
  transition: background 0.2s;
}

.footer__messenger:hover {
  background: rgba(255, 255, 255, 0.1);
}

.footer__socials__note {
  margin-top: 12px;
  color: #9d9d9d;
  font-size: 13px;
  line-height: 1.35;
}

.footer-bottom {
  position: relative;
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 20px 30px;
  padding: 28px 0 42px;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  width: 100%;
}

.footer-bottom__logo {
  position: absolute;
  inset: 50% 0 auto;
  transform: translateY(-50%);
  color: #303030;
  font-size: clamp(96px, 17vw, 280px);
  font-weight: 700;
  letter-spacing: -0.08em;
  line-height: 0.8;
  text-transform: uppercase;
  user-select: none;
  pointer-events: none;
  white-space: nowrap;
}

.footer-bottom p,
.footer-bottom a {
  color: rgba(255, 255, 255, 0.62);
  font-size: 13px;
  line-height: 1.35;
  text-decoration: none;
}

.footer-bottom a {
  color: var(--salat, #b7d968);
  text-decoration: underline;
  text-underline-offset: 0.25em;
}

/* Адаптив */
@media (max-width: 1024px) {
  .container {
    padding: 0 20px;
  }
  
  .footer {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
  
  .footer-bottom {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .footer {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .footer-bottom {
    grid-template-columns: 1fr;
  }
  
  .footer-bottom__logo {
    display: none;
  }
}
</style>