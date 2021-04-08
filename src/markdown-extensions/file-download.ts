import { extension, Converter } from "showdown";

extension("file-download", function() {
  return [
    {
      type: "lang",
      filter(text: string, converter: Converter) {
        const FILE_DOWNLOAD_REGEX = /\[file-download\]([\s\S]*?)\[\/file-download\]/gm;

        let match: RegExpExecArray;
        let output = text;

        while ((match = FILE_DOWNLOAD_REGEX.exec(output))) {
          output = output.replace(
            match[0],
            [
              '<div class="file-download">',
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

extension("download-link", function() {
  return [
    {
      type: "lang",
      filter(text: string, _converter: Converter) {
        const FILE_DOWNLOAD_REGEX = /DL\[([^\]]+)\]\(([^\]]+?)\)/gm;

        let match: RegExpExecArray;
        let output = text;

        while ((match = FILE_DOWNLOAD_REGEX.exec(output))) {
          output = output.replace(
            match[0],
            [
              '<div class="download-link">',
              '<a class="download-link" href="' +
                match[2] +
                '" target="_blank">',
              '<img src="/img/14/14/floppy.png" alt="Download">',
              match[1].trim(),
              "</a>",
              "</div>",
            ].join("")
          );
        }

        return output;
      },
    },
  ];
});
