# Package Hosting Guidelines

## Windows 

1. Place the installer in:  
   `Interactive-Echoes.github.io/Downloads/<PackageName>/Win/`  
   *(Replace `<PackageName>` with your actual package name)*

2. Provide users with this download link format:  
   `https://interactive-echoes.github.io/Downloads/<PackageName>/Win/<InstallerName>.exe`

## Linux 

### RPM-Based Distributions (RHEL/CentOS/Fedora)

**Repository Structure:**
```
Interactive-Echoes.github.io/Downloads/<PackageName>/Linux/Rpm/
├── <Arch>/                 # Architecture subdirectory (e.g., x86_64, ARM64)
│   └── <signed-rpm-files>  # Signed RPM packages
└── <PackageName>.repo      # Repository configuration file
```

**Setup Steps:**

1. Create directory structure:
   ```bash
   mkdir -p Interactive-Echoes.github.io/Downloads/<PackageName>/Linux/Rpm/<Arch>
   ```

2. Place signed RPM packages in their respective architecture directories:
   ```
   Interactive-Echoes.github.io/Downloads/<PackageName>/Linux/Rpm/x86_64/package.rpm
   Interactive-Echoes.github.io/Downloads/<PackageName>/Linux/Rpm/ARM64/package.rpm
   ```
3. Sign rpm package(s)
   ```
   sudo rpm --define "_gpg_name <name>" Interactive-Echoes.github.io/Downloads/<PackageName>/Linux/Rpm/<Arch>/package.rpm
   ```

4. Create `.repo` file at `Interactive-Echoes.github.io/Downloads/<PackageName>/Linux/Rpm/<PackageName>.repo` with this content:
    ```ini
    [<PackageName>]
    name=<PackageName>
    baseurl=https://interactive-echoes.github.io/Downloads/<PackageName>/Linux/Rpm/Repos/$basearch/
    enabled=1
    gpgcheck=1
    gpgkey=https://github.com/mozahzah.gpg
    ```

5. Generate repository metadata for each architecture:
   ```bash
   # For each architecture directory:
   cd Interactive-Echoes.github.io/Downloads/<PackageName>/Linux/Rpm/x86_64
   createrepo .
   
   cd ../ARM64
   createrepo .
   ```

### DEB-Based Distributions (Debian/Ubuntu)

#### Coming soon...