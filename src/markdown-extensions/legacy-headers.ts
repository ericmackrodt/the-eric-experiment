import { extension, Converter } from "showdown";

extension("legacy-headers", function() {
  return [
    {
      type: "output",
      filter(text: string, converter: Converter, options) {
        const HEADER_HTML_ID = /(?:<p>)?<h([\d]).*?id="(.+?)".*?\/?>([^<]+)<\/h[\d]>(?:<\/p>)?/gi;
        const HEADER_HTML = /(?:<p>)?<h([\d]).*?\/?>([^<]+)<\/h[\d]>(?:<\/p>)?/gi;

        return text
          .replace(HEADER_HTML_ID, function(wholeMatch, m1, m2, m3) {
            const size = 7 - parseInt(m1);

            const header = [
              `<font face="arial" size="${size}">`,
              `<a name="${m2}"></a>`,
              `<b id="${m2}">`,
              m3,
              "</b>",
              "</font>",
            ].join("");

            return header;
          })
          .replace(HEADER_HTML, function(wholeMatch, m1, m2) {
            const size = 7 - parseInt(m1);

            const header = [
              `<font face="arial" size="${size}">`,
              "<b>",
              m2,
              "</b>",
              "</font>",
            ].join("");

            return header;
          });
      },
    },
  ];
});
