import { ConverterOptions, extension } from "showdown";

const imgRegex = /(?:<p>)?<img.*?src="(.+?)"(.*?)\/?>(?:<\/p>)?/gi;
const fullYoutubeRegex = /(?:(?:https?:)?(?:\/\/)?)(?:(?:www)?\.)?youtube\.(?:.+?)\/(?:(?:watch\?v=)|(?:embed\/))([a-zA-Z0-9_-]{11})/i;
const shortYoutubeRegex = /(?:(?:https?:)?(?:\/\/)?)?youtu\.be\/([a-zA-Z0-9_-]{11})/i;
const vimeoRegex = /(?:(?:https?:)?(?:\/\/)?)(?:(?:www)?\.)?vimeo.com\/(\d+)/;

const html = [
  "<center>",
  '<a href="%1" target="_blank"><img src="/externalimage/%3/%4?url=%2?fill=cover" alt="%5" border="0" /></a>',
  "<br>",
  '<img src="/assets/nothing.gif" width="100%" height="10">',
  "<br>",
  "</center>",
].join("");

function parseProperties(rest: string, options: ConverterOptions) {
  let width: string;
  let height: string;
  let alt: string;
  let d;

  const defaultWidth = options.youtubeWidth ? options.youtubeWidth : "420";
  const defaultHeight = options.youtubeHeight ? options.youtubeHeight : "315";

  if (rest) {
    width = (d = /width="(.+?)"/.exec(rest)) ? d[1] : defaultWidth;
    height = (d = /height="(.+?)"/.exec(rest)) ? d[1] : defaultHeight;
    alt = (d = /alt="(.+?)"/.exec(rest)) ? d[1] : "";
  }

  return {
    width,
    height,
    alt,
  };
}

/**
 * Replace with video iframes
 */
extension("netscape-youtube", function() {
  return [
    {
      // It's a bit hackish but we let the core parsers replace the reference image for an image tag
      // then we replace the full img tag in the output with our iframe
      type: "output",
      filter: function(text, converter, options) {
        const tag = html;
        return text.replace(imgRegex, function(match, url, rest) {
          const props = parseProperties(rest, options);
          let m: RegExpExecArray;
          let fUrl = "";
          if (
            (m = shortYoutubeRegex.exec(url)) ||
            (m = fullYoutubeRegex.exec(url))
          ) {
            fUrl = "https://img.youtube.com/vi/" + m[1] + "/0.jpg";
          } else if ((m = vimeoRegex.exec(url))) {
            fUrl = "https://player.vimeo.com/video/" + m[1];
          } else {
            return match;
          }
          return tag
            .replace(/%1/g, url)
            .replace("%2", fUrl)
            .replace(/%3/g, props.width)
            .replace(/%4/g, props.width)
            .replace("%5", props.alt);
        });
      },
    },
  ];
});
