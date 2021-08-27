import gh from "gh-pages";
import fs from "fs";
import { join } from "path";

const buildDir = "specs";

const setup = () => {
  const file = join(__dirname, "..", buildDir, ".nojekyll");
  const time = new Date();

  try {
    fs.utimesSync(file, time, time);
  } catch (err) {
    fs.closeSync(fs.openSync(file, "w"));
  }
};

const publish = () => {
  gh.publish(buildDir, {
    message: "Auto-generated publish to gh-pages commit",
    dotfiles: true,
  });
};

setup();
publish();
