import os
import pwd
import sys
import struct
import subprocess


class Plugin:


    # A normal method. It can be called from JavaScript using call_plugin_function("method_1", argument1, argument2)
    async def dictation(self, toggle):
        
        print("dictation toggle: " + str(toggle))

        # if "DISPLAY" not in os.environ:
        #     command.insert(1, ":1")
        #     command.insert(1, "-display")

        if toggle:
            # cmd = ["/home/deck/nerd-dictation/nerd-dictation", "begin", "--vosk-model-dir=/home/deck/.config/nerd-dictation/model", "--simulate-input-tool=YDOTOOL", "--input=SOX"]

            cmd = ["parec", "--file-format=wav", "/tmp/test.wav"]
            command = subprocess.run(cmd,
                                    stderr=sys.stderr,
                                    stdout=sys.stdout)
            return command.returncode == 0


            # command = subprocess.Popen(["su","deck","-c","\'/home/deck/nerd-dictation/nerd-dictation begin --vosk-model-dir=/home/deck/.config/nerd-dictation/model --simulate-input-tool=YDOTOOL --pulse-device-name=alsa_input.pci-0000_04_00.5-platform-acp5x_mach.0.HiFi__hw_acp5x_0__source"], stderr=sys.stderr, stdout=sys.stdout)
            # return command.returncode == 0

        else:
            command = subprocess.run(["/home/deck/nerd-dictation/nerd-dictation", "end"], stderr=sys.stderr, stdout=sys.stdout)
            return command.returncode == 0

        return False


    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        # command = subprocess.run(cmd, user="deck", shell=False, stderr=sys.stderr, stdout=sys.stdout)

        pass