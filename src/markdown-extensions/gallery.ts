import { extension, Converter } from "showdown";

extension("gallery", function() {
  return [
    {
      type: "lang",
      filter(text: string, converter: Converter) {
        const GALLERY_REGEX = /\[gallery\]([\s\S]*?)\[\/gallery\]/gm;

        let match: RegExpExecArray;
        let output = text;

        while ((match = GALLERY_REGEX.exec(output))) {
          output = output.replace(
            match[0],
            [
              '<div class="gallery-container"><gallery>',
              converter.makeHtml(match[1].trim()),
              "</gallery></div>",
            ].join("")
          );
        }

        return output;
      },
    },
  ];
});
