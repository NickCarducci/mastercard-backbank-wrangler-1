const impor = async (file, suffices) => {
  var works;
  suffices.forEach(function receipt(sfx = arguments[0]) {
    works = import(`${file}${sfx}`)
      .then()
      .catch(() => receipt(suffices[suffices.indexOf(sfx)] + 1));
  });
  return await new Promise((resolve) => {
    works && resolve(works);
  });
};

export async function Intake(file) {
  return await impor(file, this.suffices).then((Dependencies) => {
    Object.keys(Dependencies).forEach((arg) => {
      Dependencies[arg] = Dependencies;
    });
    return new Promise((resolve) =>
      resolve({ default: Dependencies, ...Dependencies })
    );
  });
}
