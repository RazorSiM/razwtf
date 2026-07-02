{ pkgs, lib, config, inputs, ... }:

{
  # Node.js toolchain for the raz.wtf Nuxt 3 site.
  # https://devenv.sh/languages/javascript/
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_26;

    # Node 25+ no longer bundles Corepack, so provide pnpm directly.
    # pnpm 11.x, matching the pnpm@11.9.0 pinned in package.json's
    # `packageManager` field (pnpm honours that via its default
    # manage-package-manager-versions setting).
    pnpm = {
      enable = true;
      package = pkgs.pnpm_11;
    };
  };

  # `devenv up` starts the Nuxt dev server on http://localhost:3000
  # https://devenv.sh/processes/
  processes.dev.exec = "pnpm dev";

  # https://devenv.sh/basics/
  enterShell = ''
    echo "raz.wtf devenv ready — node $(node --version), pnpm ${pkgs.pnpm_11.version}"
    echo "  pnpm install   # install deps"
    echo "  pnpm dev       # or: devenv up"
  '';

  # `devenv test` sanity check that we're on the intended major.
  # https://devenv.sh/tests/
  enterTest = ''
    node --version | grep -F "v26"
  '';

  # See full reference at https://devenv.sh/reference/options/
}
