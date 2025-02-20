# Package Hosting Guidelines

## Windows 

1. Place the installer in:  
   `Interactive-Echoes.github.io/Downloads/Win/<PackageName>/<Arch>`  

2. Provide users with this download link format:  
   `https://interactive-echoes.github.io/Downloads/Win/<PackageName>/<Arch>/<InstallerName>.exe`  

## Linux

### RPM-Based Distributions (RHEL/CentOS/Fedora)

**Setup Steps:**

1. Create directory structure:
   ```sh
   mkdir -p Interactive-Echoes.github.io/Downloads/Linux/RPM/Packages
   ```

2. Create and sign the .rpm using CMake
   ```sh
   cmake -S . -B ./build -DCMAKE_BUILD_TYPE=Release
   cmake --build ./build
   cpack --config ./build/CPackConfig.cmake
   rpm --addsign packages/*.rpm
   ```

3. Copy the signed RPM into Interactive-Echoes.github.io/Downloads/Linux/RPM/Packages
   ```sh
   cp packages/*.rpm Interactive-Echoes.github.io/Downloads/Linux/RPM/Packages
   ```
> [!NOTE]
> For steps 1,2,3 using rpm-builder-ie custom command

4. Generate repository metadata for each architecture:
   ```sh
   cd Interactive-Echoes.github.io/Downloads/Linux/Rpm
   createrepo .
   git add .
   # git commit and push
   ```

**User Side** 
```sh
sudo curl -o /etc/yum.repos.d/IE.repo https://interactive-echoes.github.io/Downloads/Linux/RPM/IE.repo
sudo dnf install <package-name>
```

### DEB-Based Distributions (Debian/Ubuntu)

#### Coming soon...

User Step 1 
```
wget -O /etc/apt/trusted.gpg.d/mozahzah.gpg https://github.com/mozahzah.gpg
```


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
   --repo="$HOME/Repos/IE/Interactive-Echoes.github.io/Downloads/Linux/Flatpak/Repos" \
   build-dir io.github.ie.IECore.yaml --force-clean
   ```

   Alternatively, use:

   ```sh
   flatpak-builder-ie <MANIFEST.yaml>
   ```

3. Commit the Built Application:  
   Navigate to the `Interactive-Echoes.github.io` repository, review the new app, and commit the changes.