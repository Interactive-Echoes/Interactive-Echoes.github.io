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
> For steps 1,2,3 you can use rpm-builder-ie custom command

4. Generate repository metadata for each architecture:
   ```sh
   cd Downloads/Linux/RPM
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

**Setup Steps:**

1. Create .deb package using CMake
```sh
cmake -S . -B ./build -DCMAKE_BUILD_TYPE=Release
cmake --build ./build
cpack --config ./build/CPackConfig.cmake
```

2. Place .deb package into Interactive-Echoes.github.io/Downloads/Linux/DEB/pool/main

3. Create a binary-<arch> directory in Interactive-Echoes.github.io/Downloads/Linux/DEB/dists/stable/main example:  
'Interactive-Echoes.github.io/Downloads/Linux/DEB/dists/stable/main/binary-amd64'

4. Inside the /DEB directory (do for each architecture):
```sh
apt-ftparchive packages pool/main > dists/stable/main/binary-amd64/Packages
gzip -k -f dists/stable/main/binary-amd64/Packages
```

5. Go back to the stable directory to create and sign the Release files
```sh
apt-ftparchive -c=dists/stable/Release.conf release dists/stable > dists/stable/Release  # This will create a Release file
gpg --default-key "ie" -abs -o dists/stable/Release.gpg dists/stable/Release # This will create a Release.gpg signature
gpg --default-key "ie" --clearsign -o dists/stable/InRelease dists/stable/Release # This creates inline signed Release
```

**User Side** 
```sh
wget -O /etc/apt/trusted.gpg.d/ie-public.gpg https://interactive-echoes.github.io/Downloads/ie-public.gpg
wget -O /etc/apt/sources.list.d/IE.list https://interactive-echoes.github.io/Downloads/Linux/DEB/IE.list
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
