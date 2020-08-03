import { extension, Converter, ConverterOptions } from "showdown";

type Layout = Record<string, string>;

const getLegacyLayout = (layout: Layout, converter: Converter) => {
  return converter.makeHtml(
    [
      '<table cellspacing="0" sellpadding="0" border="0">',
      "<tr>",
      layout["left-content"] &&
        ['<td valign="top" width="200">', layout["left-content"], "</td>"].join(
          ""
        ),
      layout["content"] &&
        ['<td valign="top">', layout["content"], "</td>"].join(""),
      layout["right-content"] &&
        [
          '<td valign="top" width="200">',
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

function parser(getLayout: (layout: Layout, converter: Converter) => string) {
  return () => {
    return [
      {
        type: "lang",
        filter(text: string, converter: Converter, options: ConverterOptions) {
          const LAYOUT_REGEX = /¨D¨D\s(content|right-content|left-content)\s¨D¨D([\s\S]*?(?=[\n\r].*?¨D|$))/g;

          const layout: Layout = {};

          let match: RegExpExecArray;

          while ((match = LAYOUT_REGEX.exec(text))) {
            const layoutPart = match[1];
            const content = match[2];
            layout[layoutPart] = converter.makeHtml(content);
          }

          if (Object.keys(layout).length < 1) {
            return text;
          }

          return getLayout(layout, converter);
        },
      },
    ];
  };
}

extension("page-layout", parser(getModernLayout));
extension("netscape-page-layout", parser(getLegacyLayout));
