"""Encrypt a private case study so the public page holds only ciphertext.

Usage:  python3 scripts/encrypt_page.py samsung
Reads   private/samsung.html  (never committed; see .gitignore)
Writes  samsung.html          (safe to publish)
The password is asked for at the prompt, or read from the PAGE_PASSWORD env var.
"""
import base64, getpass, os, re, sys
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

ITER = 250_000
name = sys.argv[1]
src = open(f"private/{name}.html", encoding="utf-8").read()
pw = os.environ.get("PAGE_PASSWORD") or getpass.getpass(f"Password for {name}: ")

head = src[: src.index("</head>")]
head = re.sub(r"<link href=\"https://fonts.googleapis.com[^>]*>", "", head)
start = src.index('<div id="page-content"')
start = src.index(">", start) + 1
end = src.rindex("<script>")
body = src[start:end].rstrip()
body = body[: body.rindex("</div>")]  # drop page-content's closing tag

salt, iv = os.urandom(16), os.urandom(12)
key = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=ITER).derive(pw.encode())
ct = AESGCM(key).encrypt(iv, body.encode("utf-8"), None)
b64 = lambda b: base64.b64encode(b).decode()

nav = open("scripts/gate_nav.html", encoding="utf-8").read()
gate = open("scripts/gate_template.html", encoding="utf-8").read()
out = (head + gate.replace("{{NAV}}", nav)
       .replace("{{SALT}}", b64(salt)).replace("{{IV}}", b64(iv)).replace("{{CT}}", b64(ct))
       .replace("{{ITER}}", str(ITER)).replace("{{NAME}}", name))
open(f"{name}.html", "w", encoding="utf-8").write(out)
print(f"wrote {name}.html ({len(out)//1024} KB, encrypted)")
