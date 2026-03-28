"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Lang = "en" | "zh";

const translations = {
  // Nav
  "nav.home": { en: "HOME", zh: "首页" },
  "nav.bucketList": { en: "BUCKET LIST", zh: "心愿单" },
  "nav.discover": { en: "DISCOVER", zh: "探索" },

  // Home page
  "home.quote": {
    en: "Discover bucket-list experiences, then make them real.",
    zh: "发现心愿清单上的体验，然后让它们成真。",
  },
  "home.heading1": { en: "Where Intention &", zh: "计划" },
  "home.heading2": { en: "Journey", zh: "人生体验" },
  "home.heading3": { en: " Meet", zh: "" },
  "home.heading4": { en: "", zh: "和下一段" },
  "home.heading5": { en: "", zh: "旅程" },
  "home.subtitle": {
    en: "Your dreams, pinned to a map. Archive the places that call to you, and let Myra help you find the way.",
    zh: "将梦想标注在地图上。收藏那些召唤你的地方，让 Myra 帮你找到前往的路。",
  },
  "home.addBucketList": { en: "Add to Bucket List", zh: "添加心愿" },
  "home.addBucketListDesc": { en: "Add a place or experience I dream of visiting.", zh: "添加我梦想中的目的地或体验。" },
  "home.discoverTrip": { en: "Discover next adventure", zh: "发现下一段旅程" },
  "home.discoverTripDesc": { en: "Set my intention and discover matching experiences.", zh: "根据我的意向和条件，为我匹配旅程体验。" },
  "home.wishlist": { en: "WISHLIST", zh: "心愿" },
  "home.planned": { en: "PLANNED", zh: "已计划" },
  "home.visited": { en: "COMPLETED", zh: "已完成" },

  // Bucket list page
  "bucket.archive": { en: "THE VISION BOARD", zh: "愿景板" },
  "bucket.title": { en: "Bucket List", zh: "心愿单" },
  "bucket.addExperience": { en: "ADD EXPERIENCE", zh: "添加体验" },
  "bucket.wishlist": { en: "Wishlist", zh: "心愿" },
  "bucket.planned": { en: "Planned", zh: "已计划" },
  "bucket.visited": { en: "Completed", zh: "已完成" },
  "bucket.cardView": { en: "Card view", zh: "卡片视图" },
  "bucket.listView": { en: "List view", zh: "列表视图" },
  "bucket.emptyWishlist": { en: "No dreams yet", zh: "还没有心愿" },
  "bucket.emptyPlanned": { en: "Nothing planned yet", zh: "还没有计划" },
  "bucket.emptyVisited": { en: "No completed trips yet", zh: "还没有已完成的旅行" },
  "bucket.emptyWishlistDesc": { en: "Start by adding your first dream destination.", zh: "从添加你的第一个梦想目的地开始。" },
  "bucket.emptyPlannedDesc": { en: "Discover experiences and add them to your plan.", zh: "探索体验并添加到你的计划中。" },
  "bucket.emptyVisitedDesc": { en: "Mark an experience as completed to see it here.", zh: "将体验标记为已完成即可在此查看。" },
  "bucket.noPhoto": { en: "No photo yet", zh: "暂无照片" },
  "bucket.inspiration": { en: "NEED INSPIRATION?", zh: "需要灵感？" },
  "bucket.showMore": { en: "MORE IDEAS", zh: "更多灵感" },

  // Sort
  "sort.newest": { en: "Newest", zh: "最新" },
  "sort.az": { en: "A → Z", zh: "A → Z" },
  "sort.category": { en: "Category", zh: "分类" },
  "sort.label": { en: "Sort", zh: "排序" },
  "cat.nature": { en: "Nature", zh: "自然" },
  "cat.city": { en: "City", zh: "城市" },
  "cat.cultural": { en: "Cultural", zh: "文化" },
  "cat.adventure": { en: "Adventure", zh: "探险" },
  "cat.food": { en: "Food & Drink", zh: "美食" },
  "cat.wellness": { en: "Wellness", zh: "养生" },
  "cat.festival": { en: "Festival", zh: "节日" },
  "cat.other": { en: "Other", zh: "其他" },

  // Discover page
  "discover.back": { en: "BACK", zh: "返回" },
  "discover.label": { en: "DISCOVER AN EXPERIENCE", zh: "发现一段体验" },
  "discover.heading": { en: "What I'm Looking for in the Next Journey", zh: "我在下一段旅程中寻求这样的体验" },
  "discover.subtitle": {
    en: "Tell us what you're looking for. We'll search your bucket list and beyond.",
    zh: "告诉我们你在寻找什么，我们将在你的心愿单内外为你搜索。",
  },
  "discover.placeholder": { en: "I want to work remotely from a beach town...", zh: "我想在海边小镇远程办公..." },
  "discover.chip1": { en: "Experience rich culture", zh: "体验丰富的文化" },
  "discover.chip2": { en: "Push my comfort zone", zh: "突破舒适圈" },
  "discover.chip3": { en: "Slow & restorative escape", zh: "慢节奏疗愈之旅" },
  "discover.month": { en: "Month", zh: "月份" },
  "discover.days": { en: "Days", zh: "天数" },
  "discover.budget": { en: "Budget", zh: "预算" },
  "discover.any": { en: "Any", zh: "不限" },
  "discover.whatElse": { en: "What else is important?", zh: "还需要考虑这些" },
  "discover.whatElsePrefix": { en: "What else", zh: "其他" },
  "discover.travelingWith": { en: "Traveling with", zh: "旅伴" },
  "discover.ageRange": { en: "Make this happen in my...", zh: "适合年龄段" },
  "discover.button": { en: "DISCOVER", zh: "开始探索" },
  "discover.discovering": { en: "DISCOVERING...", zh: "探索中..." },
  "discover.thinking1": { en: "Scanning your bucket list...", zh: "正在扫描你的心愿单..." },
  "discover.thinking2": { en: "Matching seasons & travel styles...", zh: "匹配季节与旅行风格..." },
  "discover.thinking3": { en: "Searching for hidden gems...", zh: "寻找隐藏的宝藏..." },
  "discover.thinking4": { en: "Checking best travel months...", zh: "确认最佳旅行月份..." },
  "discover.thinking5": { en: "Estimating budgets...", zh: "估算预算..." },
  "discover.thinking6": { en: "Curating your recommendations...", zh: "为你精选推荐..." },
  "discover.recommended": { en: "RECOMMENDED FOR YOU", zh: "为你推荐" },
  "discover.inYourList": { en: "IN YOUR LIST", zh: "在你的心愿单中" },
  "discover.addToPlan": { en: "ADD TO MY PLAN", zh: "加入计划" },
  "discover.adding": { en: "ADDING...", zh: "添加中..." },
  "discover.planned": { en: "VIEW IN MY LIST", zh: "查看我的列表" },
  "discover.discoverMore": { en: "DISCOVER MORE", zh: "发现更多" },
  "discover.viewBucketList": { en: "VIEW BUCKET LIST", zh: "查看心愿单" },

  // Experience form
  "form.namePlaceholder": { en: "Attend Carnival in Rio", zh: "参加里约狂欢节" },
  "form.nameLabel": { en: "Experience name", zh: "体验名称" },
  "form.descLabel": { en: "Why this matters to me (optional)", zh: "这对我意味着什么（选填）" },
  "form.descPlaceholder": { en: "What makes this special? Why do you want to do this?", zh: "是什么让这段体验特别？你为什么想去？" },
  "form.status": { en: "STATUS", zh: "状态" },
  "form.country": { en: "COUNTRY", zh: "国家" },
  "form.countryPlaceholder": { en: "Brazil", zh: "巴西" },
  "form.seasons": { en: "IDEAL SEASONS", zh: "理想季节" },
  "form.findingBestTime": { en: "FINDING THE BEST TIME...", zh: "正在查找最佳时间..." },
  "form.typeNameFirst": { en: "TYPE A NAME TO GET SUGGESTIONS", zh: "输入名称以获取建议" },
  "form.suggestBestTime": { en: "SUGGEST BEST TIME TO GO", zh: "推荐最佳出行时间" },
  "form.bestMonths": { en: "Best months:", zh: "最佳月份：" },
  "form.companion": { en: "TRAVEL COMPANION", zh: "旅伴" },
  "form.doByAge": { en: "DO BY AGE", zh: "在几岁前完成" },
  "form.before": { en: "Before", zh: "在" },
  "form.beforeSuffix": { en: "", zh: "岁前" },
  "form.photos": { en: "VISUALIZE IT", zh: "想象一下" },
  "form.removePhoto": { en: "Remove photo", zh: "移除照片" },
  "form.hidePhotos": { en: "HIDE PHOTOS", zh: "隐藏照片" },
  "form.findPhotos": { en: "FIND PHOTOS", zh: "查找照片" },
  "form.changePhoto": { en: "CHANGE PHOTO", zh: "更换照片" },
  "form.saving": { en: "SAVING...", zh: "保存中..." },
  "form.addToList": { en: "ADD TO LIST", zh: "添加到列表" },
  "form.update": { en: "UPDATE", zh: "更新" },
  "form.delete": { en: "DELETE", zh: "删除" },

  // New experience page
  "newExp.back": { en: "BACK TO LIST", zh: "返回列表" },
  "newExp.label": { en: "NEW ENTRY", zh: "新条目" },
  "newExp.heading": { en: "Add Experience", zh: "添加体验" },

  // Edit experience page
  "editExp.back": { en: "BACK TO LIST", zh: "返回列表" },
  "editExp.label": { en: "EDIT", zh: "编辑" },

  // About page
  "about.label": { en: "ABOUT", zh: "关于" },
  "about.heading": { en: "What is Myra?", zh: "Myra 是什么？" },
  "about.p1": { en: "A simple bucket-list tool for people who want to live with more intention. Collect specific experiences, then make them happen. The name comes from \"mira\" — to look, to see — because the best journeys start with a vision.", zh: "一个简单的心愿清单工具，为想要更有意图地生活的人而建。收集具体的体验，然后去实现它们。名字源自「mira」——看、注视——因为最好的旅程始于用心观察。" },
  "about.step1Title": { en: "Discover", zh: "探索" },
  "about.step1Desc": { en: "Tell Myra what kind of journey you're dreaming of. She'll find experiences that match your mood, season, and style.", zh: "告诉 Myra 你梦想中的旅程。她会找到匹配你心情、季节和风格的体验。" },
  "about.step2Title": { en: "Save", zh: "收藏" },
  "about.step2Desc": { en: "Add the ones that speak to you. Your bucket list grows into a personal archive of places that matter.", zh: "收藏那些打动你的体验。你的心愿单会变成一份专属的旅行档案。" },
  "about.step3Title": { en: "Complete", zh: "完成" },
  "about.step3Desc": { en: "When you've lived the experience, mark it complete. Every journey deserves to be remembered.", zh: "当你完成体验时，标记为已完成。每段旅程都值得被铭记。" },
  "about.whoTitle": { en: "Who is this for?", zh: "这是为谁打造的？" },
  "about.whoDesc": { en: "For anyone who believes travel is more than logistics — it's how we grow, feel, and remember.", zh: "为每一个相信旅行不只是行程安排的人——旅行是我们成长、感受和记忆的方式。" },

  // Footer
  "footer.about": { en: "About", zh: "关于" },

  // Photo picker
  "photos.title": { en: "FIND PHOTOS", zh: "查找照片" },
  "photos.close": { en: "CLOSE", zh: "关闭" },
  "photos.searchPlaceholder": { en: "Search for photos...", zh: "搜索照片..." },
  "photos.search": { en: "SEARCH", zh: "搜索" },
  "photos.searching": { en: "Searching...", zh: "搜索中..." },
  "photos.noResults": { en: "No photos found. Try a different search.", zh: "未找到照片，请尝试其他搜索词。" },
  "photos.attribution": { en: "Photos provided by Unsplash", zh: "照片由 Unsplash 提供" },
} as const;

type TranslationKey = keyof typeof translations;

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => translations[key]?.en || key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const t = useCallback(
    (key: TranslationKey) => translations[key]?.[lang] ?? translations[key]?.en ?? key,
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
