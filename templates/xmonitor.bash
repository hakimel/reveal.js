#!/bin/bash

echo
echo "+--------------------------------------------------+"
echo "| This script watches changes to any HTML file in  |"
echo "| this folder and then sends a refresh command to  |"
echo "| the currently opened browser.                    |"
echo "+--------------------------------------------------+"
echo "| NOTE: The title of the HTML file must start with |"
echo "|       \"Reveal JS\"                                |"
echo "+--------------------------------------------------+"
echo "| This script requires (tested on Ubuntu/Linux):   |"
echo "|     1. xdotool                                   |"
echo "|     2. inotifywait                               |"
echo "+--------------------------------------------------+"
echo

# watch pattern
FILES="*.html"

# define function to be called after changes to FILES
refresh() {
    # notify action
    printf "👍"

    # search the browser window
    BROWSER=`xdotool search --name "Reveal JS"`

    # exit if we cannot find the browser window
    if [ -z "$BROWSER" ]; then
        echo
        echo "Please open the HTML file in the browser first."
        exit 0
    else
        # save the current window first
        # (e.g. the text editor you're using right now)
        CURRENT=`xdotool getwindowfocus`

        # activate the browser and send a reload command
        xdotool windowactivate $BROWSER
        xdotool key "CTRL+R"

        # re-activate the window you're using before
        xdotool windowactivate $CURRENT
    fi
}

# watch changes to FILES
while true; do
    inotifywait -q -e modify $FILES &>/dev/null
    refresh
done
