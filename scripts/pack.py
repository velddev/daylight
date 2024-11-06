# run yarn build

import os
import subprocess
import shutil


def run(cmd):
    print(cmd)
    subprocess.run(cmd, shell=True, check=True)


def main():
    os.chdir(os.path.dirname(__file__) + "/..")
    run("yarn build")

    # if not exists, create a package folder
    if os.path.exists("package"):
        print("Removing old package folder...")
        shutil.rmtree("package")

    os.mkdir("package")
    # copy files to package folder
    print("packing html files...")
    os.mkdir("package/html")
    run("cp -r dist/* package/")

    print("packing manifest file...")
    run("cp manifest.json package/")


main()
