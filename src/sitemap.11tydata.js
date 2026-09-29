// The sitemap is written for production only. Preview and development builds have none.
export default {
  eleventyComputed: {
    permalink: (data) => (data.site.production ? "/sitemap.xml" : false),
  },
};
