# Package Hosting Guidelines

## Windows 

1. Place the installer in:  
   `Interactive-Echoes.github.io/Downloads/Win/<PackageName>/<Arch>`  
   *(Replace `<PackageName>` with your actual package name)*

2. Provide users with this download link format:  
   `https://interactive-echoes.github.io/Downloads/Win/<PackageName>/<Arch>/<InstallerName>.exe`

## Linux

### Flatpak

All repositories are built and set up using `flatpak-builder` inside `Downloads/Linux/Repos`.

1. Create a Flatpak Manifest:  
   Inside the app repository, create a Flatpak manifest YAML file. Example:

   ```yaml
   id: io.github.ie.IECore
   branch: '1.0'
   runtime: org.freedesktop.Platform
   runtime-version: '24.08'
   build-extension: false
   sdk: org.freedesktop.Sdk
   separate-locales: false
   modules:
   - name: IECore
      buildsystem: cmake
      builddir: true
      build-options:
         prefix: /usr
         config-opts:
         - -DCMAKE_INSTALL_PREFIX=/app
         - -DBUILD_SHARED_LIBS=ON
         - -DCMAKE_BUILD_TYPE=Release
      sources:
         - type: git
         url: https://github.com/Interactive-Echoes/IECore
         branch: master
   ```

2. Run the Flatpak Builder:  
   Run the following command to build and sign the Flatpak package:

   ```sh
   flatpak-builder --gpg-sign=mozahzah \
   --gpg-homedir=~/.gnupg \
   --repo="$HOME/Repos/IE/Interactive-Echoes.github.io/Downloads/Linux/Repos" \
   build-dir io.github.ie.IECore.yaml --force-clean
   ```

   Alternatively, use:

   ```sh
   flatpak-builder-ie <MANIFEST.yaml>
   ```

3. Commit the Built Application:  
   Navigate to the `Interactive-Echoes.github.io` repository, review the new app, and commit the changes.