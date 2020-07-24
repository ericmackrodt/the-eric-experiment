function minimise(name) {
  $(`#${name}-window > .window > .title > .button-container > .minimise`).click(
    () => {
      $(`#${name}-window`).hide();
      $(`#${name}-icon`).show();
    }
  );

  $(`#${name}-icon`).dblclick(() => {
    $(`#${name}-window`).show();
    $(`#${name}-icon`).hide();
  });
}

minimise("main");
minimise("categories");
minimise("twitter");
minimise("soundcloud");
minimise("compatibility");
