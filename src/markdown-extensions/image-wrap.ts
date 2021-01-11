import { extension } from "showdown";

const imgRegex = /<p><img(.*?)\/?><\/p>?/gi;

const html = '<p class="image-paragraph"><img src="%1" alt="%2" /></a>';

function parseProperties(rest: string) {
  let src: string;
  let alt: string;
  let d;

  if (rest) {
    src = (d = /src="(.+?)"/.exec(rest)) ? d[1] : "";
    alt = (d = /alt="(.+?)"/.exec(rest)) ? d[1] : "";
  }

  return {
    src,
    alt,
  };
}

/**
 * Replace with video iframes
 */
extension("image-wrap", function() {
  return [
    {
      // It's a bit hackish but we let the core parsers replace the reference image for an image tag
      // then we replace the full img tag in the output with our iframe
      type: "output",
      filter: function(text) {
        const tag = html;
        return text.replace(imgRegex, function(match, rest) {
          const props = parseProperties(rest);
          return tag.replace(/%1/g, props.src).replace("%2", props.alt);
        });
      },
    },
  ];
});
