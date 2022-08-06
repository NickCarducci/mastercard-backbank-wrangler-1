export default async function FSA(options = (o = [{}]) => (!Array.isArray(o) ? [o] : o)) {
  return await Promise.all(
    await this.showOpenFilePicker({
      skipDirectory: (entry) => entry.name[0] === "./ignore",
      id: options[0].id,
      startIn: options[0].startIn,
      types: options.map((option, i) => {
        var turn = { description: option.description || "", accept: {} };
        if (!option.mimeTypes)
          return (turn.accept["*/*"] = option.extensions || []);
        option.mimeTypes.forEach(
          (mimeType) => (turn.accept[mimeType] = option.extensions || [])
        );
        return turn;
      }),
      multiple: options[0].multiple || false,
      excludeAcceptAllOption: options[0].excludeAcceptAllOption || false
    }).then((handleOrHandles) =>
      handleOrHandles.map(async function getFileWithHandle(handle) {
        const file = await handle.getFile();
        file.handle = handle;
        return file;
      })
    )
  ).then((files) => (options[0].multiple ? files : files[0]));
}
//https://github.com/GoogleChromeLabs/browser-fs-access/blob/main/src/fs-access/file-open.mjs
//file system access
