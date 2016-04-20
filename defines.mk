RELEASE=4.1

VERSION=4.1
PACKAGE=pve-manager
PACKAGERELEASE=32

BINDIR=${DESTDIR}/usr/bin
PERLLIBDIR=${DESTDIR}/usr/share/perl5
MAN1DIR=${DESTDIR}/usr/share/man/man1
MAN8DIR=${DESTDIR}/usr/share/man/man8
CRONDAILYDIR=${DESTDIR}/etc/cron.daily
INITDBINDIR=${DESTDIR}/etc/init.d
SERVICEDIR=${DESTDIR}/lib/systemd/system
BASHCOMPLDIR=${DESTDIR}/usr/share/bash-completion/completions/
HARADIR=${DESTDIR}/usr/share/cluster
DOCDIR=${DESTDIR}/usr/share/doc/${PACKAGE}
PODDIR=${DESTDIR}/usr/share/doc/${PACKAGE}/pod
WWWBASEDIR=${DESTDIR}/usr/share/${PACKAGE}
WWWROOTDIR=${WWWBASEDIR}/root
WWWLOCALEDIR=${WWWBASEDIR}/locale
WWWIMAGEDIR=${WWWBASEDIR}/images
WWWEXT4DIR=${WWWBASEDIR}/ext4
WWWEXT6DIR=${WWWBASEDIR}/ext6
WWWTOUCHDIR=${WWWBASEDIR}/touch
WWWCSSDIR=${WWWBASEDIR}/css
WWWFONTSDIR=${WWWBASEDIR}/css/fonts
WWWJSDIR=${WWWBASEDIR}/js
