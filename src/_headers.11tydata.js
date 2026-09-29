// The preview's password rule. Written only when BASIC_AUTH is set, and never in production.
export default {
  eleventyComputed: {
    permalink: (data) => (data.site.basicAuth && !data.site.production ? "/_headers" : false),
  },
};
