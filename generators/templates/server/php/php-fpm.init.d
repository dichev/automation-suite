#!/bin/sh
### BEGIN INIT INFO
# Provides:          php7.0-fpm
# Required-Start:    $remote_fs $network
# Required-Stop:     $remote_fs $network
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts php7.0-fpm
# Description:       Starts The PHP FastCGI Process Manager Daemon
### END INIT INFO

# Author: Ondrej Sury <ondrej@debian.org>

PATH=/sbin:/usr/sbin:/bin:/usr/bin:/opt/phpbrew/php/php/sbin
DESC="PHP FastCGI Process Manager"
NAME=php-fpm
CONFFILE=/opt/servers-conf/php/php-fpm.conf
DAEMON=/opt/phpbrew/php/php/sbin/php-fpm
DAEMON_ARGS="--daemonize --fpm-config $CONFFILE"
CONF_PIDFILE=$(sed -n 's/^pid[ =]*//p' $CONFFILE)
PIDFILE=${CONF_PIDFILE:-/run/php-fpm.pid}
TIMEOUT=30
SCRIPTNAME=/etc/init.d/php-fpm

# Exit if the package is not installed
[ -x "$DAEMON" ] || exit 0

# Read configuration variable file if it is present
[ -r /etc/default/$NAME ] && . /etc/default/$NAME

# Load the VERBOSE setting and other rcS variables
. /lib/init/vars.sh

# Define LSB log_* functions.
# Depend on lsb-base (>= 3.0-6) to ensure that this file is present.
. /lib/lsb/init-functions

#
# Function that starts the daemon/service
#
do_start()
{
	# Return
	#   0 if daemon has been started
	#   1 if daemon was already running
	#   2 if daemon could not be started
	start-stop-daemon --start --quiet --pidfile $PIDFILE --exec $DAEMON --test > /dev/null \
		|| return 1
	start-stop-daemon --start --quiet --pidfile $PIDFILE --exec $DAEMON -- \
		$DAEMON_ARGS 2>/dev/null \
		|| return 2
	# Add code here, if necessary, that waits for the process to be ready
	# to handle requests from services started subsequently which depend
	# on this one.  As a last resort, sleep for some time.
}

#
# Function that stops the daemon/service
#
do_stop()
{
	# Return
	#   0 if daemon has been stopped
	#   1 if daemon was already stopped
	#   2 if daemon could not be stopped
	#   other if a failure occurred
	start-stop-daemon --stop --quiet --retry=QUIT/$TIMEOUT/TERM/5/KILL/5 --pidfile $PIDFILE --name $NAME
	RETVAL="$?"
	[ "$RETVAL" = 2 ] && return 2
	# Wait for children to finish too if this is a daemon that forks
	# and if the daemon is only ever run from this initscript.
	# If the above conditions are not satisfied then add some other code
	# that waits for the process to drop all resources that could be
	# needed by services started subsequently.  A last resort is to
	# sleep for some time.
	start-stop-daemon --stop --quiet --oknodo --retry=0/30/TERM/5/KILL/5 --exec $DAEMON
	[ "$?" = 2 ] && return 2
	# Many daemons don't delete their pidfiles when they exit.
	rm -f $PIDFILE
	return "$RETVAL"
}

#
# Function that sends a SIGHUP to the daemon/service
#
do_reload() {
	#
	# If the daemon can reload its configuration without
	# restarting (for example, when it is sent a SIGHUP),
	# then implement that here.
	#
	start-stop-daemon --stop --signal USR2 --quiet --pidfile $PIDFILE --name $NAME
	return 0
}

do_tmpfiles() {
    local type path mode user group

    [ "$1" != no ] && V=-v
    
    TMPFILES=/usr/lib/tmpfiles.d/php7.0-fpm.conf

    if [ -r "$TMPFILES" ]; then
	while read type path mode user group age argument; do
	    if [ "$type" = "d" ]; then
		mkdir $V -p "$path"
		chmod $V "$mode" "$path"
		chown $V "$user:$group" "$path"
	    fi
	done < "$TMPFILES"
    fi
}

case "$1" in
    start)
	if init_is_upstart; then
	    exit 1
	fi
	[ "$VERBOSE" != no ] && log_daemon_msg "Starting $DESC" "$NAME"
	do_tmpfiles $VERBOSE
	case "$?" in
	    0)
		do_start
		case "$?" in
		    0|1) [ "$VERBOSE" != no ] && log_end_msg 0 ;;
		    2) [ "$VERBOSE" != no ] && log_end_msg 1 ;;
		esac
		;;
	    1) [ "$VERBOSE" != no ] && log_end_msg 1 ;;
	esac
	;;
    stop)
	if init_is_upstart; then
	    exit 0
	fi
	[ "$VERBOSE" != no ] && log_daemon_msg "Stopping $DESC" "$NAME"
	do_stop
	case "$?" in
		0|1) [ "$VERBOSE" != no ] && log_end_msg 0 ;;
		2) [ "$VERBOSE" != no ] && log_end_msg 1 ;;
	esac
	;;
    status)
        status_of_proc "$DAEMON" "$NAME" && exit 0 || exit $?
        ;;
    reload|force-reload)
	if init_is_upstart; then
	    exit 1
	fi
    	log_daemon_msg "Reloading $DESC" "$NAME"
	do_reload
	log_end_msg $?
	;;
    reopen-logs)
	log_daemon_msg "Reopening $DESC logs" $NAME
	if start-stop-daemon --stop --signal USR1 --oknodo --quiet \
	    --pidfile $PIDFILE --exec $DAEMON
	then
	    log_end_msg 0
	else
	    log_end_msg 1
	fi
	;;
    restart)
	if init_is_upstart; then
	    exit 1
	fi
	log_daemon_msg "Restarting $DESC" "$NAME"
	do_stop
	case "$?" in
	  0|1)
		do_start
		case "$?" in
			0) log_end_msg 0 ;;
			1) log_end_msg 1 ;; # Old process is still running
			*) log_end_msg 1 ;; # Failed to start
		esac
		;;
	  *)
	  	# Failed to stop
		log_end_msg 1
		;;
	esac
	;;
    *)
	echo "Usage: $SCRIPTNAME {start|stop|status|restart|reload|force-reload}" >&2
	exit 1
    ;;
esac

:

