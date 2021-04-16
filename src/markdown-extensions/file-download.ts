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
            '<table cellspacing="1" border="0" cellpadding="2" width="100%">',
            "<tr>",
            `<td bgcolor="#DDDDDD"><font size="-1" face="arial"><b>${name}</b></font></td>`,
            '<td bgcolor="#DDDDDD" align="right" valign="top">',
            `<a href="${url}" target="_blank">`,
            '<img src="/img/12/12/floppy.png" alt="Download" border="0">',
            '<img src="/assets/nothing.gif" width="5" height="12" border="0">',
            "</a>",
            `<a href="${url}" target="_blank">`,
            `<font size="2" face="arial">${file}</font></a></td>`,
            "</tr>",
            '<tr><td bgcolor="#DDDDDD" colspan="2">',
            '<font size="-1">',
            converter.makeHtml(description),
            "</font>",
            "</td></tr>",
            '<tr><td colspan="2">',
            '<img src="/assets/nothing.gif" width="500" height="2">',
            "</td></td>",
            "</table>",
          ].join("");
        });
      },
    },
  ];
});
