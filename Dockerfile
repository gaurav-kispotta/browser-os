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
    sudo \
    openssh

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
    reflector \
    ncurses \
    tmux \
    screen \
    less \
    man-db \
    man-pages \
    util-linux \
    procps-ng \
    which \
    tree \
    htop

# Generate locale
RUN echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && \
    locale-gen

# Ensure proper /dev/pts configuration for PTY support
RUN mkdir -p /dev/pts && chmod 755 /dev/pts

# Clean package cache
RUN pacman -Scc --noconfirm

# Create a build user with sudo privileges
RUN useradd -m -G wheel -s /bin/bash builder && \
    echo "builder ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers && \
    echo 'builder:builder' | chpasswd

# Ensure proper TTY initialization
ENV TERM=xterm-256color
ENV SHELL=/bin/bash
ENV LC_ALL=en_US.UTF-8

# Configure bash for the builder user with minimal TTY-safe config
RUN echo 'export TERM=xterm-256color' >> /home/builder/.bashrc && \
    echo 'export SHELL=/bin/bash' >> /home/builder/.bashrc && \
    echo 'PS1="\[\e[1;32m\]\u@\h\[\e[0m\]:\[\e[1;34m\]\w\[\e[0m\]\$ "' >> /home/builder/.bashrc

# Configure SSH server
RUN mkdir -p /var/run/sshd && \
    ssh-keygen -A && \
    sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin no/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config && \
    sed -i 's/#UsePAM yes/UsePAM no/' /etc/ssh/sshd_config && \
    echo 'UseDNS no' >> /etc/ssh/sshd_config && \
    mkdir -p /home/builder/.ssh && \
    chmod 700 /home/builder/.ssh && \
    chown -R builder:builder /home/builder/.ssh

# Create workspace directory
RUN mkdir -p /workspace && \
    chown -R builder:builder /workspace
# Set working directory
WORKDIR /workspace

# Default command - run the build script
CMD ["/bin/bash", "-c", "./build-browser-os.sh"]
