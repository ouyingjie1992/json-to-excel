
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys
# import time
from fontTools.ttLib import TTFont
sourcePath = sys.argv[1]
outPath = sys.argv[2]
def get():
    font = TTFont(sourcePath)
    font.saveXML(outPath)
get()
# time.sleep(3)
# print(sys.argv[1])