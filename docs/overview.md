# Lumière Beauté - Project Overview & Tech Stack

## English Overview

### Introduction

Lumière Beauté is a premium, high-performance web application designed for a luxury beauty brand. It features a sophisticated user interface with cinematic transitions, RTL (Right-to-Left) support for Arabic, and a modern technical architecture focused on speed and visual excellence.

### Technologies Used

- **Core Framework**: React 19 (Latest)
- **Styling**: Tailwind CSS 4 (Beta/Vite Plugin) - Utilizing the latest CSS-first approach for styling.
- **Animations**: Framer Motion 12 - Powering the cinematic page transitions and scroll-reveal effects.
- **Internationalization**: i18next & react-i18next - Robust multi-language support (English/Arabic) with automatic language detection.
- **Routing**: React Router 7 - Modern, data-driven navigation.
- **Build Tool**: Vite 7 - Extremely fast development and build pipeline.
- **Performance**: Vercel Speed Insights for real-time performance monitoring.
- **Form Handling**: EmailJS for direct client-side email submission.

### Animation System

The website employs a custom-built animation system defined in `src/animations/variants.ts`:

- **Cinematic Transitions**: RTL-aware slide and fade variants that adjust based on the viewport direction.
- **Luxury Easing**: A custom cubic-bezier easing `[0.22, 1, 0.36, 1]` for premium, smooth-decelerate motion.
- **Scroll Reveals**: Vertical fade-up sections and staggered container animations for dynamic content entry.

---

## نظرة عامة (Arabic Overview)

### مقدمة

لوميير بيوتي (Lumière Beauté) هو تطبيق ويب متميز عالي الأداء مصمم لعلامة تجارية فاخرة في مجال التجميل. يتميز بواجهة مستخدم متطورة مع انتقالات سينمائية، ودعم كامل للغات التي تُكتب من اليمين إلى اليسار (RTL) مثل العربية، وهيكل تقني حديث يركز على السرعة والتميز البصري.

### التقنيات المستخدمة

- **الإطار الأساسي**: React 19 (الأحدث)
- **التنسيق**: Tailwind CSS 4 - استخدام أحدث تقنيات CSS لتنسيق الواجهات.
- **الرسوم المتحركة**: Framer Motion 12 - المسؤولة عن انتقالات الصفحات السينمائية وتأثيرات الظهور عند التمرير.
- **الـتدويل (i18n)**: i18next & react-i18next - دعم قوي لتعدد اللغات (العربية/الإنجليزية) مع الكشف التلقائي عن اللغة.
- **التوجيه (Routing)**: React Router 7 - نظام ملاحة حديث يعتمد على البيانات.
- **أداة البناء**: Vite 7 - نظام بناء وتطوير فائق السرعة.
- **الأداء**: Vercel Speed Insights لمراقبة الأداء في الوقت الفعلي.
- **معالجة النماذج**: EmailJS لإرسال البريد الإلكتروني مباشرة من جانب العميل.

### نظام الرسوم المتحركة

يعتمد الموقع على نظام رسوم متحركة مخصص تم تعريفه في `src/animations/variants.ts`:

- **انتقالات سينمائية**: متغيرات انزلاق وتلاشٍ تراعي اتجاه النص (RTL/LTR) وتتعدل حسب اتجاه العرض.
- **تخفيف الحركة الفاخر (Luxury Easing)**: استخدام منحنى `cubic-bezier [0.22, 1, 0.36, 1]` المخصص للحصول على حركة انسيابية ممتازة.
- **تأثيرات الظهور عند التمرير**: أقسام تتلاشى للأعلى ورسوم متحركة متداخلة (Staggered) لدخول المحتوى بشكل ديناميكي.
