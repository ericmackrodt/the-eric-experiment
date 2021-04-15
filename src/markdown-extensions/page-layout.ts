import { extension, Converter, ConverterOptions } from "showdown";

type Layout = Record<string, string>;

const getLegacyLayout = (layout: Layout, converter: Converter) => {
  return converter.makeHtml(
    [
      '<table cellspacing="0" sellpadding="0" border="0">',
      "<tr>",
      layout["left-content"] &&
        [
          '<td valign="top" width="150">',
          layout["left-content"],
          "</td>",
          '<td width="10" valign="top">',
          '<img src="/assets/nothing.gif" width="10" height="1">',
          "</td>",
        ].join(""),

      layout["content"] &&
        [
          '<td valign="top">',
          '<font face="arial" size="-1">',
          layout["content"],
          "</font>",
          "</td>",
          '<td width="5" valign="top">',
          '<img src="/assets/nothing.gif" width="5" height="1">',
          "</td>",
        ].join(""),
      layout["right-content"] &&
        [
          '<td width="5" valign="top">',
          '<img src="/assets/nothing.gif" width="5" height="1">',
          "</td>",
          '<td valign="top" width="150">',
          layout["right-content"],
          "</td>",
        ].join(""),
      "</tr>",
      "</table>",
    ]
      .filter((o) => !!o)
      .join("")
  );
};

const getModernLayout = (layout: Layout, converter: Converter) => {
  return converter.makeHtml(
    [
      layout["left-content"] &&
        ['<div class="side-content">', layout["left-content"], "</div>"].join(
          ""
        ),
      layout["content"] &&
        ['<div class="content">', layout["content"], "</div>"].join(""),
      layout["right-content"] &&
        ['<div class="side-content">', layout["right-content"], "</div>"].join(
          ""
        ),
    ]
      .filter((o) => !!o)
      .join("")
  );
};

function removeParagraph(text: string) {
  const PARAGRAPH_REGEX = /(<p>\s*)(¨D¨D\s(content|right-content|left-content)\s¨D¨D)(\s*<\/p>)/g;

  let match: RegExpExecArray;

  while ((match = PARAGRAPH_REGEX.exec(text))) {
    text = text.replace(match[0], match[2]);
  }

  return text;
}

function parser(getLayout: (layout: Layout, converter: Converter) => string) {
  return () => {
    return [
      {
        type: "lang",
        filter(text: string, converter: Converter, options: ConverterOptions) {
          let output = removeParagraph(text);
          const LAYOUT_REGEX = /¨D¨D\s(content|right-content|left-content)\s¨D¨D([\s\S]*?(?=[\n\r].*?¨D|$))/g;

          const layout: Layout = {};

          let match: RegExpExecArray;

          while ((match = LAYOUT_REGEX.exec(output))) {
            const layoutPart = match[1];
            const content = match[2];
            layout[layoutPart] = converter.makeHtml(content);
          }

          if (Object.keys(layout).length < 1) {
            return output;
          }

          return getLayout(layout, converter);
        },
      },
    ];
  };
}

extension("page-layout", parser(getModernLayout));
extension("netscape-page-layout", parser(getLegacyLayout));
