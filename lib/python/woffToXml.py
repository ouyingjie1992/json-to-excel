
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys
# import time
from fontTools.ttLib import TTFont
sourcePath = sys.argv[1]
fileName = sys.argv[2]
def get():
    font = TTFont(sourcePath + fileName)
    font.saveXML(sourcePath + 'test.xml')
get()
# time.sleep(3)
# print(sys.argv[1])