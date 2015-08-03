import re
import os, os.path, sys, shutil, time, subprocess
from subprocess import call

rootPath = sys.argv[1]
# jsRelPath = sys.argv[2]
# rootPath = '/Users/panagiotisthomoglou/Projects/Panoply-London'
jsRelPath = 'src/js'
# svgRelPath = 'www/svg'

jsFilesPath = rootPath + "/" + jsRelPath
# svgFilesPath = rootPath + "/" + svgRelPath

allPathStr = "{"

# JS
for root, dirs, files in os.walk(jsFilesPath):
    for file in files:
        if file.endswith(".js"):
            path = root.replace(rootPath, "")
            filename = file.replace(".js", "")
            fPath = "." + path + "/" + filename
            str = '"' + filename + '": "' + fPath + '",'
            allPathStr += str

# # SVG
# for root, dirs, files in os.walk(svgFilesPath):
#     for file in files:
#         if file.endswith(".svg"):
#             path = root.replace(rootPath, "")
#             filename = file
#             fPath = "." + path + "/" + filename
#             str = '"' + filename + '": "' + fPath + '",'
#             allPathStr += str

allPathStr = allPathStr[:-1]
allPathStr += "}"
print allPathStr

