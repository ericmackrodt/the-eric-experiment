import { extension, Converter } from "showdown";

extension("page-menu", function() {
  return [
    {
      type: "lang",
      filter(text: string, converter: Converter) {
        const GALLERY_REGEX = /\[page-menu\]([\s\S]*?)\[\/page-menu\]/gm;

        let match: RegExpExecArray;
        let output = text;

        while ((match = GALLERY_REGEX.exec(output))) {
          output = output.replace(
            match[0],
            [
              "<h2>Contents</h2>",
              '<div class="page-menu">',
              converter.makeHtml(match[1].trim()),
              "</div>",
            ].join("")
          );
        }

        return output;
      },
    },
  ];
});

extension("netscape-page-menu", function() {
  return [
    {
      type: "lang",
      filter(text: string, converter: Converter) {
        const GALLERY_REGEX = /\[page-menu\]([\s\S]*?)\[\/page-menu\]/gm;

        let match: RegExpExecArray;
        let output = text;

        while ((match = GALLERY_REGEX.exec(output))) {
          const MENU_REGEX = /\-\s+\[(.+)\]\((.+)\)/gi;
          const menu = match[1].replace(MENU_REGEX, (_, content, url) => {
            return [
              "<tr>",
              "<td>",
              `<a href="${url}">`,
              '<font face="arial" size="-1">',
              content.trim(),
              "</font>",
              "</a>",
              "</td>",
              "</tr>",
            ].join("");
          });

          output = output.replace(
            match[0],
            [
              '<table cellspacing="0" cellpadding="2" border="0" width="100%">',
              "<tr>",
              '<td bgcolor="#DDDDDD" align="center">',
              '<font face="arial" size="3">',
              "<b>Contents</b>",
              "</font>",
              "</td>",
              "</tr>",
              menu,
              "</table>",
            ].join("")
          );
        }

        return output;
      },
    },
  ];
});
