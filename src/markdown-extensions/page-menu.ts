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
