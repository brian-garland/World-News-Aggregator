const sources = [
  {
    id: "guardian-us",
    name: "The Guardian (US)",
    homepage: "https://www.theguardian.com/us",
    rssUrl: "https://www.theguardian.com/us-news/rss",
    scrapeUrl: "https://www.theguardian.com/us",
    selectors: ["a[data-link-name='article']", "h2 a", "h3 a", ".fc-item__link"]
  },
  {
    id: "spiegel-intl",
    name: "Der Spiegel International",
    homepage: "https://www.spiegel.de/international/",
    rssUrl: "https://www.spiegel.de/international/index.rss",
    scrapeUrl: "https://www.spiegel.de/international/",
    selectors: [".headline-intro a", "h2 a", "h3 a", "article header a"]
  },
  {
    id: "lemonde-en",
    name: "Le Monde (EN)",
    homepage: "https://www.lemonde.fr/en/",
    rssUrl: "https://www.lemonde.fr/en/rss/une.xml",
    scrapeUrl: "https://www.lemonde.fr/en/",
    selectors: [".article__title-link", "h2 a", "h3 a", "article a"]
  },
  {
    id: "elpais-en",
    name: "El Pais (EN)",
    homepage: "https://english.elpais.com/",
    rssUrl: "https://english.elpais.com/rss/english/portada.xml",
    scrapeUrl: "https://english.elpais.com/",
    selectors: [".headline a", "h2 a", "h3 a", "article h2 a"]
  },
  {
    id: "budapest-times",
    name: "Budapest Times",
    homepage: "https://budapesttimes.hu/",
    scrapeUrl: "https://budapesttimes.hu/",
    selectors: [".entry-title a", "h2 a", "h3 a", "article a"]
  },
  {
    id: "slovak-spectator",
    name: "The Slovak Spectator",
    homepage: "https://spectator.sme.sk/",
    scrapeUrl: "https://spectator.sme.sk/",
    selectors: [".article-title a", "h2 a", "h3 a", "article a"]
  },
  {
    id: "kyivpost",
    name: "Kyiv Post",
    homepage: "https://www.kyivpost.com/",
    scrapeUrl: "https://www.kyivpost.com/",
    selectors: [".post-title a", "a[href*='/post/']", "h2 a", "h3 a", "article a", ".card a"]
  },
  {
    id: "moscow-times",
    name: "The Moscow Times",
    homepage: "https://www.themoscowtimes.com/",
    rssUrl: "https://www.themoscowtimes.com/rss/news",
    scrapeUrl: "https://www.themoscowtimes.com/",
    selectors: [".article-card__headline a", "h2 a", "h3 a", "article a"]
  },
  {
    id: "tass",
    name: "TASS",
    homepage: "https://tass.com/",
    rssUrl: "https://tass.com/rss/v2.xml",
    scrapeUrl: "https://tass.com/",
    selectors: [".news-list__link", "h2 a", "h3 a", "article a"]
  },
  {
    id: "folha-en",
    name: "Folha (EN)",
    homepage: "https://www1.folha.uol.com.br/internacional/en/",
    scrapeUrl: "https://www1.folha.uol.com.br/internacional/en/",
    selectors: [".headline a", ".headline__content a", "h2 a", "h3 a", "article a"]
  },
  {
    id: "china-daily",
    name: "China Daily",
    homepage: "https://www.chinadaily.com.cn/",
    rssUrl: "https://www.chinadaily.com.cn/rss/cndy_rss.xml",
    scrapeUrl: "https://www.chinadaily.com.cn/",
    selectors: [".mb10 a", "h2 a", "h3 a", "article a"]
  },
  {
    id: "tvp-world",
    name: "TVP World",
    homepage: "https://tvpworld.com/",
    scrapeUrl: "https://tvpworld.com/",
    selectors: [".title a", "a[href*='/news/']", "h2 a", "h3 a", "article a", ".article-item a"]
  },
  {
    id: "euronews",
    name: "Euronews",
    homepage: "https://www.euronews.com/",
    rssUrl: "https://www.euronews.com/rss",
    scrapeUrl: "https://www.euronews.com/",
    selectors: [".m-object__title__link", "h2 a", "h3 a", "article a"]
  }
];

module.exports = {
  sources
};
