FROM archlinux:latest

# Set platform
ARG TARGETARCH=amd64
ENV LANG=en_US.UTF-8

# Configure pacman for better download reliability
RUN echo '[options]' > /etc/pacman.conf && \
    echo 'HoldPkg     = pacman glibc' >> /etc/pacman.conf && \
    echo 'Architecture = auto' >> /etc/pacman.conf && \
    echo 'Color' >> /etc/pacman.conf && \
    echo 'CheckSpace' >> /etc/pacman.conf && \
    echo 'ParallelDownloads = 5' >> /etc/pacman.conf && \
    echo 'SigLevel    = Required DatabaseOptional' >> /etc/pacman.conf && \
    echo 'LocalFileSigLevel = Optional' >> /etc/pacman.conf && \
    echo 'DisableSandbox' >> /etc/pacman.conf && \
    echo '' >> /etc/pacman.conf && \
    echo '[core]' >> /etc/pacman.conf && \
    echo 'Include = /etc/pacman.d/mirrorlist' >> /etc/pacman.conf && \
    echo '' >> /etc/pacman.conf && \
    echo '[extra]' >> /etc/pacman.conf && \
    echo 'Include = /etc/pacman.d/mirrorlist' >> /etc/pacman.conf

# Use fast, reliable mirrors
RUN echo 'Server = https://geo.mirror.pkgbuild.com/$repo/os/$arch' >> /etc/pacman.d/mirrorlist && \
    echo 'Server = https://mirror.rackspace.com/archlinux/$repo/os/$arch' >> /etc/pacman.d/mirrorlist && \
    echo 'Server = https://mirrors.mit.edu/archlinux/$repo/os/$arch' >> /etc/pacman.d/mirrorlist && \
    echo 'Server = https://arch.hu.fo/archlinux/$repo/os/$arch' >> /etc/pacman.d/mirrorlist && \
    echo 'Server = https://ftp.osuosl.org/pub/archlinux/$repo/os/$arch' >> /etc/pacman.d/mirrorlist

# Initialize keyring
RUN pacman-key --init && \
    pacman-key --populate archlinux

# Update system
RUN pacman -Syyu --noconfirm

# Install base development tools in stages to avoid timeout issues
RUN pacman -S --noconfirm --needed \
    base-devel \
    git \
    wget \
    curl \
    sudo

RUN pacman -S --noconfirm --needed \
    archiso \
    squashfs-tools \
    libisoburn \
    dosfstools \
    mtools \
    grub \
    efibootmgr \
    syslinux

RUN pacman -S --noconfirm --needed \
    vim \
    nano \
    bash-completion \
    reflector

# Clean package cache
RUN pacman -Scc --noconfirm

# Create a build user with sudo privileges
RUN useradd -m -G wheel -s /bin/bash builder && \
    echo "builder ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

COPY . /workspace
# Set working directory
WORKDIR /workspace

# Make build script executable
RUN chmod +x /workspace/build-browser-os.sh || true

# Default command - run the build script
CMD ["/bin/bash", "-c", "./build-browser-os.sh"]
