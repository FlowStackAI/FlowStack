
import os

path = r"c:\Users\amadej\Desktop\moja-spletna-stran\flowstackai.github.io\dashboard.html"

# Read file
try:
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
except Exception as e:
    print(f"Error reading file: {e}")
    exit(1)

# The range to replace is 1-based lines 462 to 482.
# In 0-based index: 461 to 482 (start inclusive, end exclusive? No, 461 is the first line to replace, 481 is the last line to replace)
# Slice [461:482] includes indices 461...481. Length is 21 lines.

# Let's verify the lines.
start_idx = 461
end_idx = 482 # Python slice end is exclusive, so this covers up to index 481 which is line 482.

print(f"Replacing lines {start_idx+1} to {end_idx}...")
for i in range(start_idx, end_idx):
    print(f"ORIG: {lines[i].strip()}")

new_options = [
    '                    <option value="sq">Shqip (Albanian)</option>\n',
    '                    <option value="ar">العربية (Arabic)</option>\n',
    '                    <option value="be">Belgian</option>\n',
    '                    <option value="bs">Bosanski (Bosnian)</option>\n',
    '                    <option value="zh">中文 (Chinese)</option>\n',
    '                    <option value="hr">Hrvatski (Croatian)</option>\n',
    '                    <option value="cs">Čeština (Czech)</option>\n',
    '                    <option value="nl">Nederlands (Dutch)</option>\n',
    '                    <option value="en" selected>English</option>\n',
    '                    <option value="fr">Français (French)</option>\n',
    '                    <option value="de">Deutsch (German)</option>\n',
    '                    <option value="mk">Македонски (Macedonian)</option>\n',
    '                    <option value="mt">Malti (Maltese)</option>\n',
    '                    <option value="me">Crnogorski (Montenegrin)</option>\n',
    '                    <option value="pt">Português (Portuguese)</option>\n',
    '                    <option value="ru">Русский (Russian)</option>\n',
    '                    <option value="sr">Српски (Serbian)</option>\n',
    '                    <option value="sk">Slovenčina (Slovak)</option>\n',
    '                    <option value="sl">Slovenščina (Slovenian)</option>\n',
    '                    <option value="es">Español (Spanish)</option>\n',
    '                    <option value="uk">Українська (Ukrainian)</option>\n'
]

lines[start_idx:end_idx] = new_options

try:
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Success writing file")
except Exception as e:
    print(f"Error writing file: {e}")
