import { extension, Converter } from "showdown";

extension("file-download", function() {
  return [
    {
      type: "lang",
      filter(text: string, converter: Converter) {
        const FILE_DOWNLOAD_REGEX = /\[file-download\]([\s\S]*?)\[\/file-download\]/gm;

        return text.replace(FILE_DOWNLOAD_REGEX, function(_, content) {
          const [, name] = /name: "(.+)"/gm.exec(content);
          const [, file] = /file: "(.+)"/gm.exec(content);
          const [, url] = /url: "(.+)"/gm.exec(content);
          const [, description] = /description:[\n\r]+([.\s\S]+)/gm.exec(
            content
          );

          const id = name.toLowerCase().replace(/[\s\.]/gm, "");

          return [
            '<div class="file-download">',
            `<h4 id="${id}">${name}</h4>`,
            '<div class="download-link">',
            '<a class="download-link" href="' + url + '" target="_blank">',
            '<img src="/img/14/14/floppy.png" alt="Download">',
            file,
            "</a>",
            "</div>",
            converter.makeHtml(description),
            "</div>",
          ].join("");
        });
      },
    },
  ];
});

extension("legacy-file-download", function() {
  return [
    {
      type: "lang",
      filter(text: string, converter: Converter) {
        // This regex is absurd
        const FILE_DOWNLOAD_REGEX = /\[file-download\]([\s\S]*?)\[\/file-download\]/gm;

        return text.replace(FILE_DOWNLOAD_REGEX, function(_, content) {
          const [, name] = /name: "(.+)"/gm.exec(content);
          const [, file] = /file: "(.+)"/gm.exec(content);
          const [, url] = /url: "(.+)"/gm.exec(content);
          const [, description] = /description:[\n\r]+([.\s\S]+)/gm.exec(
            content
          );

          return [
            '<table cellspacing="1" border="0" cellpadding="2">',
            "<tr>",
            `<td bgcolor="#DDDDDD"><font size="-1"><b>${name}</b></font></td>`,
            `<td bgcolor="#DDDDDD" align="right"><a href="${url}" target="_blank"><img src="/img/14/14/floppy.png" alt="Download"><img src="/assets/nothing.gif" width="5" height="14"><font size="-1">${file}</font></a></td>`,
            "</tr>",
            '<tr><td bgcolor="#DDDDDD" colspan="2">',
            '<font size="-1">',
            converter.makeHtml(description),
            "</font>",
            "</td></tr>",
            "</table>",
            '<img src="/assets/nothing.gif" width="100" height="0">',
          ].join("");
        });
      },
    },
  ];
});
