// The preview's rules: noindex, and the password when BASIC_AUTH is set. Never written in production.
export default {
  eleventyComputed: {
    permalink: (data) => (data.site.production ? false : "/_headers"),
  },
};
